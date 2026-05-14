'use client';

import { User, Package, Heart, Settings, LogOut, ChevronRight } from 'lucide-react';

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
    <div className="bg-white rounded-lg p-4 lg:p-6 border border-[#e8e5dd]">
      {/* User Info */}
      <div className="flex items-center gap-4 lg:flex-col lg:text-center mb-4 lg:mb-6 pb-4 lg:pb-6 border-b border-[#e8e5dd]">
        <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#7a9e8e] rounded-full flex items-center justify-center lg:mx-auto overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base lg:text-lg">{user.name}</h3>
          <p className="text-xs text-gray-500 block lg:hidden mt-0.5">{user.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full text-left px-4 py-3 rounded-xl lg:rounded-lg transition cursor-pointer flex items-center justify-between ${
            activeTab === 'profile'
              ? 'bg-[#f5f2ed] text-[#7a9e8e] font-semibold shadow-inner'
              : 'text-gray-700 hover:bg-[#f5f2ed]'
          }`}
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 flex-shrink-0 text-[#7a9e8e]" />
            <span className="text-sm lg:text-base font-medium">Hồ sơ cá nhân</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 lg:hidden" />
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`w-full text-left px-4 py-3 rounded-xl lg:rounded-lg transition cursor-pointer flex items-center justify-between ${
            activeTab === 'orders'
              ? 'bg-[#f5f2ed] text-[#7a9e8e] font-semibold shadow-inner'
              : 'text-gray-700 hover:bg-[#f5f2ed]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 flex-shrink-0 text-[#7a9e8e]" />
            <span className="text-sm lg:text-base font-medium">Lịch sử đơn hàng</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 lg:hidden" />
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full text-left px-4 py-3 rounded-xl lg:rounded-lg transition cursor-pointer flex items-center justify-between ${
            activeTab === 'settings'
              ? 'bg-[#f5f2ed] text-[#7a9e8e] font-semibold shadow-inner'
              : 'text-gray-700 hover:bg-[#f5f2ed]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 flex-shrink-0 text-[#7a9e8e]" />
            <span className="text-sm lg:text-base font-medium">Cài đặt tài khoản</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 lg:hidden" />
        </button>
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full mt-6 px-4 py-3 bg-red-50 text-red-700 rounded-xl lg:rounded-lg hover:bg-red-100 transition font-semibold flex items-center justify-center gap-2 cursor-pointer text-sm lg:text-base"
      >
        <LogOut className="w-5 h-5" />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
}
