import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/services/mongo";
import { ObjectId } from "mongodb";
import { validateField } from "@/utils/validateField";
import authMiddleware from "@/utils/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = (await clientPromise).db("zirael");
  const productsCollection = db.collection("products");

  const { method } = req;

  switch (method) {
    case "GET": {
      try {
        const products = await productsCollection.find().toArray();
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ error: "Error fetching products" });
      }
      break;
    }
    case "POST": {
      try {
        const { name, category, brand, description, price, imageUrl, sku, attributes } = req.body;

        // Validação de campos
        let hasError = false;

        hasError = hasError || validateField(!name, "Name is required", res);
        hasError = hasError || validateField(!category, "Category is required", res);
        hasError = hasError || validateField(!brand, "Brand is required", res);
        hasError = hasError || validateField(!description, "Description is required", res);
        hasError =
          hasError ||
          validateField(!price || typeof price !== "number" || price <= 0, "Invalid price", res);
        hasError = hasError || validateField(!imageUrl, "Image URL is required", res);
        hasError =
          hasError ||
          validateField(!attributes || typeof attributes !== "object", "Invalid attributes", res);

        if (hasError) return;

        const newProduct = {
          name,
          category: new ObjectId(category),
          brand: new ObjectId(brand),
          description,
          price,
          imageUrl,
          sku,
          attributes,
        };

        const result = await productsCollection.insertOne(newProduct);

        res
          .status(201)
          .json({ message: "Product created successfully", productId: result.insertedId });
      } catch (error) {
        res.status(500).json({ error: "Error creating product" });
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
