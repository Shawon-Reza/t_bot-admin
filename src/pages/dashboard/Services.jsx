import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi, queryKeys } from '../../api/services';
import {
  FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiEye,
  FiChevronDown, FiDownload, FiRefreshCw, FiLock, FiUnlock, FiX
} from 'react-icons/fi';

const Services = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', otpRate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = {
    search: searchTerm || undefined,
    isActive: statusFilter === 'all' ? undefined : String(statusFilter === 'active'),
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.services(params),
    queryFn: () => serviceApi.getAll(params),
    select: (response) => {
      const result = response.data?.result;
      return {
        items: Array.isArray(result?.data) ? result.data : [],
        meta: result?.meta || { total: 0 },
      };
    },
    placeholderData: (previousData) => previousData,
  });

  const services = data?.items || [];
  const totalCount = data?.meta?.total ?? services.length;

  const createMutation = useMutation({
    mutationFn: (newService) => serviceApi.create(newService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      handleCloseModal();
      console.log('Service created successfully');
    },
    onError: (error) => {
      console.error('Failed to create service:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => serviceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      handleCloseModal();
      console.log('Service updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update service:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => serviceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      console.log('Service deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete service:', error);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }) => serviceApi.toggleStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      console.log('Service status changed successfully');
    },
    onError: (error) => {
      console.error('Failed to change service status:', error);
    },
  });

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        otpRate: service.otpRate,
      });
    } else {
      setEditingService(null);
      setFormData({ name: '', otpRate: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({ name: '', otpRate: '' });
    setIsSubmitting(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      otpRate: parseFloat(formData.otpRate),
    };

    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (id, isActive) => {
    statusMutation.mutate({ id, isActive: !isActive });
  };

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || statusMutation.isPending;

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
  };

  const filteredServices = services;

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-700">Failed to load services. Please try again.</p>
          <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-gray-600">Manage services for OTP verification</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors" disabled={isMutating}>
          <FiPlus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button onClick={() => console.log('Export services')} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
            <button onClick={() => refetch()} className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" title="Refresh">
              <FiRefreshCw className="w-5 h-5 text-gray-500" />
            </button>
            <button onClick={() => handleOpenModal()} className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors" disabled={isMutating}>
              <FiPlus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price/OTP</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Numbers</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">No services found</td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⚙</span>
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">${Number(service.otpRate).toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${service.isActive ? statusColors.active : statusColors.inactive}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">—</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{service.createdAt ? new Date(service.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { console.log('View service:', service); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="View">
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenModal(service)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Edit" disabled={isMutating}>
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleStatusChange(service.id, service.isActive)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title={service.isActive ? 'Deactivate' : 'Activate'} disabled={isMutating}>
                          {service.isActive ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDelete(service.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete" disabled={isMutating}>
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filteredServices.length} of {totalCount} services</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors" disabled><FiChevronDown className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"><FiChevronDown className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" disabled={isMutating}><FiX className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g., WhatsApp" required disabled={isMutating} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per OTP ($)</label>
                <input type="number" step="0.01" min="0" name="otpRate" value={formData.otpRate} onChange={(e) => setFormData({...formData, otpRate: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="0.15" required disabled={isMutating} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors" disabled={isMutating}>Cancel</button>
                <button type="submit" disabled={isMutating || isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : (editingService ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;