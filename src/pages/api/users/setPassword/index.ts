// api/users/setPassword/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import clientPromise from "@/services/mongo";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === "POST") {
    const { inviteCode, password } = req.body;

    if (!inviteCode || !password) {
      res.status(400).json({ error: "Invite code and password are required" });
      return;
    }

    const db = (await clientPromise).db("zirael");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ inviteCode });

    if (!user) {
      res.status(400).json({ error: "Invalid invite code" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.updateOne({ inviteCode }, { $set: { password: hashedPassword }, $unset: { inviteCode: 1 } });

    res.status(200).json({ message: "Password set successfully" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
