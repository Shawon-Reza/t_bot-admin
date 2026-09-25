import { axiosApi } from '../services/axios_instances';

const basePath = '/api/v1/withdrawal';

export const withdrawalApi = {
  getAll: (params = {}) => axiosApi.get(basePath, { params }),
  updateStatus: (id, status, adminNote) => axiosApi.patch(`${basePath}/${id}/status`, { status, adminNote }),
  getSettings: () => axiosApi.get(`${basePath}/settings`),
  updateSettings: (minimumWithdrawalAmount) => axiosApi.patch(`${basePath}/settings`, { minimumWithdrawalAmount }),
};

export const queryKeys = {
  withdrawals: (params = {}) => ['withdrawals', params],
  withdrawalSettings: () => ['withdrawal-settings'],
};