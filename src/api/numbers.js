import { axiosApi } from "../services/axios_instances";

const basePath = "/api/v1/number";

export const numberApi = {
  getAll: (params = {}) => axiosApi.get(basePath, { params }),
  getById: (id) => axiosApi.get(`${basePath}/${id}`),
  import: (rangeId, numbers) => axiosApi.post(`${basePath}/import`, { rangeId, numbers }),
  updateStatus: (id, status) => axiosApi.patch(`${basePath}/${id}/status`, { status }),
  delete: (id) => axiosApi.delete(`${basePath}/${id}`),
};

export const queryKeys = {
  numbers: (params = {}) => ["numbers", params],
  number: (id) => ["number", id],
};
