'use client';

import { 
  ShoppingBag, 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AdminSidebar } from '@/shared/components/admin/sidebar';

const mockProducts = [
  { id: 1, name: 'Illuminating Serum', category: 'Serum', price: 45.00, stock: 120, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=100' },
  { id: 2, name: 'Gentle Cleanser', category: 'Cleanser', price: 28.00, stock: 85, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=100' },
  { id: 3, name: 'Hydrating Cream', category: 'Moisturizer', price: 52.00, stock: 42, image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=100' },
  { id: 4, name: 'Mineral Sunscreen', category: 'Sunscreen', price: 35.00, stock: 15, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=100' },
  { id: 5, name: 'Night Repair Oil', category: 'Oil', price: 60.00, stock: 0, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=100' },
];

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
                <p className="text-gray-600">Add, edit, or remove products from your store.</p>
              </div>
              <button className="flex items-center gap-2 bg-[#7a9e8e] text-white px-5 py-2.5 rounded-xl hover:bg-[#5a7a6b] transition shadow-lg shadow-[#7a9e8e]/20">
                <Plus size={20} />
                <span className="font-semibold">Add New Product</span>
              </button>
            </div>

            {/* Filters Area */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600">
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Product</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Stock</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/80 transition group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-12 h-12 rounded-lg object-cover bg-gray-100 shadow-sm"
                            />
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-[#7a9e8e] transition-colors">{product.name}</p>
                              <p className="text-xs text-gray-400 tracking-wider font-medium">ID: #{product.id}0274</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {product.stock > 0 ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-gray-700">{product.stock} in stock</span>
                              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${product.stock < 20 ? 'bg-orange-400' : 'bg-green-400'}`} 
                                  style={{ width: `${Math.min(product.stock, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">
                              Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <button className="p-2 text-gray-400 hover:text-[#7a9e8e] transition-colors bg-white hover:bg-white shadow-sm border border-gray-100 rounded-lg">
                              <Edit2 size={16} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white hover:bg-white shadow-sm border border-gray-100 rounded-lg">
                              <Trash2 size={16} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors bg-white hover:bg-white shadow-sm border border-gray-100 rounded-lg">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Placeholder */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">Showing <span className="font-medium text-gray-900">1 to 5</span> of <span className="font-medium text-gray-900">24</span> products</p>
                <div className="flex gap-2">
                  <button disabled className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed">Previous</button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm">Next</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
