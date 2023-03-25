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

  const db = (await clientPromise).db("zirael");
  const brandsCollection = db.collection("brands");
  // Verifique se o ID é uma string.

  if (typeof id !== "string") {
    res.status(400).json({ error: "Invalid ID format" });
    return;
  }

  switch (method) {
    case "GET": {
      try {
        const brand = await brandsCollection.findOne({ _id: new ObjectId(id) });
        if (brand) {
          res.status(200).json(brand);
        } else {
          res.status(404).json({ error: "Brand not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching brand" });
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

        if (updateData.name) {
          hasError = hasError || validateField(!updateData.name, "Name is required", res);
        }

        if (updateData.description) {
          hasError = hasError || validateField(!updateData.description, "Description is required", res);
        }

        if (hasError) return;

        await brandsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        res.status(200).json({ message: "Brand updated successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error updating brand" });
      }
      break;
    }
    case "DELETE": {
      try {
        const result = await brandsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
          res.status(200).json({ message: "Brand deleted" });
        } else {
          res.status(404).json({ error: "Brand not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error deleting brand" });
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
