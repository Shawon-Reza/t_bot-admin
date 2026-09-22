import { useState } from 'react';
import {
  FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiEye,
  FiChevronDown, FiDownload, FiUpload, FiRefreshCw, FiLock, FiUnlock,
  FiPhone, FiCheckCircle, FiXCircle, FiClock, FiX
} from 'react-icons/fi';

const Numbers = () => {
  const [numbers, setNumbers] = useState([
    { id: 1, phoneNumber: '+1 555 123 4567', service: 'WhatsApp', country: 'United States', range: 'Premium US', status: 'available', provider: 'Provider A', assignedTo: null, createdAt: '2024-03-01', lastUsed: null },
    { id: 2, phoneNumber: '+1 555 123 4568', service: 'WhatsApp', country: 'United States', range: 'Premium US', status: 'assigned', provider: 'Provider A', assignedTo: 'user_123', createdAt: '2024-03-01', lastUsed: '2024-03-15 10:30' },
    { id: 3, phoneNumber: '+1 555 123 4569', service: 'Telegram', country: 'United States', range: 'Standard US', status: 'available', provider: 'Provider B', assignedTo: null, createdAt: '2024-03-02', lastUsed: null },
    { id: 4, phoneNumber: '+44 7700 900 123', service: 'Telegram', country: 'United Kingdom', range: 'UK Premium', status: 'used', provider: 'Provider A', assignedTo: 'user_456', createdAt: '2024-03-05', lastUsed: '2024-03-14 14:22' },
    { id: 5, phoneNumber: '+44 7700 900 124', service: 'Facebook', country: 'United Kingdom', range: 'UK Premium', status: 'available', provider: 'Provider C', assignedTo: null, createdAt: '2024-03-05', lastUsed: null },
    { id: 6, phoneNumber: '+1 438 200 5678', service: 'Instagram', country: 'Canada', range: 'Canada Basic', status: 'expired', provider: 'Provider B', assignedTo: 'user_789', createdAt: '2024-03-10', lastUsed: '2024-03-12 09:15' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const services = [...new Set(numbers.map(n => n.service))];
  const countries = [...new Set(numbers.map(n => n.country))];

  const filteredNumbers = numbers.filter(n => {
    const matchesSearch = n.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) || n.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || n.status === statusFilter;
    const matchesService = serviceFilter === 'all' || n.service === serviceFilter;
    const matchesCountry = countryFilter === 'all' || n.country === countryFilter;
    return matchesSearch && matchesStatus && matchesService && matchesCountry;
  });

  const handleImport = (e) => {
    e.preventDefault();
    setIsImporting(true);
    setTimeout(() => {
      const lines = importData.trim().split('\n').filter(l => l.trim());
      const newNumbers = lines.map((line, index) => {
        const [phoneNumber, service, country, range, provider] = line.split(',').map(s => s.trim());
        return {
          id: Date.now() + index,
          phoneNumber,
          service,
          country,
          range,
          status: 'available',
          provider,
          assignedTo: null,
          createdAt: new Date().toISOString().split('T')[0],
          lastUsed: null
        };
      });
      setNumbers(prev => [...prev, ...newNumbers]);
      console.log('Numbers imported:', newNumbers);
      setImportData('');
      setShowImportModal(false);
      setIsImporting(false);
    }, 500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this number?')) {
      setNumbers(prev => prev.filter(n => n.id !== id));
      console.log('Number deleted:', id);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setNumbers(prev => prev.map(n => n.id === id ? { ...n, status: newStatus } : n));
    console.log('Number status changed:', id, newStatus);
  };

  const statusColors = {
    available: 'bg-green-100 text-green-700',
    assigned: 'bg-blue-100 text-blue-700',
    used: 'bg-purple-100 text-purple-700',
    expired: 'bg-red-100 text-red-700',
    blocked: 'bg-gray-100 text-gray-700',
  };

  const statusIcons = {
    available: <FiCheckCircle className="w-3 h-3" />,
    assigned: <FiPhone className="w-3 h-3" />,
    used: <FiCheckCircle className="w-3 h-3" />,
    expired: <FiXCircle className="w-3 h-3" />,
    blocked: <FiLock className="w-3 h-3" />,
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Phone Numbers</h1>
          <p className="mt-1 text-gray-600">Manage phone numbers inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowImportModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">
            <FiUpload className="w-5 h-5" />
            Import Numbers
          </button>
          <button onClick={() => console.log('Export numbers')} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <FiDownload className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white min-w-[140px]">
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="used">Used</option>
              <option value="expired">Expired</option>
              <option value="blocked">Blocked</option>
            </select>
            <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white min-w-[140px]">
              <option value="all">All Services</option>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white min-w-[140px]">
              <option value="all">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); setServiceFilter('all'); setCountryFilter('all'); console.log('Filters reset') }} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FiRefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Range</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Used</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNumbers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-500">No numbers found</td>
                </tr>
              ) : (
                filteredNumbers.map((number) => (
                  <tr key={number.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-sm text-gray-900">{number.phoneNumber}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{number.service}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{number.country}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{number.range}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[number.status]}`}>
                        {statusIcons[number.status]}
                        {number.status.charAt(0).toUpperCase() + number.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{number.provider}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{number.assignedTo || '<span class="text-gray-400">—</span>'}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{number.lastUsed || '<span class="text-gray-400">—</span>'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { console.log('View number:', number); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="View"><FiEye className="w-4 h-4" /></button>
                        <button onClick={() => handleStatusChange(number.id, number.status === 'available' ? 'blocked' : 'available')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title={number.status === 'available' ? 'Block' : 'Unblock'}>{number.status === 'available' ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}</button>
                        <button onClick={() => handleDelete(number.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filteredNumbers.length} of {numbers.length} numbers</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors" disabled><FiChevronDown className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"><FiChevronDown className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowImportModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Import Numbers (CSV)</h2>
              <button onClick={() => setShowImportModal(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><FiX className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleImport} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paste CSV Data</label>
                <p className="text-xs text-gray-500 mb-2">Format: phoneNumber,service,country,range,provider (one per line)</p>
                <textarea value={importData} onChange={(e) => setImportData(e.target.value)} rows={8} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm" placeholder="+1 555 123 4567,WhatsApp,United States,Premium US,Provider A&#10;+1 555 123 4568,WhatsApp,United States,Premium US,Provider A" required />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowImportModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isImporting} className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
                  {isImporting ? 'Importing...' : 'Import Numbers'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Numbers;