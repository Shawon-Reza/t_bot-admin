import { useState } from 'react';
import {
  FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiEye,
  FiChevronDown, FiLock, FiUnlock, FiDownload, FiSettings
} from 'react-icons/fi';

const Ranges = () => {
  const [ranges, setRanges] = useState([
    { id: 1, name: 'Premium US', service: 'WhatsApp', country: 'United States', rangeStart: '+1 555 100 0000', rangeEnd: '+1 555 199 9999', pricePerOtp: 0.25, status: 'active', numbersCount: 5000, createdAt: '2024-01-20' },
    { id: 2, name: 'Standard US', service: 'WhatsApp', country: 'United States', rangeStart: '+1 555 200 0000', rangeEnd: '+1 555 299 9999', pricePerOtp: 0.15, status: 'active', numbersCount: 8000, createdAt: '2024-01-22' },
    { id: 3, name: 'UK Premium', service: 'Telegram', country: 'United Kingdom', rangeStart: '+44 7700 900 000', rangeEnd: '+44 7700 999 999', pricePerOtp: 0.20, status: 'active', numbersCount: 3500, createdAt: '2024-02-01' },
    { id: 4, name: 'Canada Basic', service: 'Facebook', country: 'Canada', rangeStart: '+1 438 200 0000', rangeEnd: '+1 438 299 9999', pricePerOtp: 0.18, status: 'inactive', numbersCount: 2100, createdAt: '2024-02-10' },
    { id: 5, name: 'Germany Pro', service: 'Instagram', country: 'Germany', rangeStart: '+49 151 200 0000', rangeEnd: '+49 151 299 9999', pricePerOtp: 0.30, status: 'maintenance', numbersCount: 1800, createdAt: '2024-02-15' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRange, setEditingRange] = useState(null);
  const [formData, setFormData] = useState({ name: '', service: '', country: '', rangeStart: '', rangeEnd: '', pricePerOtp: '', status: 'active' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = ['WhatsApp', 'Telegram', 'Facebook', 'Instagram', 'Twitter/X', 'Google'];
  const countries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Australia', 'India', 'Brazil'];

  const filteredRanges = ranges.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.service.toLowerCase().includes(searchTerm.toLowerCase()) || r.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (range = null) => {
    if (range) {
      setEditingRange(range);
      setFormData({ name: range.name, service: range.service, country: range.country, rangeStart: range.rangeStart, rangeEnd: range.rangeEnd, pricePerOtp: range.pricePerOtp, status: range.status });
    } else {
      setEditingRange(null);
      setFormData({ name: '', service: '', country: '', rangeStart: '', rangeEnd: '', pricePerOtp: '', status: 'active' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRange(null);
    setFormData({ name: '', service: '', country: '', rangeStart: '', rangeEnd: '', pricePerOtp: '', status: 'active' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      if (editingRange) {
        setRanges(prev => prev.map(r => r.id === editingRange.id ? { ...r, ...formData } : r));
        console.log('Range updated:', { ...editingRange, ...formData });
      } else {
        const newRange = { ...formData, id: Date.now(), numbersCount: 0, createdAt: new Date().toISOString().split('T')[0] };
        setRanges(prev => [...prev, newRange]);
        console.log('Range created:', newRange);
      }
      handleCloseModal();
      setIsSubmitting(false);
    }, 500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this range?')) {
      setRanges(prev => prev.filter(r => r.id !== id));
      console.log('Range deleted:', id);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setRanges(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    console.log('Range status changed:', id, newStatus);
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Number Ranges</h1>
          <p className="mt-1 text-gray-600">Manage number ranges for services and countries</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
          <FiPlus className="w-5 h-5" />
          Add Range
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search ranges..."
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
            <button onClick={() => console.log('Export ranges')} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Range Name</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Range</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price/OTP</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Numbers</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRanges.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-500">No ranges found</td>
                </tr>
              ) : (
                filteredRanges.map((range) => (
                  <tr key={range.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{range.name}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{range.service}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{range.country}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 font-mono">{range.rangeStart} - {range.rangeEnd}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">${range.pricePerOtp.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[range.status]}`}>
                        {range.status.charAt(0).toUpperCase() + range.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{range.numbersCount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { console.log('View range:', range); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="View"><FiEye className="w-4 h-4" /></button>
                        <button onClick={() => handleOpenModal(range)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Edit"><FiEdit className="w-4 h-4" /></button>
                        <button onClick={() => handleStatusChange(range.id, range.status === 'active' ? 'inactive' : 'active')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title={range.status === 'active' ? 'Deactivate' : 'Activate'}>{range.status === 'active' ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}</button>
                        <button onClick={() => handleDelete(range.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filteredRanges.length} of {ranges.length} ranges</p>
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
              <h2 className="text-lg font-semibold text-gray-900">{editingRange ? 'Edit Range' : 'Add New Range'}</h2>
              <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><FiX className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Range Name</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g., Premium US" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <select value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white" required>
                    <option value="">Select Service</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white" required>
                    <option value="">Select Country</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Range Start</label>
                  <input type="text" name="rangeStart" value={formData.rangeStart} onChange={(e) => setFormData({...formData, rangeStart: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="+1 555 100 0000" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Range End</label>
                  <input type="text" name="rangeEnd" value={formData.rangeEnd} onChange={(e) => setFormData({...formData, rangeEnd: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="+1 555 199 9999" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per OTP ($)</label>
                <input type="number" step="0.01" min="0" name="pricePerOtp" value={formData.pricePerOtp} onChange={(e) => setFormData({...formData, pricePerOtp: parseFloat(e.target.value) || ''})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="0.25" required />
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
                  {isSubmitting ? 'Saving...' : (editingRange ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ranges;