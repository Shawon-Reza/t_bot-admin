import { axiosApi } from "../services/axios_instances";

export const countryApi = {
  getAll: (params = {}) => axiosApi.get("/api/v1/country", { params }),
  getById: (id) => axiosApi.get(`/api/v1/country/${id}`),
  create: (data) => axiosApi.post("/api/v1/country", data),
  update: (id, data) => axiosApi.patch(`/api/v1/country/${id}`, data),
  delete: (id) => axiosApi.delete(`/api/v1/country/${id}`),
  toggleStatus: (id, isActive) => axiosApi.patch(`/api/v1/country/${id}`, { isActive }),
};

export const queryKeys = {
  countries: (params = {}) => ["countries", params],
  country: (id) => ["country", id],
};