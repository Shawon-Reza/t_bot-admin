import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiChevronLeft, FiChevronRight, FiEye, FiLock, FiRefreshCw, FiSearch, FiTrash2, FiUnlock, FiUpload, FiX } from 'react-icons/fi';
import { numberApi, queryKeys } from '../../api/numbers';
import { rangeApi } from '../../api/ranges';
import { countryApi } from '../../api/countries';

const statuses = ['AVAILABLE', 'ASSIGNED', 'OTP_RECEIVED', 'COMPLETED', 'EXPIRED', 'BLOCKED'];
const statusLabel = (status) => status.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
const statusStyle = { AVAILABLE: 'bg-green-100 text-green-700', ASSIGNED: 'bg-blue-100 text-blue-700', OTP_RECEIVED: 'bg-yellow-100 text-yellow-700', COMPLETED: 'bg-purple-100 text-purple-700', EXPIRED: 'bg-red-100 text-red-700', BLOCKED: 'bg-gray-100 text-gray-700' };
const getError = (error) => error.response?.data?.message || 'The requested action could not be completed.';

const Numbers = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [countryId, setCountryId] = useState('');
  const [rangeId, setRangeId] = useState('');
  const [page, setPage] = useState(1);
  const [showImport, setShowImport] = useState(false);
  const [viewedNumber, setViewedNumber] = useState(null);
  const [form, setForm] = useState({ rangeId: '', numbers: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [importResult, setImportResult] = useState(null);

  const params = { search: search || undefined, status: status || undefined, countryId: countryId || undefined, rangeId: rangeId || undefined, page, limit: 10 };
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.numbers(params),
    queryFn: () => numberApi.getAll(params),
    select: (response) => ({ items: response.data?.data?.data || [], meta: response.data?.data?.meta || {} }),
    placeholderData: (previousData) => previousData,
  });
  const { data: countries = [] } = useQuery({ queryKey: ['countries', { limit: 100 }], queryFn: () => countryApi.getAll({ limit: 100 }), select: (response) => response.data?.data?.data || [] });
  const { data: ranges = [] } = useQuery({ queryKey: ['ranges', { limit: 100, countryId }], queryFn: () => rangeApi.getAll({ limit: 100, countryId: countryId || undefined }), select: (response) => response.data?.data?.data || [] });

  const invalidateNumbers = () => queryClient.invalidateQueries({ queryKey: ['numbers'] });
  const importMutation = useMutation({ mutationFn: ({ selectedRangeId, numbers }) => numberApi.import(selectedRangeId, numbers), onSuccess: (response) => { invalidateNumbers(); setImportResult(response.data?.data); setForm({ rangeId: '', numbers: '' }); }, onError: (error) => setErrorMessage(getError(error)) });
  const statusMutation = useMutation({ mutationFn: ({ id, nextStatus }) => numberApi.updateStatus(id, nextStatus), onSuccess: invalidateNumbers, onError: (error) => setErrorMessage(getError(error)) });
  const deleteMutation = useMutation({ mutationFn: (id) => numberApi.delete(id), onSuccess: invalidateNumbers, onError: (error) => setErrorMessage(getError(error)) });
  const isMutating = importMutation.isPending || statusMutation.isPending || deleteMutation.isPending;

  const resetFilters = () => { setSearch(''); setStatus(''); setCountryId(''); setRangeId(''); setPage(1); };
  const changeFilter = (setter) => (event) => { setter(event.target.value); setPage(1); };
  const submitImport = (event) => { event.preventDefault(); setErrorMessage(''); importMutation.mutate({ selectedRangeId: form.rangeId, numbers: form.numbers }); };
  const viewNumber = async (id) => { try { setViewedNumber((await numberApi.getById(id)).data?.data); } catch (error) { setErrorMessage(getError(error)); } };

  if (isLoading) return <div className="p-6 lg:p-8"><div className="flex h-64 items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div></div>;
  if (isError) return <div className="p-6 lg:p-8"><div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"><p className="text-red-700">Failed to load phone numbers.</p><button onClick={() => refetch()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white">Retry</button></div></div>;

  const numbers = data?.items || [];
  const meta = data?.meta || {};
  const totalPages = Math.max(meta.totalPages || 1, 1);

  return <div className="p-6 lg:p-8">
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Phone Numbers</h1><p className="mt-1 text-gray-600">Manage range-based number inventory.</p></div><button onClick={() => { setErrorMessage(''); setImportResult(null); setShowImport(true); }} className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 font-medium text-white hover:bg-green-700"><FiUpload /> Import Numbers</button></div>
    {errorMessage && <div role="alert" className="mb-6 flex justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><div><p className="font-semibold">Action could not be completed</p><p className="mt-1">{errorMessage}</p></div><button onClick={() => setErrorMessage('')}><FiX /></button></div>}
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-wrap gap-3 border-b border-gray-100 p-5"><div className="relative min-w-[240px] flex-1"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={changeFilter(setSearch)} placeholder="Search numbers..." className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4" /></div><select value={status} onChange={changeFilter(setStatus)} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5"><option value="">All Status</option>{statuses.map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}</select><select value={countryId} onChange={changeFilter(setCountryId)} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5"><option value="">All Countries</option>{countries.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={rangeId} onChange={changeFilter(setRangeId)} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5"><option value="">All Ranges</option>{ranges.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><button onClick={resetFilters} className="rounded-xl border border-gray-200 p-2.5" title="Reset filters"><FiRefreshCw /></button></div>
      <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100 bg-gray-50"><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Number</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Country</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Range</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Created</th><th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{numbers.length === 0 ? <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No numbers found</td></tr> : numbers.map((item) => <tr key={item.id} className="hover:bg-gray-50"><td className="px-5 py-4 font-mono text-sm text-gray-900">{item.countryCode}{item.number}</td><td className="px-5 py-4 text-sm text-gray-600">{item.range?.country?.name || '—'}</td><td className="px-5 py-4 text-sm text-gray-600">{item.range?.name || '—'}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[item.status]}`}>{statusLabel(item.status)}</span></td><td className="px-5 py-4 text-sm text-gray-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button onClick={() => viewNumber(item.id)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" title="View"><FiEye /></button><button onClick={() => statusMutation.mutate({ id: item.id, nextStatus: item.status === 'BLOCKED' ? 'AVAILABLE' : 'BLOCKED' })} disabled={isMutating} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" title={item.status === 'BLOCKED' ? 'Unblock' : 'Block'}>{item.status === 'BLOCKED' ? <FiUnlock /> : <FiLock />}</button><button onClick={() => { if (window.confirm('Delete this number permanently?')) deleteMutation.mutate(item.id); }} disabled={isMutating} className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Delete permanently"><FiTrash2 /></button></div></td></tr>)}</tbody></table></div>
      <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 p-5 sm:flex-row"><p className="text-sm text-gray-500">Showing {numbers.length} of {meta.total || 0} numbers</p><div className="flex items-center gap-3"><span className="text-sm text-gray-500">Page {meta.page || page} of {totalPages}</span><button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1} className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"><FiChevronLeft /></button><button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page >= totalPages} className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"><FiChevronRight /></button></div></div>
    </div>
    {showImport && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowImport(false)}><div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-gray-100 p-5"><h2 className="text-lg font-semibold">Import Numbers</h2><button onClick={() => setShowImport(false)}><FiX /></button></div><form onSubmit={submitImport} className="space-y-5 p-5"><div><label className="mb-2 block text-sm font-medium text-gray-700">Target Range</label><select value={form.rangeId} onChange={(event) => setForm({ ...form, rangeId: event.target.value })} required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5"><option value="">Select range</option>{ranges.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.country?.name || 'Country'}</option>)}</select></div><div><label className="mb-2 block text-sm font-medium text-gray-700">Numbers, one per line</label><textarea value={form.numbers} onChange={(event) => setForm({ ...form, numbers: event.target.value })} required rows={10} placeholder={'393791879767\n393756750841\n393757852895'} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-mono text-sm" /><p className="mt-2 text-xs text-gray-500">Country prefix may include a + sign. It will be removed before storage.</p></div>{importResult && <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">Imported {importResult.imported}; skipped duplicates {importResult.skippedDuplicates}; invalid lines {importResult.invalidLines?.length || 0}.</div>}{importMutation.isError && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{getError(importMutation.error)}</div>}<div className="flex gap-3"><button type="button" onClick={() => setShowImport(false)} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5">Cancel</button><button type="submit" disabled={isMutating} className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-white disabled:opacity-50">{importMutation.isPending ? 'Importing...' : 'Import Numbers'}</button></div></form></div></div>}
    {viewedNumber && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewedNumber(null)}><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">Number Details</h2><button onClick={() => setViewedNumber(null)}><FiX /></button></div><dl className="space-y-3 text-sm"><div className="flex justify-between"><dt className="text-gray-500">Number</dt><dd className="font-mono">{viewedNumber.countryCode}{viewedNumber.number}</dd></div><div className="flex justify-between"><dt className="text-gray-500">Country</dt><dd>{viewedNumber.range?.country?.name || '—'}</dd></div><div className="flex justify-between"><dt className="text-gray-500">Range</dt><dd>{viewedNumber.range?.name || '—'}</dd></div><div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd>{statusLabel(viewedNumber.status)}</dd></div></dl></div></div>}
  </div>;
};

export default Numbers;
