import { axiosApi } from "../services/axios_instances";

const basePath = "/api/v1/service-specific-country";

export const serviceSpecificCountryApi = {
  getAll: (params = {}) => axiosApi.get(basePath, { params }),
  getByService: (serviceId, params = {}) => axiosApi.get(`${basePath}/service/${serviceId}/countries`, { params }),
  getById: (id) => axiosApi.get(`${basePath}/${id}`),
  create: (data) => axiosApi.post(basePath, data),
  update: (id, data) => axiosApi.patch(`${basePath}/${id}`, data),
  updateStatus: (id, isActive) => axiosApi.patch(`${basePath}/${id}/status`, { isActive }),
  delete: (id) => axiosApi.delete(`${basePath}/${id}`),
};

export const queryKeys = {
  serviceSpecificCountries: (params = {}) => ["service-specific-countries", params],
};
