'use client';

import { 
  Plus, 
  Search, 
  Edit2,  
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  ShoppingBag,
  Image as ImageIcon
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { AdminSidebar } from '@/shared/components/admin/sidebar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, updateProductStatus, deleteProduct } from '@/modules/product/services/product.service';
import { getAllCategories } from '@/modules/category/services/category.service';
import { Product, ProductQueryParams } from '@/modules/product/types/product.type';
import { Toaster, toast } from 'sonner';
import { Switch } from '@/shared/components/ui/switch';
import { CreateProductModal } from '@/modules/product/components/create-product-modal';
import { UpdateProductModal } from '@/modules/product/components/update-product-modal';
import { ProductImagesModal } from '@/modules/product/components/product-images-modal';
import { Trash2 } from 'lucide-react';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const debouncedSearch = useDebounce(searchTerm, 400);
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const queryClient = useQueryClient();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId, debouncedMinPrice, debouncedMaxPrice]);

  // Build query params
  const queryParams: ProductQueryParams = {
    page,
    limit,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(categoryId && { category_ids: categoryId.toString() }),
    ...(sortBy && { sortBy }),
    ...(sortBy && { sortOrder }),
    ...(debouncedMinPrice && { min_price: Number(debouncedMinPrice) }),
    ...(debouncedMaxPrice && { max_price: Number(debouncedMaxPrice) }),
  };

  const { data: productsResponse, isLoading, error } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => getProducts(queryParams),
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategories(),
  });

  const products = productsResponse?.data?.items || [];
  const meta = productsResponse?.data?.meta || { page: 1, limit: 10, totalItems: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false };
  const categories = categoriesResponse?.data || [];



  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown size={14} className="text-gray-300" />;
    return sortOrder === 'asc' 
      ? <ArrowUp size={14} className="text-[#7a9e8e]" /> 
      : <ArrowDown size={14} className="text-[#7a9e8e]" />;
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number, is_active: boolean }) => updateProductStatus(id, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsUpdateOpen(true);
  };

  const handleOpenGallery = (product: Product) => {
    setSelectedProduct(product);
    setIsGalleryOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryId(undefined);
    setSortBy('');
    setSortOrder('desc');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || categoryId || debouncedMinPrice || debouncedMaxPrice;

  const getMainImage = (product: any) => {
    const mainImage = product.product_images?.find((img: any) => img.is_main);
    return mainImage?.image_url || product.image_url || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
                <p className="text-gray-600">Add, edit, or remove products from your store.</p>
              </div>
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-2 bg-[#7a9e8e] text-white px-5 py-2.5 rounded-xl hover:bg-[#5a7a6b] transition shadow-lg shadow-[#7a9e8e]/20 cursor-pointer"
              >
                <Plus size={20} />
                <span className="font-semibold">Add New Product</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm font-medium">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{meta.totalItems}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm font-medium">Current Page</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{meta.page} / {meta.totalPages || 1}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm font-medium">Per Page</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{limit}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm font-medium">Showing</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{products.length} items</p>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search products by name..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={categoryId || ''}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] transition text-sm cursor-pointer min-w-[180px]"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                {/* Filter Toggle */}
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition text-sm cursor-pointer ${
                    showFilters || hasActiveFilters
                      ? 'border-[#7a9e8e] bg-[#7a9e8e]/5 text-[#7a9e8e]' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <Filter size={16} />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-[#7a9e8e]"></span>
                  )}
                </button>

                {/* Clear */}
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                  >
                    <X size={14} />
                    Clear
                  </button>
                )}
              </div>

              {/* Extended Filters */}
              {showFilters && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-100 mt-0">
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Min Price</label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] transition text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Price</label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="999999"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] transition text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By</label>
                      <div className="flex gap-2">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] transition text-sm cursor-pointer"
                        >
                          <option value="">Default</option>
                          <option value="name">Name</option>
                          <option value="price">Price</option>
                          <option value="created_at">Date Created</option>
                        </select>
                        <button
                          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                          disabled={!sortBy}
                          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <button onClick={() => handleSort('name')} className="flex items-center gap-1.5 cursor-pointer hover:text-gray-700 transition">
                          Product {getSortIcon('name')}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <button onClick={() => handleSort('price')} className="flex items-center gap-1.5 cursor-pointer hover:text-gray-700 transition">
                          Price {getSortIcon('price')}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-[#7a9e8e] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm">Loading products...</p>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-red-500">
                          <p className="text-sm">Error loading products. Please try again.</p>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                              <ShoppingBag size={24} className="text-gray-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700">No products found</p>
                              <p className="text-sm text-gray-400 mt-1">
                                {hasActiveFilters ? 'Try adjusting your filters.' : 'Start by adding your first product.'}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => {
                        const mainImage = getMainImage(product);
                        return (
                          <tr key={product.id} className="hover:bg-gray-50/80 transition group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                {mainImage ? (
                                  <img 
                                    src={mainImage} 
                                    alt={product.name} 
                                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 shadow-sm border border-gray-100"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-100">
                                    <ImageIcon size={18} className="text-gray-400" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="font-bold text-gray-900 group-hover:text-[#7a9e8e] transition-colors truncate max-w-[250px]">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-400 font-medium">ID: #{product.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1.5">
                                {product.categories && product.categories.length > 0 ? (
                                  product.categories.map((cat: any) => (
                                    <span key={cat.id} className="px-2.5 py-0.5 bg-gray-100 rounded-full text-[10px] font-bold text-gray-600 border border-gray-200">
                                      {cat.name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-400">—</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-900 text-sm">
                                  {product.variants && product.variants.length > 0 ? (
                                    (() => {
                                      const prices = product.variants.map(v => v.price);
                                      const minPrice = Math.min(...prices);
                                      const maxPrice = Math.max(...prices);
                                      return minPrice === maxPrice 
                                        ? formatPrice(minPrice) 
                                        : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
                                    })()
                                  ) : (
                                    formatPrice(product.price)
                                  )}
                                </span>
                                {product.variants && product.variants.length > 0 && (
                                  <span className="text-[10px] text-gray-400 font-medium">
                                    {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <Switch 
                                  checked={product.is_active}
                                  onCheckedChange={(checked) => statusMutation.mutate({ id: product.id, is_active: checked })}
                                  disabled={statusMutation.isPending}
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleOpenGallery(product)}
                                  className="p-2 text-gray-400 hover:text-[#7a9e8e] transition-colors bg-white shadow-sm border border-gray-100 rounded-lg cursor-pointer"
                                  title="Manage Gallery"
                                >
                                  <ImageIcon size={16} />
                                </button>
                                <button 
                                  onClick={() => handleEdit(product)}
                                  className="p-2 text-gray-400 hover:text-[#7a9e8e] transition-colors bg-white shadow-sm border border-gray-100 rounded-lg cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(product.id)}
                                  className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white shadow-sm border border-gray-100 rounded-lg cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {meta.totalPages > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">
                    Showing <span className="font-semibold text-gray-900">{((meta.page - 1) * meta.limit) + 1}</span> to{' '}
                    <span className="font-semibold text-gray-900">{Math.min(meta.page * meta.limit, meta.totalItems)}</span> of{' '}
                    <span className="font-semibold text-gray-900">{meta.totalItems}</span> products
                  </p>
                  
                  <div className="flex items-center gap-1.5">
                    {/* First */}
                    <button 
                      onClick={() => setPage(1)}
                      disabled={meta.page <= 1}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronsLeft size={16} />
                    </button>
                    {/* Previous */}
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={meta.page <= 1}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                      .filter(p => {
                        if (meta.totalPages <= 5) return true;
                        if (p === 1 || p === meta.totalPages) return true;
                        if (Math.abs(p - meta.page) <= 1) return true;
                        return false;
                      })
                      .reduce((acc: (number | string)[], p, i, arr) => {
                        if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) {
                          acc.push('...');
                        }
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) => (
                        typeof p === 'string' ? (
                          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">...</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`min-w-[36px] h-9 text-sm font-medium rounded-lg transition cursor-pointer ${
                              meta.page === p
                                ? 'bg-[#7a9e8e] text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      ))
                    }

                    {/* Next */}
                    <button 
                      onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                      disabled={meta.page >= meta.totalPages}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                    {/* Last */}
                    <button 
                      onClick={() => setPage(meta.totalPages)}
                      disabled={meta.page >= meta.totalPages}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronsRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      <CreateProductModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />
      
      <UpdateProductModal 
        isOpen={isUpdateOpen} 
        onClose={() => setIsUpdateOpen(false)} 
        product={selectedProduct}
      />

      <ProductImagesModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        product={selectedProduct}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}
