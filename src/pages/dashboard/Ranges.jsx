import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rangeApi, queryKeys } from '../../api/ranges';
import { countryApi } from '../../api/countries';
import {
  FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiChevronLeft, FiChevronRight,
  FiLock, FiUnlock, FiRefreshCw, FiX,
} from 'react-icons/fi';

const emptyForm = { name: '', countryId: '' };

const Ranges = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [viewedRange, setViewedRange] = useState(null);
  const [editingRange, setEditingRange] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const params = {
    search: searchTerm || undefined,
    countryId: countryFilter || undefined,
    isActive: statusFilter === 'all' ? undefined : String(statusFilter === 'active'),
    sortBy,
    sortOrder,
    page,
    limit: 10,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.ranges(params),
    queryFn: () => rangeApi.getAll(params),
    select: (response) => {
      const result = response.data?.data;
      return { items: Array.isArray(result?.data) ? result.data : [], meta: result?.meta || {} };
    },
    placeholderData: (previousData) => previousData,
  });

  const { data: countries = [] } = useQuery({
    queryKey: ['countries', { isActive: 'true', limit: 100 }],
    queryFn: () => countryApi.getAll({ isActive: 'true', limit: 100 }),
    select: (response) => response.data?.data?.data || [],
  });

  const ranges = data?.items || [];
  const meta = data?.meta || {};
  const totalPages = Math.max(meta.totalPages || 1, 1);
  const invalidateRanges = () => queryClient.invalidateQueries({ queryKey: ['ranges'] });

  const createMutation = useMutation({ mutationFn: (range) => rangeApi.create(range), onSuccess: () => { invalidateRanges(); handleCloseModal(); } });
  const updateMutation = useMutation({ mutationFn: ({ id, range }) => rangeApi.update(id, range), onSuccess: () => { invalidateRanges(); handleCloseModal(); } });
  const deleteMutation = useMutation({ mutationFn: (id) => rangeApi.delete(id), onSuccess: invalidateRanges });
  const statusMutation = useMutation({ mutationFn: ({ id, isActive }) => rangeApi.toggleStatus(id, isActive), onSuccess: invalidateRanges });
  const mutationPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || statusMutation.isPending;

  const handleOpenModal = (range = null) => {
    setEditingRange(range);
    setFormData(range ? { name: range.name, countryId: range.countryId } : emptyForm);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRange(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingRange) updateMutation.mutate({ id: editingRange.id, range: formData });
    else createMutation.mutate(formData);
  };

  const resetPage = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  if (isLoading) return <div className="p-6 lg:p-8"><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" /></div></div>;
  if (isError) return <div className="p-6 lg:p-8"><div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"><p className="text-red-700">Failed to load ranges.</p><button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Retry</button></div></div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div><h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Number Ranges</h1><p className="mt-1 text-gray-600">Manage number ranges by country</p></div>
        <button onClick={() => handleOpenModal()} disabled={mutationPending} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"><FiPlus className="w-5 h-5" />Add Range</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1 max-w-md"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search ranges..." value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
          <div className="flex flex-wrap items-center gap-3">
            <select value={countryFilter} onChange={resetPage(setCountryFilter)} className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white"><option value="">All Countries</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</select>
            <select value={statusFilter} onChange={resetPage(setStatusFilter)} className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white"><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
            <select value={`${sortBy}:${sortOrder}`} onChange={(event) => { const [field, order] = event.target.value.split(':'); setSortBy(field); setSortOrder(order); setPage(1); }} className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white"><option value="name:asc">Name A-Z</option><option value="name:desc">Name Z-A</option><option value="createdAt:asc">Oldest first</option><option value="createdAt:desc">Newest first</option></select>
            <button onClick={() => refetch()} className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50" title="Refresh"><FiRefreshCw className="w-5 h-5 text-gray-500" /></button>
          </div>
        </div>

        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50 border-b border-gray-100"><th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Range Name</th><th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Country</th><th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th><th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Numbers</th><th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Created</th><th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">{ranges.length === 0 ? <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No ranges found</td></tr> : ranges.map((range) => <tr key={range.id} className="hover:bg-gray-50"><td className="px-5 py-4 font-medium text-gray-900">{range.name}</td><td className="px-5 py-4 text-sm text-gray-600">{range.country?.name || '—'}</td><td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${range.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{range.isActive ? 'Active' : 'Inactive'}</span></td><td className="px-5 py-4 text-sm text-gray-600">{Number(range.totalNumbers || 0).toLocaleString()}</td><td className="px-5 py-4 text-sm text-gray-500">{range.createdAt ? new Date(range.createdAt).toLocaleDateString() : '—'}</td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button onClick={async () => setViewedRange((await rangeApi.getById(range.id)).data?.data)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title="View"><FiEye className="w-4 h-4" /></button><button onClick={() => handleOpenModal(range)} disabled={mutationPending} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title="Edit"><FiEdit className="w-4 h-4" /></button><button onClick={() => statusMutation.mutate({ id: range.id, isActive: !range.isActive })} disabled={mutationPending} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title={range.isActive ? 'Deactivate' : 'Activate'}>{range.isActive ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}</button><button onClick={() => { if (window.confirm('Delete this range permanently?')) deleteMutation.mutate(range.id); }} disabled={mutationPending} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Delete permanently"><FiTrash2 className="w-4 h-4" /></button></div></td></tr>)}</tbody></table></div>
 
  <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between"><p className="text-sm text-gray-500">Showing {ranges.length} of {meta.total || 0} ranges</p><div className="flex items-center gap-3"><span className="text-sm text-gray-500">Page {meta.page || page} of {totalPages}</span><button onClick={() => setPage((current) => Math.max(current - 1, 1))} disabled={page <= 1} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40"><FiChevronLeft /></button><button onClick={() => setPage((current) => Math.min(current + 1, totalPages))} disabled={page >= totalPages} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40"><FiChevronRight /></button></div></div>
+      </div>
 
  {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleCloseModal}><div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(event) => event.stopPropagation()}><div className="p-5 border-b border-gray-100 flex items-center justify-between"><h2 className="text-lg font-semibold text-gray-900">{editingRange ? 'Edit Range' : 'Add New Range'}</h2><button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-gray-100"><FiX /></button></div><form onSubmit={handleSubmit} className="p-5 space-y-5"><div><label className="block text-sm font-medium text-gray-700 mb-2">Range Name</label><input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Country</label><select value={formData.countryId} onChange={(event) => setFormData({ ...formData, countryId: event.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white" required><option value="">Select Country</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</select></div><div className="flex gap-3"><button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl">Cancel</button><button type="submit" disabled={mutationPending} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50">{mutationPending ? 'Saving...' : editingRange ? 'Update' : 'Create'}</button></div></form></div></div>}
 
  {viewedRange && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setViewedRange(null)}><div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(event) => event.stopPropagation()}><div className="flex justify-between items-center mb-5"><h2 className="text-lg font-semibold">Range Details</h2><button onClick={() => setViewedRange(null)}><FiX /></button></div><dl className="space-y-3 text-sm"><div className="flex justify-between"><dt className="text-gray-500">Name</dt><dd className="font-medium">{viewedRange.name}</dd></div><div className="flex justify-between"><dt className="text-gray-500">Country</dt><dd>{viewedRange.country?.name || '—'}</dd></div><div className="flex justify-between"><dt className="text-gray-500">Total numbers</dt><dd>{Number(viewedRange.totalNumbers || 0).toLocaleString()}</dd></div><div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd>{viewedRange.isActive ? 'Active' : 'Inactive'}</dd></div></dl></div></div>}
    </div>
  );
};

export default Ranges;
