import { ObjectId } from "mongodb";

export interface IUser{
    _id: ObjectId,
    firstName: String, // Primeiro nome do usuário
    lastName: String, // Sobrenome do usuário
    email: String, // E-mail do usuário, usado como nome de usuário para login
    passwordHash: String, // Hash da senha do usuário (NUNCA armazene senhas em texto simples)
    role: String, // Função do usuário, por exemplo: "admin", "manager", "employee"
    isActive: Boolean, // Status do usuário: ativo ou inativo
    createdAt: Date, // Data de criação da conta do usuário
    updatedAt: Date, // Data da última atualização da conta do usuário
}