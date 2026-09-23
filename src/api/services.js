import { axiosApi } from "../services/axios_instances";

axiosApi.defaults.withCredentials = true;

export const serviceApi = {
  getAll: (params = {}) => axiosApi.get("/api/v1/service", { params }),
  getById: (id) => axiosApi.get(`/api/v1/service/${id}`),
  create: (data) => axiosApi.post("/api/v1/service", data),
  update: (id, data) => axiosApi.patch(`/api/v1/service/${id}`, data),
  delete: (id) => axiosApi.delete(`/api/v1/service/${id}`),
  toggleStatus: (id, isActive) => axiosApi.patch(`/api/v1/service/${id}`, { isActive }),
};

export const queryKeys = {
  services: (params = {}) => ["services", params],
  service: (id) => ["service", id],
};