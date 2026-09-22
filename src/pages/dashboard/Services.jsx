import { useState } from 'react';
import { Link } from 'react-router';
import {
  FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiEye,
  FiChevronDown, FiMoreVertical, FiCheck, FiX, FiRefreshCw,
  FiDownload, FiUpload, FiSettings, FiLock, FiUnlock
} from 'react-icons/fi';

const Services = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'WhatsApp', code: 'whatsapp', icon: '📱', pricePerOtp: 0.15, status: 'active', numbersCount: 45230, createdAt: '2024-01-15' },
    { id: 2, name: 'Telegram', code: 'telegram', icon: '💬', pricePerOtp: 0.10, status: 'active', numbersCount: 32150, createdAt: '2024-01-20' },
    { id: 3, name: 'Facebook', code: 'facebook', icon: '📘', pricePerOtp: 0.20, status: 'active', numbersCount: 28900, createdAt: '2024-02-01' },
    { id: 4, name: 'Instagram', code: 'instagram', icon: '📸', pricePerOtp: 0.25, status: 'inactive', numbersCount: 15600, createdAt: '2024-02-10' },
    { id: 5, name: 'Twitter/X', code: 'twitter', icon: '🐦', pricePerOtp: 0.18, status: 'active', numbersCount: 21400, createdAt: '2024-02-15' },
    { id: 6, name: 'Google', code: 'google', icon: '🔍', pricePerOtp: 0.12, status: 'active', numbersCount: 38700, createdAt: '2024-03-01' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', icon: '', pricePerOtp: '', status: 'active' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({ name: service.name, code: service.code, icon: service.icon, pricePerOtp: service.pricePerOtp, status: service.status });
    } else {
      setEditingService(null);
      setFormData({ name: '', code: '', icon: '', pricePerOtp: '', status: 'active' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({ name: '', code: '', icon: '', pricePerOtp: '', status: 'active' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      if (editingService) {
        setServices(prev => prev.map(s => s.id === editingService.id ? { ...s, ...formData } : s));
        console.log('Service updated:', { ...editingService, ...formData });
      } else {
        const newService = { ...formData, id: Date.now(), numbersCount: 0, createdAt: new Date().toISOString().split('T')[0] };
        setServices(prev => [...prev, newService]);
        console.log('Service created:', newService);
      }
      handleCloseModal();
      setIsSubmitting(false);
    }, 500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(s => s.id !== id));
      console.log('Service deleted:', id);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    console.log('Service status changed:', id, newStatus);
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-gray-600">Manage services for OTP verification</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
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
              <option value="maintenance">Maintenance</option>
            </select>
            <button onClick={() => console.log('Export services')} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
            <button onClick={() => handleOpenModal()} className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
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
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
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
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">No services found</td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{service.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-500">{service.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 font-mono">{service.code}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">${service.pricePerOtp.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[service.status]}`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{service.numbersCount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{service.createdAt}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { console.log('View service:', service); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="View">
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenModal(service)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Edit">
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleStatusChange(service.id, service.status === 'active' ? 'inactive' : 'active')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title={service.status === 'active' ? 'Deactivate' : 'Activate'}>
                          {service.status === 'active' ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDelete(service.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
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
          <p className="text-sm text-gray-500">Showing {filteredServices.length} of {services.length} services</p>
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
              <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><FiX className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g., WhatsApp" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code (Unique)</label>
                <input type="text" name="code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g., whatsapp" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon/Emoji</label>
                <input type="text" name="icon" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g., 📱" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per OTP ($)</label>
                <input type="number" step="0.01" min="0" name="pricePerOtp" value={formData.pricePerOtp} onChange={(e) => setFormData({...formData, pricePerOtp: parseFloat(e.target.value) || ''})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="0.15" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : (editingService ? 'Update' : 'Create')}
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