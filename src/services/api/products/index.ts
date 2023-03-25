import { api } from "..";

interface IProductInsertData {
  name: string; // Nome do produto
  category: string; // Referência à categoria do produto na coleção 'categories'
  brand: string; // Referência à marca do produto na coleção 'brands'
  description: String; // Descrição do produto
  price: Number; // Preço do produto
  imageUrl: String; // URL da imagem do produto (opcional)
  sku: String; // Código único do produto (Stock Keeping Unit)
  attributes: Object; // Atributos adicionais do produto, como cor, tamanho, etc.
}

export const getProducts = async () => {
  return await api.get("/products");
};

export const getProductsTypes = async (name?: string) => {
  return await api.get("/products/type", { params: { name } });
};

export const getProduct = async (id: string) => {
  return await api.get(`/products/${id}`);
};

export const insertProduct = async (data: IProductInsertData) => {
  return await api.post("/products", data);
};

export const updateProduct = async (id: string, data: IProductInsertData) => {
  return await api.put(`/products/${id}`, data);
};

export const deleteProduct = async (id: string) => {
  return await api.delete(`/products/${id}`);
};
