import axios from "axios";

export const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const nextServer = axios.create({
  baseURL: "/api", 
  withCredentials: true,
});