import axios from "axios";





export const base_URL = "http://localhost:5000";

// Create an Axios instance with the base URL and default headers
export const axiosApi = axios.create({
    baseURL: base_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Create another Axios instance for API requests
export const api = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com/posts",
    headers: {
        "Content-Type": "application/json",
    },
});

// Authentication is handled by the httpOnly cookie set by the backend.
axiosApi.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

