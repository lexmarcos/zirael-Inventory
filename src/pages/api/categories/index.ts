import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/services/mongo";
import { validateField } from "@/utils/validateField";
import authMiddleware from "@/utils/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = (await clientPromise).db("zirael");
  const categoriesCollection = db.collection("categories");

  const { method } = req;

  switch (method) {
    case "GET": {
      try {
        const categories = await categoriesCollection.find().toArray();
        res.status(200).json(categories);
      } catch (error) {
        res.status(500).json({ error: "Error fetching categories" });
      }
      break;
    }
    case "POST": {
      try {
        const categories = Array.isArray(req.body) ? req.body : [req.body];
        const createdCategories = [];
        let errorIndexes = [];

        for (let i = 0; i < categories.length; i++) {
          const { name, description } = categories[i];
          let hasError = false;

          hasError = hasError || validateField(!name, `Name is required for category ${i}`, res);
          hasError = hasError || validateField(!description, `Description is required for category ${i}`, res);

          if (hasError) {
            errorIndexes.push(i);
            continue;
          }

          const newCategory = {
            name,
            description,
          };

          const result = await categoriesCollection.insertOne(newCategory);

          createdCategories.push({ categoryId: result.insertedId });
        }

        if (errorIndexes.length > 0) {
          return res.status(400).json({ error: `Invalid data in categories indexes ${errorIndexes}` });
        }

        res.status(201).json({ message: "Categories created successfully", categories: createdCategories });
      } catch (error) {
        res.status(500).json({ error: "Error creating category" });
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
