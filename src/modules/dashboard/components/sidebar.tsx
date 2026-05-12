'use client';

import { User, Package, Heart, Settings, LogOut } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar_url?: string;
}

interface SidebarProps {
  user: UserData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export function Sidebar({ user, activeTab, setActiveTab, onLogout }: SidebarProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-[#e8e5dd]">
      {/* User Info */}
      <div className="text-center mb-6 pb-6 border-b border-[#e8e5dd]">
        <div className="w-16 h-16 bg-[#7a9e8e] rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden shadow-sm border border-gray-100">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-white" />
          )}
        </div>
        <h3 className="font-semibold text-gray-900">{user.name}</h3>
        {/* <p className="text-sm text-gray-600">{user.email}</p> */}
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full text-left px-4 py-3 rounded-lg transition cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#f5f2ed] text-[#7a9e8e] font-semibold'
              : 'text-gray-700 hover:bg-[#f5f2ed]'
          }`}
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`w-full text-left px-4 py-3 rounded-lg transition cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#f5f2ed] text-[#7a9e8e] font-semibold'
              : 'text-gray-700 hover:bg-[#f5f2ed]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5" />
            <span>Orders</span>
          </div>
        </button>
        {/* <button
          onClick={() => setActiveTab('wishlist')}
          className={`w-full text-left px-4 py-3 rounded-lg transition cursor-pointer ${
            activeTab === 'wishlist'
              ? 'bg-[#f5f2ed] text-[#7a9e8e] font-semibold'
              : 'text-gray-700 hover:bg-[#f5f2ed]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5" />
            <span>Wishlist</span>
          </div>
        </button> */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full text-left px-4 py-3 rounded-lg transition cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#f5f2ed] text-[#7a9e8e] font-semibold'
              : 'text-gray-700 hover:bg-[#f5f2ed]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </div>
        </button>
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full mt-6 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-semibold flex items-center justify-center gap-2 cursor-pointer"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}
