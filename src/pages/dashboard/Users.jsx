import { useState } from 'react';
import {
  FiSearch, FiFilter, FiEdit, FiTrash2, FiEye,
  FiChevronDown, FiDownload, FiRefreshCw, FiLock, FiUnlock,
  FiUser, FiUserCheck, FiUserX, FiMail, FiPhone, FiCalendar,
  FiDollarSign, FiActivity, FiShield, FiAlertTriangle
} from 'react-icons/fi';

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 555 123 4567', status: 'active', role: 'user', registeredAt: '2024-01-15', lastLogin: '2024-03-15 10:30', totalSpent: 125.50, numbersUsed: 42, avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+44 7700 900 123', status: 'active', role: 'user', registeredAt: '2024-01-20', lastLogin: '2024-03-15 09:15', totalSpent: 89.25, numbersUsed: 28, avatar: 'JS' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '+1 438 200 5678', status: 'blocked', role: 'user', registeredAt: '2024-02-01', lastLogin: '2024-03-10 14:22', totalSpent: 210.00, numbersUsed: 67, avatar: 'BW' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+49 151 200 0001', status: 'active', role: 'premium', registeredAt: '2024-02-10', lastLogin: '2024-03-15 11:45', totalSpent: 543.75, numbersUsed: 156, avatar: 'AB' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+61 400 123 456', status: 'inactive', role: 'user', registeredAt: '2024-02-15', lastLogin: '2024-03-01 16:30', totalSpent: 12.00, numbersUsed: 4, avatar: 'CD' },
    { id: 6, name: 'Admin User', email: 'admin@example.com', phone: '+1 555 000 0000', status: 'active', role: 'admin', registeredAt: '2023-12-01', lastLogin: '2024-03-15 12:00', totalSpent: 0, numbersUsed: 0, avatar: 'AU' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleView = (user) => {
    setViewingUser(user);
    setShowModal(true);
    console.log('View user:', user);
  };

  const handleEdit = (user) => {
    console.log('Edit user:', user);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(u => u.id !== id));
      console.log('User deleted:', id);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    console.log('User status changed:', id, newStatus);
  };

  const handleBlock = (id) => {
    if (window.confirm('Block this user? They will not be able to access the platform.')) {
      handleStatusChange(id, 'blocked');
    }
  };

  const handleActivate = (id) => {
    handleStatusChange(id, 'active');
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    blocked: 'bg-red-100 text-red-700',
  };

  const statusIcons = {
    active: <FiUserCheck className="w-3 h-3" />,
    inactive: <FiUser className="w-3 h-3" />,
    blocked: <FiUserX className="w-3 h-3" />,
  };

  const roleColors = {
    admin: 'bg-purple-100 text-purple-700',
    premium: 'bg-yellow-100 text-yellow-700',
    user: 'bg-blue-100 text-blue-700',
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-gray-600">Manage platform users and their access</p>
        </div>
        <button onClick={() => console.log('Export users')} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <FiDownload className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white min-w-[140px]">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white min-w-[140px]">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="premium">Premium</option>
              <option value="user">User</option>
            </select>
            <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); setRoleFilter('all'); console.log('Filters reset') }} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FiRefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Spending</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Numbers Used</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-500">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-1"><FiMail className="w-3 h-3" /> {user.email}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1"><FiPhone className="w-3 h-3" /> {user.phone}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                        {statusIcons[user.status]}
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 flex items-center gap-1"><FiCalendar className="w-3 h-3" /> {user.registeredAt}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 flex items-center gap-1"><FiActivity className="w-3 h-3" /> {user.lastLogin}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900 flex items-center gap-1"><FiDollarSign className="w-3 h-3" /> ${user.totalSpent.toFixed(2)}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{user.numbersUsed}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleView(user)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="View"><FiEye className="w-4 h-4" /></button>
                        <button onClick={() => handleEdit(user)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Edit"><FiEdit className="w-4 h-4" /></button>
                        {user.status === 'active' ? (
                          <button onClick={() => handleBlock(user.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Block"><FiShield className="w-4 h-4" /></button>
                        ) : user.status === 'blocked' ? (
                          <button onClick={() => handleActivate(user.id)} className="p-2 rounded-lg hover:bg-green-50 text-green-500 transition-colors" title="Activate"><FiShield className="w-4 h-4" /></button>
                        ) : (
                          <button onClick={() => handleActivate(user.id)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Activate"><FiUserCheck className="w-4 h-4" /></button>
                        )}
                        {(user.role !== 'admin') && (
                          <button onClick={() => handleDelete(user.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {users.length} users</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors" disabled><FiChevronDown className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"><FiChevronDown className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => { setShowModal(false); setViewingUser(null); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
              <button onClick={() => { setShowModal(false); setViewingUser(null); }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><FiX className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {viewingUser.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{viewingUser.name}</h3>
                  <p className="text-gray-500">ID: {viewingUser.id}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Email</p><p className="font-medium text-gray-900 flex items-center gap-1"><FiMail className="w-4 h-4" /> {viewingUser.email}</p></div>
                  <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium text-gray-900 flex items-center gap-1"><FiPhone className="w-4 h-4" /> {viewingUser.phone}</p></div>
                  <div><p className="text-xs text-gray-500">Role</p><p className="font-medium text-gray-900"><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColors[viewingUser.role]}`}>{viewingUser.role}</span></p></div>
                  <div><p className="text-xs text-gray-500">Status</p><p className="font-medium text-gray-900"><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[viewingUser.status]}`}>{statusIcons[viewingUser.status]} {viewingUser.status}</span></p></div>
                  <div><p className="text-xs text-gray-500">Registered</p><p className="font-medium text-gray-900 flex items-center gap-1"><FiCalendar className="w-4 h-4" /> {viewingUser.registeredAt}</p></div>
                  <div><p className="text-xs text-gray-500">Last Login</p><p className="font-medium text-gray-900 flex items-center gap-1"><FiActivity className="w-4 h-4" /> {viewingUser.lastLogin}</p></div>
                  <div className="col-span-2"><p className="text-xs text-gray-500">Total Spending</p><p className="font-medium text-gray-900 flex items-center gap-1"><FiDollarSign className="w-4 h-4" /> ${viewingUser.totalSpent.toFixed(2)}</p></div>
                  <div className="col-span-2"><p className="text-xs text-gray-500">Numbers Used</p><p className="font-medium text-gray-900">{viewingUser.numbersUsed}</p></div>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => handleEdit(viewingUser)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">Edit</button>
                {viewingUser.status === 'active' ? (
                  <button onClick={() => handleBlock(viewingUser.id)} className="flex-1 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl font-medium text-red-700 hover:bg-red-100 transition-colors">Block</button>
                ) : viewingUser.status === 'blocked' ? (
                  <button onClick={() => handleActivate(viewingUser.id)} className="flex-1 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl font-medium text-green-700 hover:bg-green-100 transition-colors">Activate</button>
                ) : (
                  <button onClick={() => handleActivate(viewingUser.id)} className="flex-1 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl font-medium text-blue-700 hover:bg-blue-100 transition-colors">Activate</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;