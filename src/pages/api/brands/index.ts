import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/services/mongo";
import { validateField } from "@/utils/validateField";
import authMiddleware from "@/utils/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = (await clientPromise).db("zirael");
  const brandsCollection = db.collection("brands");

  const { method } = req;

  switch (method) {
    case "GET": {
      try {
        const brands = await brandsCollection.find().toArray();
        res.status(200).json(brands);
      } catch (error) {
        res.status(500).json({ error: "Error fetching brands" });
      }
      break;
    }
    case "POST": {
      try {
        const { name, description } = req.body;

        // Validação de campos
        let hasError = false;

        hasError = hasError || validateField(!name, "Name is required", res);
        hasError = hasError || validateField(!description, "Description is required", res);

        if (hasError) return;

        const newBrand = {
          name,
          description,
        };

        const result = await brandsCollection.insertOne(newBrand);

        res.status(201).json({ message: "Brand created successfully", brandId: result.insertedId });
      } catch (error) {
        res.status(500).json({ error: "Error creating brand" });
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
