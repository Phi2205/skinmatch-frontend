'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import { 
  Users, 
  ShoppingBag, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ChevronRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { AdminSidebar } from '@/shared/components/admin/sidebar';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { label: 'Total Sales', value: '$12,450', icon: ShoppingBag, color: 'bg-green-500' },
    { label: 'Active Orders', value: '45', icon: LayoutDashboard, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, Admin!</p>
              </div>
              <button className="flex items-center gap-2 bg-[#7a9e8e] text-white px-4 py-2 rounded-lg hover:bg-[#5a7a6b] transition shadow-sm">
                <Plus size={18} />
                <span>Add Product</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity / Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-semibold text-gray-900">Recent Users</h2>
                <button className="text-[#7a9e8e] text-sm font-medium hover:underline flex items-center gap-1">
                  View All <ChevronRight size={14} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[1, 2, 3].map((item) => (
                      <tr key={item} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#7a9e8e] flex items-center justify-center text-white text-xs font-bold">
                            U{item}
                          </div>
                          <span className="font-medium text-gray-900">User {item}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">user{item}@example.com</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">USER</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">Oct 2{item}, 2023</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
