'use client';

import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  Tag
} from 'lucide-react';
import { useState } from 'react';
import { AdminSidebar } from '@/shared/components/admin/sidebar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllBadges, deleteBadge } from '@/modules/badges/services/badge.service';
import { CreateBadgeModal } from '@/modules/badges/components/create-badge-modal';
import { UpdateBadgeModal } from '@/modules/badges/components/update-badge-modal';
import { Badge } from '@/modules/badges/types/badge.type';
import { Toaster, toast } from 'sonner';

export default function AdminBadges() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const queryClient = useQueryClient();
  const { data: badgesResponse, isLoading, error } = useQuery({
    queryKey: ['badges'],
    queryFn: () => getAllBadges(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBadge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      toast.success('Badge deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete badge');
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this badge?')) {
      deleteMutation.mutate(id);
    }
  };

  const badges = badgesResponse?.data || [];
  
  const filteredBadges = badges.filter(badge => 
    badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    badge.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-2xl font-bold text-gray-900">Manage Badges</h1>
                <p className="text-gray-600">Create and manage badges for your products.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-[#7a9e8e] text-white px-5 py-2.5 rounded-xl hover:bg-[#5a7a6b] transition shadow-lg shadow-[#7a9e8e]/20 cursor-pointer"
              >
                <Plus size={20} />
                <span className="font-semibold">Create New Badge</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
               <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                   <p className="text-gray-500 text-sm font-medium">Total Badges</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{badges.length}</p>
               </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search badges..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Badge Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Slug</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Icon</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-[#7a9e8e] border-t-transparent rounded-full animate-spin"></div>
                            <p>Loading badges...</p>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-red-500">
                          Error loading badges. Please try again.
                        </td>
                      </tr>
                    ) : filteredBadges.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                          {searchTerm ? `No badges found matching "${searchTerm}"` : 'No badges found.'}
                        </td>
                      </tr>
                    ) : (
                      filteredBadges.map((badge) => (
                        <tr key={badge.id} className="hover:bg-gray-50/80 transition group">
                          <td className="px-6 py-4 text-sm font-medium text-gray-400">
                            #{badge.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl bg-[#7a9e8e]/10 flex items-center justify-center text-[#7a9e8e]`}>
                                <Tag size={20} />
                              </div>
                              <p className="font-bold text-gray-900 group-hover:text-[#7a9e8e] transition-colors">{badge.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{badge.slug}</code>
                          </td>
                          <td className="px-6 py-4">
                            {badge.icon_url ? (
                              <img src={badge.icon_url} alt={badge.name} className="w-8 h-8 object-contain" />
                            ) : (
                              <span className="text-gray-400 text-xs">No Icon</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button 
                                onClick={() => setEditingBadge(badge)}
                                className="p-2 text-gray-400 hover:text-[#7a9e8e] transition-colors bg-white shadow-sm border border-gray-100 rounded-lg cursor-pointer"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(badge.id)}
                                disabled={deleteMutation.isPending}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white shadow-sm border border-gray-100 rounded-lg cursor-pointer disabled:opacity-50"
                              >
                                <Trash2 size={16} />
                              </button>
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

      <CreateBadgeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <UpdateBadgeModal
        isOpen={!!editingBadge}
        badge={editingBadge}
        onClose={() => setEditingBadge(null)}
      />
      
      <Toaster richColors position="top-right" />
    </div>
  );
}
