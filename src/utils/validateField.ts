import { NextApiResponse } from "next";

export const validateField = (booleanCheck: boolean, errorMessage: string, res: NextApiResponse): boolean => {
  if (booleanCheck) {
    res.status(400).json({ error: errorMessage });
    return true;
  }
  return false;
};
