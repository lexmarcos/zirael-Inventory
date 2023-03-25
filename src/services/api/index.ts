// src/api.js
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/api", // Substitua pela URL base da sua API
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthToken = (token: string) => {
  if (token) {
    Cookies.set("authorization", token, { expires: 1 });
    // Aplicar o token JWT ao header Authorization
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Remover o header Authorization
    delete api.defaults.headers.common["Authorization"];
  }
};

export { api, setAuthToken };
