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
  const productsCollection = db.collection("products");

  switch (method) {
    case "GET": {
      try {
        const product = await productsCollection.findOne({ _id: new ObjectId(id) });
        if (product) {
          res.status(200).json(product);
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching product" });
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

        if (updateData.category) {
          hasError = hasError || validateField(!updateData.category, "Category is required", res);
        }

        if (updateData.brand) {
          hasError = hasError || validateField(!updateData.brand, "Brand is required", res);
        }

        if (updateData.description) {
          hasError = hasError || validateField(!updateData.description, "Description is required", res);
        }

        if (updateData.price) {
          hasError = hasError || validateField(typeof updateData.price !== "number" || updateData.price <= 0, "Invalid price", res);
        }

        if (updateData.imageUrl) {
          hasError = hasError || validateField(!updateData.imageUrl, "Image URL is required", res);
        }

        if (updateData.sku) {
          hasError = hasError || validateField(!updateData.sku, "SKU is required", res);
        }

        if (updateData.attributes) {
          hasError = hasError || validateField(typeof updateData.attributes !== "object", "Invalid attributes", res);
        }

        if (hasError) return;

        if (updateData.category) {
          updateData.category = new ObjectId(updateData.category);
        }

        if (updateData.brand) {
          updateData.brand = new ObjectId(updateData.brand);
        }

        await productsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        res.status(200).json({ message: "Product updated successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error updating product" });
      }
      break;
    }
    case "DELETE": {
      try {
        const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
          res.status(200).json({ message: "Product deleted" });
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error deleting product" });
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
