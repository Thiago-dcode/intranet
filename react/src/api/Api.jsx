import axios from "axios";
import ls from "localstorage-slim";
const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": `multipart/form-data`,
    Accept: "application/json",
  },
});

Api.interceptors.request.use((config) => {
  const token = ls.get("ACCESS_TOKEN");

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});
Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response.status === 401) {
      ls.remove("ACCESS_TOKEN");
    }
    throw error;
  }
);
export default Api;
