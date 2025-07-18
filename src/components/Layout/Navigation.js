import React from 'react';
import { BarChart3, Target, DollarSign, TrendingUp, Users, Settings } from 'lucide-react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'donations', label: 'Donations', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'donors', label: 'Donors', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="bg-white border-r h-full min-h-screen w-64 fixed left-0 top-16 z-30">
      <div className="p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                currentPage === item.id 
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${
                currentPage === item.id ? 'text-primary-500' : 'text-gray-400'
              }`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="mt-8 p-4 border-t">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Active Campaigns</span>
            <span className="font-medium">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Raised</span>
            <span className="font-medium">$245K</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">This Month</span>
            <span className="font-medium text-green-600">+18%</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
