import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, Db, ObjectId } from "mongodb";
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
  const usersCollection = db.collection("users");

  switch (method) {
    case "GET": {
      try {
        const user = await usersCollection.findOne({ _id: new ObjectId(id as string) });
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ error: "User not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
      }
      break;
    }
    case "PUT": {
      try {
        const { email, password, ...updateData } = req.body;

        if (Object.keys(updateData).length === 0) {
          res.status(400).json({ error: "No data to update" });
          return;
        }

        // Validação de campos
        let hasError = false;

        if (updateData.firstName) {
          hasError = hasError || validateField(!updateData.firstName, "First name is required", res);
        }

        if (updateData.lastName) {
          hasError = hasError || validateField(!updateData.lastName, "Last name is required", res);
        }

        if (updateData.role) {
          hasError = hasError || validateField(!["admin", "user"].includes(updateData.role), "Invalid role", res);
        }

        if (updateData.isActive !== undefined) {
          hasError = hasError || validateField(typeof updateData.isActive !== "boolean", "Invalid isActive value", res);
        }

        if (hasError) return;

        await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        res.status(200).json({ message: "User updated successfully" });
        break;
      } catch (error) {
        res.status(500).json({ error: "Error updating user" });
      }
      break;
    }
    case "DELETE": {
      try {
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id as string) });
        if (result.deletedCount > 0) {
          res.status(200).json({ message: "User deleted" });
        } else {
          res.status(404).json({ error: "User not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
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
