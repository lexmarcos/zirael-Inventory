import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/services/mongo";
import { validateField } from "@/utils/validateField";
import authMiddleware from "@/utils/authMiddleware";
import { ObjectId } from "mongodb";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = (await clientPromise).db("zirael");
  const productsTypesCollection = db.collection("productsTypes");

  const { method } = req;

  switch (method) {
    case "GET": {
      try {
        const { name } = req.query;

        // Se o parâmetro de consulta "name" estiver presente, use-o para filtrar os resultados
        const query = name ? { name: new RegExp(name as string, "i") } : {};

        const productsTypes = await productsTypesCollection.find(query).toArray();
        res.status(200).json(productsTypes);
      } catch (error) {
        res.status(500).json({ error: "Error fetching productsTypes" });
      }
      break;
    }
    case "POST": {
      try {
        const productsTypes = Array.isArray(req.body) ? req.body : [req.body];
        const createdProductsTypes = [];
        let errorIndexes = [];

        for (let i = 0; i < productsTypes.length; i++) {
          const { name, categoryId, attributes } = productsTypes[i];
          let hasError = false;

          hasError =
            hasError || validateField(!name, `Name is required for product type ${i}`, res);
          hasError =
            hasError ||
            validateField(!categoryId, `CategoryId is required for product type ${i}`, res);
          hasError =
            hasError ||
            validateField(
              !attributes.length,
              `Some attribute is required for product type ${i}`,
              res
            );
          if (hasError) {
            errorIndexes.push(i);
            continue;
          }

          const newCategory = {
            name,
            categoryId: new ObjectId(categoryId),
            attributes,
          };

          const result = await productsTypesCollection.insertOne(newCategory);

          createdProductsTypes.push({ categoryId: result.insertedId });
        }

        if (errorIndexes.length > 0) {
          return res
            .status(400)
            .json({ error: `Invalid data in productsTypes indexes ${errorIndexes}` });
        }

        res.status(201).json({
          message: "ProductsTypes created successfully",
          productsTypes: createdProductsTypes,
        });
      } catch (error) {
        res.status(500).json({ error: "Error creating product type" });
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
