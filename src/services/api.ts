import axios from "axios";

export const api = axios.create({
  baseURL: "http://3.222.87.163/desafio",
});

export const getClients = async () => {
  const response = await api.get("/v1/clientes");
  return response.data;
};

export const getFunds = async () => {
  const response = await api.get("/v1/fundos");
  return response.data;
};

export const getSituations = async () => {
  const response = await api.get("/v1/situacoes");
  return response.data;
};

export const searchTickets = async () => {
  const response = await api.get("/v1/boletas-cota-fundo/pesquisar");
  return response.data;
};
