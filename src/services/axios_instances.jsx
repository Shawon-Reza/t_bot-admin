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

// Request interceptor to add the access token to the Authorization header
axiosApi.interceptors.request.use((config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (auth?.access) {
        config.headers.Authorization = `Bearer ${auth.access}`;
    }

    return config;
});

// Response interceptor to handle token refresh on 401 errors
axiosApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const auth = JSON.parse(localStorage.getItem("auth"));

            if (!auth?.refresh) {
                localStorage.removeItem("auth");
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(
                    `${base_URL}/api/token/refresh/`,
                    {
                        refresh: auth.refresh,
                    }
                );

                localStorage.setItem(
                    "auth",
                    JSON.stringify({
                        ...auth,
                        access: data.access,
                    })
                );

                originalRequest.headers.Authorization = `Bearer ${data.access}`;

                return axiosApi(originalRequest);
            } catch (err) {
                localStorage.removeItem("auth");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

