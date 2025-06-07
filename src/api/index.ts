import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_CARTAO_ISENTO_API_URL
});
