import { api } from "..";

interface IBrandInsertData {
  name: String; // Exemplo: "Avon", "Natura", "O Boticário"
  description: String; // Descrição opcional da marca
}

export const getBrands = async () => {
  return await api.get("/brands");
};

export const getBrand = async (id: string) => {
  return await api.get(`/brands/${id}`);
};

export const insertBrand = async (data: IBrandInsertData) => {
  return await api.post("/brands", data);
};

export const updateBrand = async (id: string, data: IBrandInsertData) => {
  return await api.put(`/brands/${id}`, data);
};

export const deleteBrand = async (id: string) => {
  return await api.delete(`/brands/${id}`);
};
