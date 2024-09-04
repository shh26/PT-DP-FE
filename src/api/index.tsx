import axios, { AxiosInstance } from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
