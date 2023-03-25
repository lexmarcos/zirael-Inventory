import { ObjectId } from "mongodb";

export interface ICategories {
  _id: ObjectId | string;
  name: String; // Exemplo: "Cosméticos", "Roupas", "Sandálias", "Roupas Íntimas", "Perfumes", "Bolsas"
  description: String; // Descrição opcional da categoria
}
