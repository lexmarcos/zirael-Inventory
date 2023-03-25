import { ObjectId } from "mongodb";

export interface IProduct {
    _id: ObjectId,
    name: string, // Nome do produto
    category: ObjectId, // Referência à categoria do produto na coleção 'categories'
    brand: ObjectId, // Referência à marca do produto na coleção 'brands'
    description: String, // Descrição do produto
    price: Number, // Preço do produto
    imageUrl: String, // URL da imagem do produto (opcional)
    sku: String, // Código único do produto (Stock Keeping Unit)
    attributes: Object // Atributos adicionais do produto, como cor, tamanho, etc.
}