// utils/authMiddleware.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const authMiddleware = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    let token = req.headers.cookie?.split("=")[1];
    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      // Adicione o objeto decodificado ao objeto de solicitação para que possa ser acessado no manipulador
      (req as any).user = decoded;
      await handler(req, res);
    } catch (error) {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};

export default authMiddleware;
