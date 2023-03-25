import { ObjectId } from "mongodb";

export interface IBrand {
  _id: ObjectId | string;
  name: String; // Exemplo: "Avon", "Natura", "O Boticário"
  description: String; // Descrição opcional da marca
}
