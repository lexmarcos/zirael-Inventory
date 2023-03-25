import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, Db } from "mongodb";
import clientPromise from "@/services/mongo";
import validator from "validator";
import bcrypt from "bcryptjs";
import authMiddleware from "@/utils/authMiddleware";

const validateField = (booleanCheck: boolean, errorMessage: string, res: NextApiResponse): boolean => {
  if (booleanCheck) {
    res.status(400).json({ error: errorMessage });
    return true;
  }
  return false;
};
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = (await clientPromise).db("zirael");
  const usersCollection = db.collection("users");

  const { method } = req;

  switch (method) {
    case "GET": {
      try {
        const users = await usersCollection.find().toArray();

        // Remove o campo 'passwordHash' de cada objeto de usuário
        const sanitizedUsers = users.map((user) => {
          const { passwordHash, ...rest } = user;
          return rest;
        });
        res.status(200).json(sanitizedUsers);
      } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
      }
      break;
    }
    case "POST": {
      try {
        const { firstName, lastName, email, role, isActive, createdAt, updatedAt, inviteCode } = req.body;

        // Validação de campos
        let hasError = false;

        hasError = hasError || validateField(!firstName || !lastName, "First name and last name are required", res);
        hasError = hasError || validateField(!validator.isEmail(email), "Invalid email address", res);
        hasError = hasError || validateField(!["admin", "user"].includes(role), "Invalid role", res);
        hasError = hasError || validateField(typeof isActive !== "boolean", "Invalid isActive value", res);
        hasError =
          hasError ||
          validateField(
            !createdAt || !updatedAt || isNaN(Date.parse(createdAt)) || isNaN(Date.parse(updatedAt)),
            "Invalid createdAt or updatedAt values",
            res
          );
        hasError = hasError || validateField(!inviteCode, "Invite code is required", res);

        if (hasError) return;

        // Conexão com o banco de dados
        const db = (await clientPromise).db("zirael");
        const usersCollection = db.collection("users");

        // Verificar se o e-mail já está em uso
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          res.status(400).json({ error: "Email already in use" });
          return;
        }

        // Inserir novo usuário com dados fornecidos
        const newUser = {
          firstName,
          lastName,
          email,
          role,
          isActive,
          createdAt,
          updatedAt,
          inviteCode,
        };

        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: "User created successfully", user: newUser });
        break;
      } catch (error) {
        res.status(500).json({ error: "Error creating user" });
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
