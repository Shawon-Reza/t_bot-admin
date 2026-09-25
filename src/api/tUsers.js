import { axiosApi } from "../services/axios_instances";

const basePath = "/api/v1/t-user";

export const tUserApi = {
  getAll: (params = {}) => axiosApi.get(basePath, { params }),
  getById: (id) => axiosApi.get(`${basePath}/${id}`),
  updateStatus: (id, userStatus, note) => axiosApi.patch(`${basePath}/${id}/status`, { userStatus, note }),
};

export const queryKeys = {
  tUsers: (params = {}) => ["t-users", params],
  tUser: (id) => ["t-user", id],
};
