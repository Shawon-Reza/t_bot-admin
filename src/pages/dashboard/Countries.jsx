import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { countryApi, queryKeys } from '../../api/countries';
import {
  FiPlus, FiSearch, FiEdit, FiTrash2, FiEye,
  FiChevronDown, FiGlobe, FiLock, FiUnlock, FiDownload, FiRefreshCw, FiX
} from 'react-icons/fi';

const Countries = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', dialCode: '' });

  const params = {
    search: searchTerm || undefined,
    isActive: statusFilter === 'all' ? undefined : String(statusFilter === 'active'),
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.countries(params),
    queryFn: () => countryApi.getAll(params),
    select: (response) => {
      const result = response.data?.data;
      return {
        items: Array.isArray(result?.data) ? result.data : [],
        meta: result?.meta || { total: 0 },
      };
    },
    placeholderData: (previousData) => previousData,
  });


  const countries = data?.items || [];
  const totalCount = data?.meta?.total ?? countries.length;

    console.log('Countries data:', countries);


  const invalidateCountries = () => queryClient.invalidateQueries({ queryKey: ['countries'] });
  const createMutation = useMutation({ mutationFn: (country) => countryApi.create(country), onSuccess: () => { invalidateCountries(); handleCloseModal(); } });
  const updateMutation = useMutation({ mutationFn: ({ id, country }) => countryApi.update(id, country), onSuccess: () => { invalidateCountries(); handleCloseModal(); } });
  const deleteMutation = useMutation({ mutationFn: (id) => countryApi.delete(id), onSuccess: invalidateCountries });
  const statusMutation = useMutation({ mutationFn: ({ id, isActive }) => countryApi.toggleStatus(id, isActive), onSuccess: invalidateCountries });
  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || statusMutation.isPending;

  const handleOpenModal = (country = null) => {
    if (country) {
      setEditingCountry(country);
      setFormData({ name: country.name, code: country.code || '', dialCode: country.dialCode || '' });
    } else {
      setEditingCountry(null);
      setFormData({ name: '', code: '', dialCode: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCountry(null);
    setFormData({ name: '', code: '', dialCode: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCountry) {
      updateMutation.mutate({ id: editingCountry.id, country: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (id, isActive) => {
    statusMutation.mutate({ id, isActive: !isActive });
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
  };

  if (isLoading) return <div className="p-6 lg:p-8"><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" /></div></div>;
  if (isError) return <div className="p-6 lg:p-8"><div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"><p className="text-red-700">Failed to load countries.</p><button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Retry</button></div></div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Countries</h1>
          <p className="mt-1 text-gray-600">Manage countries for number allocation</p>
        </div>
          <button onClick={() => handleOpenModal()} disabled={isMutating} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
          <FiPlus className="w-5 h-5" />
          Add Country
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search countries..."
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
            <button onClick={() => refetch()} className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50" title="Refresh">
              <FiRefreshCw className="w-5 h-5 text-gray-500" />
            </button>
            <button onClick={() => console.log('Export countries')} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dial Code</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ranges</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Numbers</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {countries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-500">No countries found</td>
                </tr>
              ) : (
                countries.map((country) => (
                  <tr key={country.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl"><FiGlobe /></span>
                        <div>
                          <p className="font-medium text-gray-900">{country.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 font-mono uppercase">{country.code}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{country.dialCode}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${country.isActive ? statusColors.active : statusColors.inactive}`}>
                        {country.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600"><p className="font-medium">{country.totalRanges || 0} range{country.totalRanges === 1 ? '' : 's'}</p><p className="max-w-xs text-xs text-gray-400">{country.ranges?.length ? country.ranges.map((range) => `${range.name} (${range.totalNumbers})`).join(', ') : 'No ranges'}</p></td>
                    <td className="px-5 py-4 text-sm text-gray-600">{Number(country.totalNumbers || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{country.createdAt ? new Date(country.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { console.log('View country:', country); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="View"><FiEye className="w-4 h-4" /></button>
                        <button onClick={() => handleOpenModal(country)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Edit"><FiEdit className="w-4 h-4" /></button>
                        <button onClick={() => handleStatusChange(country.id, country.isActive)} disabled={isMutating} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title={country.isActive ? 'Deactivate' : 'Activate'}>{country.isActive ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}</button>
                        <button onClick={() => handleDelete(country.id)} disabled={isMutating} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {countries.length} of {totalCount} countries</p>
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
              <h2 className="text-lg font-semibold text-gray-900">{editingCountry ? 'Edit Country' : 'Add New Country'}</h2>
              <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" disabled={isMutating}><FiX className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country Name</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g., United States" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISO Code</label>
                  <input type="text" name="code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="US" maxLength={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dial Code</label>
                  <input type="text" name="dialCode" value={formData.dialCode} onChange={(e) => setFormData({...formData, dialCode: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="+1" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isMutating} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {isMutating ? 'Saving...' : (editingCountry ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Countries;