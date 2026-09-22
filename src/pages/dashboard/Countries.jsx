import { useState } from 'react';
import { Link } from 'react-router';
import {
  FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiEye,
  FiChevronDown, FiGlobe, FiLock, FiUnlock, FiDownload
} from 'react-icons/fi';

const Countries = () => {
  const [countries, setCountries] = useState([
    { id: 1, name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', status: 'active', servicesCount: 12, numbersCount: 245600, createdAt: '2024-01-10' },
    { id: 2, name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', status: 'active', servicesCount: 10, numbersCount: 189300, createdAt: '2024-01-12' },
    { id: 3, name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', status: 'active', servicesCount: 8, numbersCount: 156700, createdAt: '2024-01-15' },
    { id: 4, name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', status: 'active', servicesCount: 9, numbersCount: 143200, createdAt: '2024-01-18' },
    { id: 5, name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', status: 'inactive', servicesCount: 7, numbersCount: 98500, createdAt: '2024-01-20' },
    { id: 6, name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', status: 'active', servicesCount: 6, numbersCount: 87400, createdAt: '2024-02-01' },
    { id: 7, name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', status: 'active', servicesCount: 15, numbersCount: 312800, createdAt: '2024-02-05' },
    { id: 8, name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷', status: 'maintenance', servicesCount: 5, numbersCount: 65200, createdAt: '2024-02-10' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', dialCode: '', flag: '', status: 'active' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCountries = countries.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (country = null) => {
    if (country) {
      setEditingCountry(country);
      setFormData({ name: country.name, code: country.code, dialCode: country.dialCode, flag: country.flag, status: country.status });
    } else {
      setEditingCountry(null);
      setFormData({ name: '', code: '', dialCode: '', flag: '', status: 'active' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCountry(null);
    setFormData({ name: '', code: '', dialCode: '', flag: '', status: 'active' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      if (editingCountry) {
        setCountries(prev => prev.map(c => c.id === editingCountry.id ? { ...c, ...formData } : c));
        console.log('Country updated:', { ...editingCountry, ...formData });
      } else {
        const newCountry = { ...formData, id: Date.now(), servicesCount: 0, numbersCount: 0, createdAt: new Date().toISOString().split('T')[0] };
        setCountries(prev => [...prev, newCountry]);
        console.log('Country created:', newCountry);
      }
      handleCloseModal();
      setIsSubmitting(false);
    }, 500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      setCountries(prev => prev.filter(c => c.id !== id));
      console.log('Country deleted:', id);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setCountries(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    console.log('Country status changed:', id, newStatus);
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Countries</h1>
          <p className="mt-1 text-gray-600">Manage countries for number allocation</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
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
              <option value="maintenance">Maintenance</option>
            </select>
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
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Numbers</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCountries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-500">No countries found</td>
                </tr>
              ) : (
                filteredCountries.map((country) => (
                  <tr key={country.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <p className="font-medium text-gray-900">{country.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 font-mono uppercase">{country.code}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{country.dialCode}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[country.status]}`}>
                        {country.status.charAt(0).toUpperCase() + country.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{country.servicesCount}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{country.numbersCount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{country.createdAt}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { console.log('View country:', country); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="View"><FiEye className="w-4 h-4" /></button>
                        <button onClick={() => handleOpenModal(country)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Edit"><FiEdit className="w-4 h-4" /></button>
                        <button onClick={() => handleStatusChange(country.id, country.status === 'active' ? 'inactive' : 'active')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title={country.status === 'active' ? 'Deactivate' : 'Activate'}>{country.status === 'active' ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}</button>
                        <button onClick={() => handleDelete(country.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filteredCountries.length} of {countries.length} countries</p>
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
              <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><FiX className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country Name</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g., United States" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISO Code</label>
                  <input type="text" name="code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="US" maxLength={2} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dial Code</label>
                  <input type="text" name="dialCode" value={formData.dialCode} onChange={(e) => setFormData({...formData, dialCode: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="+1" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Flag Emoji</label>
                <input type="text" name="flag" value={formData.flag} onChange={(e) => setFormData({...formData, flag: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="🇺🇸" required />
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
                  {isSubmitting ? 'Saving...' : (editingCountry ? 'Update' : 'Create')}
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