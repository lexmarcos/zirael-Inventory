import { ObjectId } from "mongodb";

export interface Iinventory{
    _id: ObjectId,
    product: ObjectId, // Referência ao produto na coleção 'products'
    quantity: Number, // Quantidade em estoque
    location: String, // Localização do produto no estoque (opcional)
    lastUpdated: Date // Data da última atualização do estoque
}