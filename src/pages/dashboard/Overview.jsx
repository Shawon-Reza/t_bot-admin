import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  FiUsers, FiSettings, FiGlobe, FiLayers, FiHash, FiTrendingUp,
  FiArrowUpRight, FiArrowDownRight, FiActivity, FiClock, FiDollarSign,
  FiPlus, FiSearch, FiFilter, FiDownload, FiRefreshCw
} from 'react-icons/fi';

const Overview = () => {
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '12,345', change: '+12.5%', trend: 'up', icon: FiUsers, color: 'blue' },
    { label: 'Active Services', value: '24', change: '+2', trend: 'up', icon: FiSettings, color: 'green' },
    { label: 'Countries', value: '156', change: '+5', trend: 'up', icon: FiGlobe, color: 'purple' },
    { label: 'Total Numbers', value: '1.2M', change: '+8.3%', trend: 'up', icon: FiHash, color: 'orange' },
    { label: 'Total Revenue', value: '$45,678', change: '+15.2%', trend: 'up', icon: FiDollarSign, color: 'emerald' },
    { label: 'OTP Success Rate', value: '94.2%', change: '-0.5%', trend: 'down', icon: FiActivity, color: 'red' },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'user', action: 'New user registered', user: 'John Doe', time: '2 min ago', status: 'success' },
    { id: 2, type: 'number', action: 'Number purchased', user: 'Jane Smith', service: 'WhatsApp', country: 'USA', time: '15 min ago', status: 'success' },
    { id: 3, type: 'otp', action: 'OTP received', user: 'Bob Wilson', number: '+1 555-***-4321', time: '32 min ago', status: 'success' },
    { id: 4, type: 'service', action: 'New service added', service: 'Telegram', time: '1 hour ago', status: 'info' },
    { id: 5, type: 'user', action: 'User blocked', user: 'Spammer123', time: '2 hours ago', status: 'warning' },
    { id: 6, type: 'number', action: 'Number expired', service: 'WhatsApp', country: 'UK', time: '3 hours ago', status: 'error' },
  ]);

  const [quickActions] = useState([
    { path: '/dashboard/services', label: 'Add Service', icon: FiPlus, color: 'blue', description: 'Create new service' },
    { path: '/dashboard/countries', label: 'Add Country', icon: FiPlus, color: 'green', description: 'Add new country' },
    { path: '/dashboard/ranges', label: 'Add Range', icon: FiPlus, color: 'purple', description: 'Create number range' },
    { path: '/dashboard/numbers', label: 'Import Numbers', icon: FiDownload, color: 'orange', description: 'Bulk import numbers' },
    { path: '/dashboard/users', label: 'Manage Users', icon: FiUsers, color: 'red', description: 'View & manage users' },
  ]);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-gray-600">Welcome back! Here's what's happening with your platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-500/10 text-blue-600',
            green: 'bg-green-500/10 text-green-600',
            purple: 'bg-purple-500/10 text-purple-600',
            orange: 'bg-orange-500/10 text-orange-600',
            emerald: 'bg-emerald-500/10 text-emerald-600',
            red: 'bg-red-500/10 text-red-600',
          };
          const trendIcon = stat.trend === 'up' ? FiArrowUpRight : FiArrowDownRight;
          const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600';

          return (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="mt-3 flex items-center gap-1">
                    <trendIcon className={`w-4 h-4 ${trendColor}`} aria-hidden="true" />
                    <span className={`text-sm font-medium ${trendColor}`}>{stat.change}</span>
                    <span className="text-sm text-gray-400">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => console.log('Refresh activity')}>
                <FiRefreshCw className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-5 hover:bg-gray-50 transition-colors flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.status === 'success' ? 'bg-green-100 text-green-600' : activity.status === 'info' ? 'bg-blue-100 text-blue-600' : activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                  {activity.type === 'user' && <FiUsers className="w-5 h-5" />}
                  {activity.type === 'number' && <FiHash className="w-5 h-5" />}
                  {activity.type === 'otp' && <FiActivity className="w-5 h-5" />}
                  {activity.type === 'service' && <FiSettings className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="mt-0.5 text-sm text-gray-500 flex items-center flex-wrap gap-1">
                    {activity.user && <> <span>{activity.user}</span> </>}
                    {activity.service && <> <span className="mx-1">•</span><span>{activity.service}</span> </>}
                    {activity.country && <> <span className="mx-1">•</span><span>{activity.country}</span> </>}
                    {activity.number && <> <span className="mx-1">•</span><span>{activity.number}</span> </>}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-5 space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.path} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${action.color}-100 text-${action.color}-600`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;