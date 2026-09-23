import { axiosApi } from "../services/axios_instances";

export const authApi = {
    signIn: (credentials) => axiosApi.post("/api/v1/auth/signIn", credentials),
    signOut: () => axiosApi.post("/api/v1/auth/signOut"),
};

export const authStorage = {
    getUser: () => {
        try {
            return JSON.parse(sessionStorage.getItem("authUser")) || null;
        } catch {
            return null;
        }
    },
    setUser: (user) => sessionStorage.setItem("authUser", JSON.stringify(user)),
    clear: () => sessionStorage.removeItem("authUser"),
};