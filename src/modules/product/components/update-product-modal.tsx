'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { 
  X, 
  Loader2, 
  Upload, 
  ImageIcon, 
  Link as LinkIcon, 
  Plus, 
  Trash2,
  Check,
  FileImage
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../services/product.service';
import { Product } from '../types/product.type';
import { getAllCategories } from '@/modules/category/services/category.service';
import { getAllBadges } from '@/modules/badges/services/badge.service';
import { getAllConcerns } from '@/modules/concerns/services/concern.service';
import { getAllIngredients } from '@/modules/ingredients/services/ingredient.service';
import { getAllSkinTypes } from '@/modules/skin-types/services/skin-type.service';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const productSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  price: zod.preprocess((val) => Number(val), zod.number().min(0, 'Price must be at least 0')),
  category_id: zod.preprocess((val) => val === '' ? undefined : Number(val), zod.number().optional()),
  summary: zod.string().optional().nullable(),
  description: zod.string().optional().nullable(),
  image_url: zod.string().url('Invalid image URL').or(zod.literal('')).optional().nullable(),
  is_featured: zod.boolean().default(false),
  is_active: zod.boolean().default(true),
  badge_ids: zod.array(zod.number()).default([]),
  concern_ids: zod.array(zod.number()).default([]),
  ingredient_ids: zod.array(zod.number()).default([]),
  skin_type_ids: zod.array(zod.number()).default([]),
});

type ProductFormData = zod.infer<typeof productSchema>;

interface UpdateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function UpdateProductModal({ isOpen, onClose, product }: UpdateProductModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'basic' | 'relations' | 'images'>('basic');
  const [imageMode, setImageMode] = useState<'file' | 'url'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product && isOpen) {
      reset({
        name: product.name,
        price: product.price,
        category_id: product.category_id || undefined,
        summary: product.summary,
        description: product.description,
        image_url: product.image_url,
        is_featured: product.is_featured,
        is_active: product.is_active,
        badge_ids: product.product_badges?.map(pb => pb.badges.id) || [],
        concern_ids: product.product_concerns?.map(pc => pc.concerns.id) || [],
        skin_type_ids: product.product_skin_types?.map(ps => ps.skin_types.id) || [],
        ingredient_ids: product.product_ingredients?.map(pi => pi.ingredients.id) || [],
      });
      setSelectedFile(null);
      setFilePreview(null);
      setImageMode(product.image_url ? 'url' : 'file');
    }
  }, [product, isOpen, reset]);

  const watchBadgeIds = watch('badge_ids') || [];
  const watchConcernIds = watch('concern_ids') || [];
  const watchIngredientIds = watch('ingredient_ids') || [];
  const watchSkinTypeIds = watch('skin_type_ids') || [];
  const watchImageUrl = watch('image_url');

  // Queries for data - Only fetch when modal is open
  const { data: categoriesResponse } = useQuery({ 
    queryKey: ['categories'], 
    queryFn: getAllCategories,
    enabled: isOpen 
  });
  const { data: badgesResponse } = useQuery({ 
    queryKey: ['badges'], 
    queryFn: getAllBadges,
    enabled: isOpen 
  });
  const { data: concernsResponse } = useQuery({ 
    queryKey: ['concerns'], 
    queryFn: getAllConcerns,
    enabled: isOpen 
  });
  const { data: ingredientsResponse } = useQuery({ 
    queryKey: ['ingredients'], 
    queryFn: getAllIngredients,
    enabled: isOpen 
  });
  const { data: skinTypesResponse } = useQuery({ 
    queryKey: ['skin-types'], 
    queryFn: getAllSkinTypes,
    enabled: isOpen 
  });

  const categories = categoriesResponse?.data || [];
  const badges = badgesResponse?.data || [];
  const concerns = concernsResponse?.data || [];
  const ingredients = ingredientsResponse?.data || [];
  const skinTypes = skinTypesResponse?.data || [];

  const mutation = useMutation({
    mutationFn: (data: FormData) => updateProduct(product!.id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Product updated successfully');
        queryClient.invalidateQueries({ queryKey: ['products'] });
        handleClose();
      } else {
        toast.error(response.message || 'Failed to update product');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setImageMode('file');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();
    
    // Basic fields
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    if (data.category_id) formData.append('category_id', data.category_id.toString());
    if (data.summary) formData.append('summary', data.summary);
    if (data.description) formData.append('description', data.description);
    formData.append('is_featured', data.is_featured.toString());
    formData.append('is_active', data.is_active.toString());

    // Image handling
    if (imageMode === 'file' && selectedFile) {
      formData.append('image', selectedFile);
    } else if (imageMode === 'url' && data.image_url) {
      formData.append('image_url', data.image_url);
    }

    // Relation arrays
    formData.append('badge_ids', JSON.stringify(data.badge_ids));
    formData.append('concern_ids', JSON.stringify(data.concern_ids));
    formData.append('ingredient_ids', JSON.stringify(data.ingredient_ids));
    formData.append('skin_type_ids', JSON.stringify(data.skin_type_ids));

    mutation.mutate(formData);
  };

  const handleClose = () => {
    setActiveTab('basic');
    onClose();
  };

  const toggleRelation = (field: keyof ProductFormData, id: number) => {
    const currentIds = (watch(field) || []) as number[];
    if (currentIds.includes(id)) {
      setValue(field, currentIds.filter(i => i !== id) as any);
    } else {
      setValue(field, [...currentIds, id] as any);
    }
  };

  const MultiSelectField = ({ 
    label, 
    field, 
    options, 
    selectedIds 
  }: { 
    label: string, 
    field: keyof ProductFormData, 
    options: any[], 
    selectedIds: number[] 
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[46px]">
        {options.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleRelation(field, opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                isSelected 
                  ? 'bg-[#7a9e8e] text-white border-[#7a9e8e] shadow-sm' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#7a9e8e] hover:text-[#7a9e8e]'
              }`}
            >
              {isSelected && <Check size={12} className="inline mr-1" />}
              {opt.name}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Update Product</h2>
                <p className="text-sm text-gray-500">Modify details for: <span className="text-[#7a9e8e] font-semibold">{product?.name}</span></p>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 py-2 border-b border-gray-50 bg-white">
              <div className="flex gap-8">
                {[
                  { id: 'basic', label: 'Basic Info' },
                  { id: 'relations', label: 'Relations' },
                  { id: 'images', label: 'Media & Status' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
                      activeTab === tab.id ? 'text-[#7a9e8e]' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="activeTabProductUpdate" className="absolute bottom-0 left-0 right-0 h-1 bg-[#7a9e8e] rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="overflow-y-auto flex-1 bg-gray-50/30">
              <form id="update-product-form" onSubmit={handleSubmit(onSubmit)} className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'basic' && (
                    <motion.div
                      key="basic"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Product Name</label>
                          <input
                            {...register('name')}
                            className={`w-full px-4 py-3 bg-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition ${
                              errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#7a9e8e]'
                            }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Price (VND)</label>
                          <input
                            type="number"
                            {...register('price')}
                            className={`w-full px-4 py-3 bg-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition ${
                              errors.price ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#7a9e8e]'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <select
                          {...register('category_id')}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 focus:border-[#7a9e8e] transition cursor-pointer appearance-none"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Summary</label>
                        <input {...register('summary')} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 focus:border-[#7a9e8e] transition" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Full Description</label>
                        <textarea {...register('description')} rows={4} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 focus:border-[#7a9e8e] transition resize-none" />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'relations' && (
                    <motion.div
                      key="relations"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <MultiSelectField label="Concerns" field="concern_ids" options={concerns} selectedIds={watchConcernIds} />
                        <MultiSelectField label="Badges" field="badge_ids" options={badges} selectedIds={watchBadgeIds} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <MultiSelectField label="Skin Types" field="skin_type_ids" options={skinTypes} selectedIds={watchSkinTypeIds} />
                        <MultiSelectField label="Ingredients" field="ingredient_ids" options={ingredients} selectedIds={watchIngredientIds} />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'images' && (
                    <motion.div
                      key="images"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8"
                    >
                      <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4">
                        <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                          <ImageIcon size={18} className="text-[#7a9e8e]" />
                          Product Image
                        </label>
                        
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-4 w-fit">
                          <button type="button" onClick={() => setImageMode('file')} className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${imageMode === 'file' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                            <FileImage size={14} /> Upload New
                          </button>
                          <button type="button" onClick={() => setImageMode('url')} className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${imageMode === 'url' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                            <LinkIcon size={14} /> Paste URL
                          </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/3 aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative">
                            {imageMode === 'file' && filePreview ? (
                              <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : watchImageUrl ? (
                              <img src={watchImageUrl} alt="Current" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center p-4">
                                <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-xs text-gray-400">No Image</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            {imageMode === 'file' ? (
                              <div className="space-y-4">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-200 rounded-3xl hover:border-[#7a9e8e] hover:bg-[#7a9e8e]/5 transition cursor-pointer group">
                                  <div className="text-center">
                                    <Upload size={24} className="mx-auto text-gray-400 group-hover:text-[#7a9e8e] mb-2" />
                                    <p className="text-sm font-bold text-gray-700">Replace main image</p>
                                    <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                                  </div>
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                {selectedFile && (
                                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <FileImage size={18} className="text-gray-400" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-gray-900 truncate">{selectedFile.name}</p>
                                    </div>
                                    <button onClick={handleRemoveFile} className="p-2 text-gray-400 hover:text-red-500 rounded-full transition cursor-pointer"><Trash2 size={16} /></button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Image URL</label>
                                <input {...register('image_url')} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between">
                          <div><p className="font-bold text-gray-900">Featured</p></div>
                          <button type="button" onClick={() => setValue('is_featured', !watch('is_featured'))} className={`w-12 h-6 rounded-full relative cursor-pointer ${watch('is_featured') ? 'bg-[#7a9e8e]' : 'bg-gray-200'}`}><motion.div animate={{ x: watch('is_featured') ? 26 : 2 }} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" /></button>
                        </div>
                        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between">
                          <div><p className="font-bold text-gray-900">Active</p></div>
                          <button type="button" onClick={() => setValue('is_active', !watch('is_active'))} className={`w-12 h-6 rounded-full relative cursor-pointer ${watch('is_active') ? 'bg-[#7a9e8e]' : 'bg-gray-200'}`}><motion.div animate={{ x: watch('is_active') ? 26 : 2 }} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" /></button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-white sticky bottom-0 z-10">
              <div className="flex gap-2">
                {activeTab !== 'basic' && <button type="button" onClick={() => setActiveTab(activeTab === 'images' ? 'relations' : 'basic')} className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition cursor-pointer">Back</button>}
                <button type="button" onClick={handleClose} className="px-6 py-3 text-gray-400 font-bold rounded-2xl hover:text-gray-600 transition cursor-pointer">Cancel</button>
              </div>
              <div className="flex gap-3">
                {activeTab !== 'images' ? (
                  <button type="button" onClick={() => setActiveTab(activeTab === 'basic' ? 'relations' : 'images')} className="px-8 py-3 bg-[#7a9e8e] text-white font-bold rounded-2xl hover:bg-[#5a7a6b] transition cursor-pointer">Next Step</button>
                ) : (
                  <button type="submit" form="update-product-form" disabled={mutation.isPending} className="px-10 py-3 bg-[#7a9e8e] text-white font-bold rounded-2xl hover:bg-[#5a7a6b] transition flex items-center justify-center gap-2 shadow-xl shadow-[#7a9e8e]/30 disabled:opacity-70 cursor-pointer">
                    {mutation.isPending ? <><Loader2 size={20} className="animate-spin" />Saving...</> : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
