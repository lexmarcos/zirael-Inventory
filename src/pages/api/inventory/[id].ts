import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/services/mongo";
import { validateField } from "@/utils/validateField";
import authMiddleware from "@/utils/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  // Verifique se o ID é uma string.
  if (typeof id !== "string") {
    res.status(400).json({ error: "Invalid ID format" });
    return;
  }

  const db = (await clientPromise).db("zirael");
  const inventoryCollection = db.collection("inventory");

  switch (method) {
    case "GET": {
      try {
        const item = await inventoryCollection.findOne({ _id: new ObjectId(id) });
        if (item) {
          res.status(200).json(item);
        } else {
          res.status(404).json({ error: "Inventory item not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching inventory item" });
      }
      break;
    }
    case "PUT": {
      try {
        const updateData = req.body;

        if (Object.keys(updateData).length === 0) {
          res.status(400).json({ error: "No data to update" });
          return;
        }

        // Validação de campos
        let hasError = false;

        if (updateData.product) {
          hasError = hasError || validateField(!updateData.product, "Product is required", res);
        }

        if (updateData.quantity) {
          hasError = hasError || validateField(typeof updateData.quantity !== "number" || updateData.quantity < 0, "Invalid quantity", res);
        }

        if (updateData.location) {
          hasError = hasError || validateField(!updateData.location, "Location is required", res);
        }

        if (hasError) return;

        if (updateData.product) {
          updateData.product = new ObjectId(updateData.product);
        }

        updateData.lastUpdated = new Date();

        await inventoryCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        res.status(200).json({ message: "Inventory item updated successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error updating inventory item" });
      }
      break;
    }
    case "DELETE": {
      try {
        const result = await inventoryCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
          res.status(200).json({ message: "Inventory item deleted" });
        } else {
          res.status(404).json({ error: "Inventory item not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error deleting inventory item" });
      }
      break;
    }
    default: {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}

export default authMiddleware(handler);
