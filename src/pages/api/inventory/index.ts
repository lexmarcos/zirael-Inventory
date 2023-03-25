import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/services/mongo";
import { validateField } from "@/utils/validateField";
import { ObjectId } from "mongodb";
import authMiddleware from "@/utils/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = (await clientPromise).db("zirael");
  const inventoryCollection = db.collection("inventory");

  const { method } = req;

  switch (method) {
    case "GET": {
      try {
        const inventory = await inventoryCollection.find().toArray();
        res.status(200).json(inventory);
      } catch (error) {
        res.status(500).json({ error: "Error fetching inventory" });
      }
      break;
    }
    case "POST": {
      try {
        const { product, quantity, location, lastUpdated } = req.body;

        // Validação de campos
        let hasError = false;

        hasError = hasError || validateField(!product, "Product is required", res);
        hasError = hasError || validateField(!quantity || typeof quantity !== "number" || quantity < 0, "Invalid quantity", res);
        hasError = hasError || validateField(!location, "Location is required", res);
        hasError = hasError || validateField(!lastUpdated || isNaN(Date.parse(lastUpdated)), "Invalid lastUpdated date", res);

        if (hasError) return;

        const newInventoryItem = {
          product: new ObjectId(product),
          quantity,
          location,
          lastUpdated: new Date(),
        };

        const result = await inventoryCollection.insertOne(newInventoryItem);

        res.status(201).json({ message: "Inventory item created successfully", inventoryId: result.insertedId });
      } catch (error) {
        res.status(500).json({ error: "Error creating inventory item" });
      }
      break;
    }
    default: {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}

export default authMiddleware(handler);
