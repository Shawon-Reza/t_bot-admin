import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router';
import { authApi, authStorage } from '../api/auth';
import {
  FiHome, FiUsers, FiSettings, FiLogOut, FiMenu, FiX,
  FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiFilter,
  FiArrowLeft, FiCheck, FiXCircle, FiLock, FiUnlock,
  FiDownload, FiUpload, FiRefreshCw, FiBell, FiHelpCircle,
  FiGlobe, FiLayers, FiHash, FiUser, FiZap
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: FiHome },
    { path: '/dashboard/services', label: 'Services', icon: FiSettings },
    { path: '/dashboard/countries', label: 'Countries', icon: FiGlobe },
    { path: '/dashboard/ranges', label: 'Ranges', icon: FiLayers },
    { path: '/dashboard/numbers', label: 'Numbers', icon: FiHash },
    { path: '/dashboard/users', label: 'Users', icon: FiUsers },
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authApi.signOut();
    } finally {
      authStorage.clear();
      navigate('/signin', { replace: true });
      setIsSigningOut(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2" onClick={onClose}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <FiZap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">AdminPanel</span>
            </Link>
            <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Close sidebar">
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-500">
              <FiUser className="w-5 h-5" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => console.log('Settings clicked')}>
                <FiSettings className="w-4 h-4" aria-hidden="true" />
                Settings
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSignOut} disabled={isSigningOut}>
                <FiLogOut className="w-4 h-4" aria-hidden="true" />
                {isSigningOut ? 'Signing out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200 lg:hidden max-h-screen">
      <div className="flex items-center justify-between h-16 px-4">
        <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Open menu" aria-expanded="false">
          <FiMenu className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
        <div className="w-10" />
      </div>
    </header>
  );
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50 flex">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 lg:ml-0 min-w-0">
        <div className="max-h-screen overflow-y-auto ">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;