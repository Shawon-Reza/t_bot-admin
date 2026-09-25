import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiChevronLeft, FiChevronRight, FiEye, FiRefreshCw, FiSearch, FiShield, FiUserCheck, FiUserX, FiX, FiXCircle } from 'react-icons/fi';
import { queryKeys, tUserApi } from '../../api/tUsers';

const getError = (error) => error.response?.data?.message || 'The requested action could not be completed.';
const statusLabel = (status) => status === 'ACTIVE' ? 'Active' : 'Inactive';
const statusStyle = { ACTIVE: 'bg-green-100 text-green-700', INACTIVE: 'bg-gray-100 text-gray-700' };
const formatDate = (value) => value ? new Date(value).toLocaleString() : '—';
const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;
const getName = (user) => [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Unnamed user';
const getInitials = (user) => getName(user).split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

const Users = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [viewedUser, setViewedUser] = useState(null);
  const [statusDialog, setStatusDialog] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const params = { search: search || undefined, status: status || undefined, page, limit: 10 };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.tUsers(params),
    queryFn: () => tUserApi.getAll(params),
    select: (response) => ({ items: response.data?.data?.data || [], meta: response.data?.data?.meta || {}, reportDate: response.data?.data?.reportDate }),
    placeholderData: (previousData) => previousData,
  });

  const invalidateUsers = () => queryClient.invalidateQueries({ queryKey: ['t-users'] });
  const statusMutation = useMutation({
    mutationFn: ({ id, userStatus, note }) => tUserApi.updateStatus(id, userStatus, note),
    onSuccess: () => { invalidateUsers(); setViewedUser(null); setStatusDialog(null); setStatusNote(''); },
    onError: (error) => setErrorMessage(getError(error)),
  });

  const viewUser = async (id) => {
    try {
      setViewedUser((await tUserApi.getById(id)).data?.data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(getError(error));
    }
  };

  const openStatusDialog = (user, requestedStatus) => {
    setStatusNote('');
    setStatusDialog({
      id: user.id,
      name: getName(user),
      userStatus: requestedStatus || (user.userStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'),
    });
  };

  const submitStatusChange = (event) => {
    event.preventDefault();
    if (!statusDialog) return;
    statusMutation.mutate({ id: statusDialog.id, userStatus: statusDialog.userStatus, note: statusNote.trim() });
  };

  const resetFilters = () => { setSearch(''); setStatus(''); setPage(1); };
  const users = data?.items || [];
  const meta = data?.meta || {};
  const totalPages = Math.max(meta.totalPages || 1, 1);
  const isMutating = statusMutation.isPending;

  if (isLoading) return <div className="p-6 lg:p-8"><div className="flex h-64 items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div></div>;
  if (isError) return <div className="p-6 lg:p-8"><div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"><p className="text-red-700">Failed to load Telegram users.</p><button onClick={() => refetch()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white">Retry</button></div></div>;

  return <div className="p-6 lg:p-8">
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Telegram Users</h1><p className="mt-1 text-gray-600">Daily report date: {data?.reportDate || '—'} (UTC)</p></div><button onClick={() => refetch()} className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"><FiRefreshCw /> Refresh</button></div>
    {errorMessage && <div role="alert" className="mb-6 flex justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><div><p className="font-semibold">Action could not be completed</p><p className="mt-1">{errorMessage}</p></div><button onClick={() => setErrorMessage('')}><FiX /></button></div>}
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-wrap gap-3 border-b border-gray-100 p-5"><div className="relative min-w-60 flex-1"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, username, or Telegram ID..." className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4" /></div><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5"><option value="">All Status</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select><button onClick={resetFilters} className="rounded-xl border border-gray-200 p-2.5" title="Reset filters"><FiRefreshCw /></button></div>
      <div className="overflow-x-auto"><table className="w-full min-w-280"><thead><tr className="border-b border-gray-100 bg-gray-50"><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">User</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Telegram</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Numbers Today / Total</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">OTP Today / Total</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Earning Today / Total</th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Registered</th><th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{users.length === 0 ? <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-500">No Telegram users found</td></tr> : users.map((user) => { const report = user.reporting || {}; return <tr key={user.id} className="hover:bg-gray-50"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 font-medium text-white">{getInitials(user)}</div><div><p className="font-medium text-gray-900">{getName(user)}</p><p className="text-xs text-gray-500">ID: {user.tuserId}</p></div></div></td><td className="px-5 py-4 text-sm text-gray-600">{user.username ? `@${user.username}` : 'No username'}<p className="text-xs text-gray-400">{user.language_code || '—'}</p></td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[user.userStatus]}`}>{user.userStatus === 'ACTIVE' ? <FiUserCheck /> : <FiUserX />}{statusLabel(user.userStatus)}</span></td><td className="px-5 py-4 text-sm text-gray-700">{report.todayNumberAssignmentCount || 0} <span className="text-gray-400">/ {report.totalNumberAssignmentCount || 0}</span></td><td className="px-5 py-4 text-sm text-gray-700">{report.todayOtpCount || 0} <span className="text-gray-400">/ {report.totalOtpCount || 0}</span></td><td className="px-5 py-4 text-sm font-medium text-gray-700">{formatMoney(report.todayEarning)} <span className="font-normal text-gray-400">/ {formatMoney(report.totalEarning)}</span></td><td className="px-5 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button onClick={() => viewUser(user.id)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" title="View details"><FiEye /></button>{user.userStatus === 'ACTIVE' ? <button onClick={() => openStatusDialog(user, 'INACTIVE')} disabled={isMutating} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" title="Deactivate"><FiShield /></button> : <><button onClick={() => openStatusDialog(user, 'ACTIVE')} disabled={isMutating} className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50" title="Approve user"><FiUserCheck /></button><button onClick={() => openStatusDialog(user, 'INACTIVE')} disabled={isMutating} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" title="Reject user"><FiXCircle /></button></>}</div></td></tr>; })}</tbody></table></div>
      <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 p-5 sm:flex-row"><p className="text-sm text-gray-500">Showing {users.length} of {meta.total || 0} users</p><div className="flex items-center gap-3"><span className="text-sm text-gray-500">Page {meta.page || page} of {totalPages}</span><button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1} className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"><FiChevronLeft /></button><button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page >= totalPages} className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"><FiChevronRight /></button></div></div>
    </div>
    {viewedUser && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewedUser(null)}><div className="w-full max-w-lg rounded-2xl bg-white shadow-xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-gray-100 p-5"><h2 className="text-lg font-semibold">Telegram User Details</h2><button onClick={() => setViewedUser(null)}><FiX /></button></div><div className="space-y-5 p-5"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">{getInitials(viewedUser)}</div><div><h3 className="text-xl font-bold">{getName(viewedUser)}</h3><p className="text-sm text-gray-500">Telegram ID: {viewedUser.tuserId}</p></div></div><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">Username</p><p className="font-medium">{viewedUser.username ? `@${viewedUser.username}` : '—'}</p></div><div><p className="text-gray-500">Language</p><p className="font-medium">{viewedUser.language_code || '—'}</p></div><div><p className="text-gray-500">Status</p><p className="font-medium">{statusLabel(viewedUser.userStatus)}</p></div><div><p className="text-gray-500">Registered</p><p className="font-medium">{formatDate(viewedUser.createdAt)}</p></div><div><p className="text-gray-500">Numbers today / total</p><p className="font-medium">{viewedUser.reporting?.todayNumberAssignmentCount || 0} / {viewedUser.reporting?.totalNumberAssignmentCount || 0}</p></div><div><p className="text-gray-500">OTP today / total</p><p className="font-medium">{viewedUser.reporting?.todayOtpCount || 0} / {viewedUser.reporting?.totalOtpCount || 0}</p></div><div><p className="text-gray-500">Earning today</p><p className="font-medium">{formatMoney(viewedUser.reporting?.todayEarning)}</p></div><div><p className="text-gray-500">Total earning</p><p className="font-medium">{formatMoney(viewedUser.reporting?.totalEarning)}</p></div></div>{viewedUser.userStatus === 'INACTIVE' ? <div className="flex gap-3"><button onClick={() => openStatusDialog(viewedUser, 'ACTIVE')} disabled={isMutating} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white disabled:opacity-50"><FiUserCheck /> Approve</button><button onClick={() => openStatusDialog(viewedUser, 'INACTIVE')} disabled={isMutating} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 font-medium text-white disabled:opacity-50"><FiXCircle /> Reject</button></div> : <button onClick={() => openStatusDialog(viewedUser, 'INACTIVE')} disabled={isMutating} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white disabled:opacity-50"><FiUserX /> Set Inactive</button>}</div></div></div>}
    {statusDialog && <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => !isMutating && setStatusDialog(null)}><form onSubmit={submitStatusChange} onClick={(event) => event.stopPropagation()} className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"><div className={`p-6 text-white ${statusDialog.userStatus === 'ACTIVE' ? 'bg-linear-to-br from-blue-600 to-indigo-700' : 'bg-linear-to-br from-rose-600 to-orange-600'}`}><div className="mb-4 flex items-center justify-between"><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">User notification</span><button type="button" onClick={() => setStatusDialog(null)} disabled={isMutating} className="rounded-full p-2 hover:bg-white/15"><FiX /></button></div><h2 className="text-2xl font-semibold">{statusDialog.userStatus === 'ACTIVE' ? 'Approve account' : 'Reject or deactivate'}</h2><p className="mt-1 text-sm text-white/80">Send a status update to {statusDialog.name} in Telegram.</p></div><div className="space-y-4 p-6"><label htmlFor="user-status-note" className="block text-sm font-semibold text-slate-800">Message note <span className="font-normal text-slate-400">(optional)</span></label><textarea id="user-status-note" value={statusNote} onChange={(event) => setStatusNote(event.target.value)} maxLength={1000} rows={5} placeholder="Write a short note that will appear in the Telegram message..." className="w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /><div className="flex items-center justify-between text-xs text-slate-400"><span>The message includes an inline button to open the bot.</span><span>{statusNote.length}/1000</span></div>{statusMutation.isError && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{getError(statusMutation.error)}</p>}<div className="flex gap-3 pt-2"><button type="button" onClick={() => setStatusDialog(null)} disabled={isMutating} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button><button type="submit" disabled={isMutating || statusNote.length > 1000} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-50 ${statusDialog.userStatus === 'ACTIVE' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-700'}`}>{isMutating ? 'Sending...' : statusDialog.userStatus === 'ACTIVE' ? 'Approve & Notify' : 'Reject & Notify'}</button></div></div></form></div>}
  </div>;
};

export default Users;
