import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiChevronLeft, FiChevronRight, FiEdit, FiEye, FiLock, FiPlus, FiRefreshCw, FiSearch, FiTrash2, FiUnlock, FiX } from 'react-icons/fi';
import { serviceSpecificCountryApi, queryKeys } from '../../api/serviceSpecificCountries';
import { serviceApi } from '../../api/services';
import { countryApi } from '../../api/countries';

const emptyForm = { serviceId: '', countryId: '' };

const readServices = (response) => response.data?.result?.data || [];
const readCountries = (response) => response.data?.data?.data || [];
const readAssignmentResult = (response) => response.data?.data;

const getApiErrorMessage = (error) => {
  const responseData = error.response?.data;
  const isDuplicate = responseData?.type === 'P2002'
    || responseData?.meta?.driverAdapterError?.cause?.kind === 'UniqueConstraintViolation';

  if (isDuplicate) {
    return 'This country is already assigned to the selected service.';
  }

  return responseData?.message || 'We could not complete that action. Please try again.';
};

const ServiceSpecificCountries = () => {
  const queryClient = useQueryClient();
  const [serviceFilter, setServiceFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [viewedAssignment, setViewedAssignment] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState('');

  const params = {
    countryId: countryFilter || undefined,
    isActive: statusFilter === 'all' ? undefined : String(statusFilter === 'active'),
    search: searchTerm || undefined,
    sortOrder: 'asc',
    page,
    limit: 10,
  };

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services', { limit: 100 }],
    queryFn: () => serviceApi.getAll({ limit: 100 }),
    select: readServices,
  });

  const { data: countries = [], isLoading: countriesLoading } = useQuery({
    queryKey: ['countries', { limit: 100 }],
    queryFn: () => countryApi.getAll({ limit: 100 }),
    select: readCountries,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.serviceSpecificCountries({ ...params, serviceId: serviceFilter || undefined }),
    queryFn: () => serviceFilter
      ? serviceSpecificCountryApi.getByService(serviceFilter, params)
      : serviceSpecificCountryApi.getAll(params),
    select: (response) => {
      const result = response.data?.data;
      return {
        items: Array.isArray(result?.data) ? result.data : [],
        meta: result?.meta || { total: 0, totalPages: 1 },
      };
    },
    placeholderData: (previousData) => previousData,
  });

  const assignments = data?.items || [];
  const meta = data?.meta || {};
  const totalPages = Math.max(meta.totalPages || 1, 1);

  const invalidateAssignments = () => queryClient.invalidateQueries({ queryKey: ['service-specific-countries'] });
  const createMutation = useMutation({
    mutationFn: (payload) => serviceSpecificCountryApi.create(payload),
    onSuccess: () => { invalidateAssignments(); closeModal(); },
    onError: (error) => setErrorMessage(getApiErrorMessage(error)),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => serviceSpecificCountryApi.update(id, payload),
    onSuccess: () => { invalidateAssignments(); closeModal(); },
    onError: (error) => setErrorMessage(getApiErrorMessage(error)),
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }) => serviceSpecificCountryApi.updateStatus(id, isActive),
    onSuccess: invalidateAssignments,
    onError: (error) => setErrorMessage(getApiErrorMessage(error)),
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => serviceSpecificCountryApi.delete(id),
    onSuccess: invalidateAssignments,
    onError: (error) => setErrorMessage(getApiErrorMessage(error)),
  });
  const isMutating = createMutation.isPending || updateMutation.isPending || statusMutation.isPending || deleteMutation.isPending;

  function closeModal() {
    setShowModal(false);
    setEditingAssignment(null);
    setFormData(emptyForm);
    setErrorMessage('');
  }

  const openCreate = () => {
    setErrorMessage('');
    setEditingAssignment(null);
    setFormData({ serviceId: serviceFilter, countryId: '' });
    setShowModal(true);
  };

  const openEdit = (assignment) => {
    setErrorMessage('');
    setEditingAssignment(assignment);
    setFormData({
      serviceId: assignment.serviceId || serviceFilter,
      countryId: assignment.countryId || assignment.id,
    });
    setShowModal(true);
  };

  const submitForm = (event) => {
    event.preventDefault();
    if (editingAssignment) updateMutation.mutate({ id: editingAssignment.id || editingAssignment.assignmentId, payload: formData });
    else createMutation.mutate(formData);
  };

  const changeFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  const viewAssignment = async (id) => {
    const response = await serviceSpecificCountryApi.getById(id);
    setViewedAssignment(readAssignmentResult(response));
  };

  if (isLoading || servicesLoading || countriesLoading) {
    return <div className="p-6 lg:p-8"><div className="flex h-64 items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div></div>;
  }

  if (isError) {
    return <div className="p-6 lg:p-8"><div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"><p className="text-red-700">Failed to load service country assignments.</p><button onClick={() => refetch()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white">Retry</button></div></div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Service Countries</h1><p className="mt-1 text-gray-600">Assign countries to services for number allocation.</p></div>
        <button onClick={openCreate} disabled={isMutating} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"><FiPlus /> Assign Country</button>
      </div>

      {errorMessage && <div role="alert" className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><div><p className="font-semibold">Action could not be completed</p><p className="mt-1">{errorMessage}</p></div><button onClick={() => setErrorMessage('')} className="rounded-lg p-1 text-red-600 hover:bg-red-100" aria-label="Dismiss error"><FiX /></button></div>}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 xl:flex-row">
          <div className="relative max-w-md flex-1"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={searchTerm} onChange={changeFilter(setSearchTerm)} placeholder="Search by country..." className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none" /></div>
          <div className="flex flex-wrap gap-3">
            <select value={serviceFilter} onChange={changeFilter(setServiceFilter)} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5"><option value="">All Services</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select>
            <select value={countryFilter} onChange={changeFilter(setCountryFilter)} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5"><option value="">All Countries</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</select>
            <select value={statusFilter} onChange={changeFilter(setStatusFilter)} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5"><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
            <button onClick={() => refetch()} className="rounded-xl border border-gray-200 p-2.5 hover:bg-gray-50" title="Refresh"><FiRefreshCw /></button>
          </div>
        </div>

        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100 bg-gray-50"><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Service</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Country</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Assigned</th><th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">
          {assignments.length === 0 ? <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-500">No service country assignments found</td></tr> : assignments.map((assignment) => <tr key={assignment.id || assignment.assignmentId} className="hover:bg-gray-50"><td className="px-5 py-4 text-sm font-medium text-gray-900">{assignment.service?.name || services.find((item) => item.id === serviceFilter)?.name || '—'}</td><td className="px-5 py-4 text-sm text-gray-600">{assignment.country?.name || assignment.name || '—'}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${(assignment.isActive ?? assignment.assignmentIsActive) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{(assignment.isActive ?? assignment.assignmentIsActive) ? 'Active' : 'Inactive'}</span></td><td className="px-5 py-4 text-sm text-gray-500">{assignment.createdAt || assignment.assignmentCreatedAt ? new Date(assignment.createdAt || assignment.assignmentCreatedAt).toLocaleDateString() : '—'}</td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button onClick={() => viewAssignment(assignment.id || assignment.assignmentId)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" title="View"><FiEye /></button><button onClick={() => openEdit(assignment)} disabled={isMutating || !(assignment.id || assignment.assignmentId)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40" title="Edit"><FiEdit /></button><button onClick={() => statusMutation.mutate({ id: assignment.id || assignment.assignmentId, isActive: !(assignment.isActive ?? assignment.assignmentIsActive) })} disabled={isMutating} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" title="Toggle status">{(assignment.isActive ?? assignment.assignmentIsActive) ? <FiLock /> : <FiUnlock />}</button><button onClick={() => { if (window.confirm('Delete this assignment permanently?')) deleteMutation.mutate(assignment.id || assignment.assignmentId); }} disabled={isMutating} className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Delete permanently"><FiTrash2 /></button></div></td></tr>)}</tbody></table></div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 p-5 sm:flex-row"><p className="text-sm text-gray-500">Showing {assignments.length} of {meta.total || 0} assignments</p><div className="flex items-center gap-3"><span className="text-sm text-gray-500">Page {meta.page || page} of {totalPages}</span><button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1} className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"><FiChevronLeft /></button><button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page >= totalPages} className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"><FiChevronRight /></button></div></div>
      </div>

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeModal}><div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-gray-100 p-5"><h2 className="text-lg font-semibold">{editingAssignment ? 'Edit Assignment' : 'Assign Country'}</h2><button onClick={closeModal}><FiX /></button></div><form onSubmit={submitForm} className="space-y-5 p-5">{errorMessage && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{errorMessage}</div>}<div><label className="mb-2 block text-sm font-medium text-gray-700">Service</label><select value={formData.serviceId} onChange={(event) => setFormData({ ...formData, serviceId: event.target.value })} required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5"><option value="">Select service</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></div><div><label className="mb-2 block text-sm font-medium text-gray-700">Country</label><select value={formData.countryId} onChange={(event) => setFormData({ ...formData, countryId: event.target.value })} required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5"><option value="">Select country</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</select></div><div className="flex gap-3"><button type="button" onClick={closeModal} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5">Cancel</button><button type="submit" disabled={isMutating} className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-white disabled:opacity-50">{isMutating ? 'Saving...' : editingAssignment ? 'Update' : 'Assign'}</button></div></form></div></div>}

      {viewedAssignment && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewedAssignment(null)}><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">Assignment Details</h2><button onClick={() => setViewedAssignment(null)}><FiX /></button></div><dl className="space-y-3 text-sm"><div className="flex justify-between"><dt className="text-gray-500">Service</dt><dd>{viewedAssignment.service?.name || '—'}</dd></div><div className="flex justify-between"><dt className="text-gray-500">Country</dt><dd>{viewedAssignment.country?.name || '—'}</dd></div><div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd>{viewedAssignment.isActive ? 'Active' : 'Inactive'}</dd></div></dl></div></div>}
    </div>
  );
};

export default ServiceSpecificCountries;
