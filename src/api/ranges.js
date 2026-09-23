import { axiosApi } from "../services/axios_instances";

export const rangeApi = {
  getAll: (params = {}) => axiosApi.get("/api/v1/range", { params }),
  getById: (id) => axiosApi.get(`/api/v1/range/${id}`),
  create: (data) => axiosApi.post("/api/v1/range", data),
  update: (id, data) => axiosApi.patch(`/api/v1/range/${id}`, data),
  delete: (id) => axiosApi.delete(`/api/v1/range/${id}`),
  toggleStatus: (id, isActive) => axiosApi.patch(`/api/v1/range/${id}/status`, { isActive }),
};

export const queryKeys = {
  ranges: (params = {}) => ["ranges", params],
  range: (id) => ["range", id],
};
