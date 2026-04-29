'use client';

import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Layers,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AdminSidebar } from '@/shared/components/admin/sidebar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCategories, updateStatusCategory } from '@/modules/category/services/category.service';
import { CreateCategoryModal } from '@/modules/category/components/create-category-modal';
import { UpdateCategoryModal } from '@/modules/category/components/update-category-modal';
import { Category } from '@/modules/category/types/category.type';
import { Toaster, toast } from 'sonner';
import { Switch } from '@/shared/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

const removeAccents = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export default function AdminCategories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();
  const { data: categoriesResponse, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategories(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number, is_active: boolean }) => 
      updateStatusCategory(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Status updated');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    }
  });

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    statusMutation.mutate({ id, is_active: !currentStatus });
  };

  const categories = categoriesResponse?.data || [];
  
  const filteredCategories = categories.filter(category => {
    const nameStr = removeAccents(category?.name || '').toLowerCase();
    const slugStr = removeAccents(category?.slug || '').toLowerCase();
    const searchNormalized = removeAccents(searchTerm).toLowerCase();
    
    const matchesSearch = nameStr.includes(searchNormalized) || slugStr.includes(searchNormalized);
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && category.is_active) ||
                         (statusFilter === 'inactive' && !category.is_active);
    
    return matchesSearch && matchesStatus;
  });

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
                <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
                <p className="text-gray-600">Organize your products into logical groups.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-[#7a9e8e] text-white px-5 py-2.5 rounded-xl hover:bg-[#5a7a6b] transition shadow-lg shadow-[#7a9e8e]/20 cursor-pointer"
              >
                <Plus size={20} />
                <span className="font-semibold">Create New Category</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
               <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                   <p className="text-gray-500 text-sm font-medium">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
               </div>
               <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-gray-500 text-sm font-medium">Active Categories</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{categories.length}</p>
               </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search categories..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
                  <TabsList className="bg-gray-100/80 border border-gray-200/50 p-1 w-full md:w-72">
                    <TabsTrigger value="all" className="flex-1 px-4 py-1.5 data-[state=active]:bg-[#7a9e8e] data-[state=active]:text-white">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="active" className="flex-1 px-4 py-1.5 data-[state=active]:bg-[#7a9e8e] data-[state=active]:text-white">
                      Active
                    </TabsTrigger>
                    <TabsTrigger value="inactive" className="flex-1 px-4 py-1.5 data-[state=active]:bg-[#7a9e8e] data-[state=active]:text-white">
                      Inactive
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Category Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Slug</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-[#7a9e8e] border-t-transparent rounded-full animate-spin"></div>
                            <p>Loading categories...</p>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-red-500">
                          Error loading categories. Please try again.
                        </td>
                      </tr>
                    ) : filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                          {searchTerm ? `No categories found matching "${searchTerm}"` : 'No categories found.'}
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50/80 transition group">
                          <td className="px-6 py-4 text-sm font-medium text-gray-400">
                            #{category.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl bg-[#7a9e8e]/10 flex items-center justify-center text-[#7a9e8e]`}>
                                <Layers size={20} />
                              </div>
                              <p className="font-bold text-gray-900 group-hover:text-[#7a9e8e] transition-colors">{category.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{category.slug}</code>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <Switch
                                checked={category.is_active}
                                onCheckedChange={() => handleToggleStatus(category.id, category.is_active)}
                                disabled={statusMutation.isPending}
                                className="data-[state=checked]:bg-[#7a9e8e]"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button 
                                onClick={() => setEditingCategory(category)}
                                className="p-2 text-gray-400 hover:text-[#7a9e8e] transition-colors bg-white shadow-sm border border-gray-100 rounded-lg cursor-pointer"
                              >
                                <Edit2 size={16} />
                              </button>
                              {/* <button className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white shadow-sm border border-gray-100 rounded-lg">
                                <Trash2 size={16} />
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CreateCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <UpdateCategoryModal
        isOpen={!!editingCategory}
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
      />
      
      <Toaster richColors position="top-right" />
    </div>
  );
}
