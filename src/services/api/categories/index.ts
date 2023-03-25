import { ICategories } from "@/pages/api/categories/types";
import { api } from "..";

interface ICategorieInsertData {
  name: string;
  description: string;
}

export const getCategories = async () => {
  return await api.get<ICategories[]>("/categories");
};

export const getCategory = async (id: string) => {
  return await api.get(`/categories/${id}`);
};

export const insertCategory = async (data: ICategorieInsertData) => {
  return await api.post("/categories", data);
};
