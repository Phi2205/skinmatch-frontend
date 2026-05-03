'use client';

import { useState, useRef } from 'react';
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
import { createProduct } from '../services/product.service';
import { getAllCategories } from '@/modules/category/services/category.service';
import { getAllBadges } from '@/modules/badges/services/badge.service';
import { getAllConcerns } from '@/modules/concerns/services/concern.service';
import { getAllIngredients } from '@/modules/ingredients/services/ingredient.service';
import { getAllSkinTypes } from '@/modules/skin-types/services/skin-type.service';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const productSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  price: zod.preprocess((val) => Number(val), zod.number().min(0, 'Price must be at least 0')),
  category_id: zod.preprocess((val) => val === '' ? undefined : Number(val), zod.number().optional()),
  summary: zod.string().optional(),
  description: zod.string().optional(),
  ingredient_full_text: zod.string().optional(),
  usage_instructions: zod.string().optional(),
  image_url: zod.string().url('Invalid image URL').or(zod.literal('')).optional(),
  is_featured: zod.boolean().default(false),
  is_active: zod.boolean().default(true),
  badge_ids: zod.array(zod.number()).default([]),
  concern_ids: zod.array(zod.number()).default([]),
  ingredient_ids: zod.array(zod.number()).default([]),
  skin_type_ids: zod.array(zod.number()).default([]),
});

type ProductFormData = zod.infer<typeof productSchema>;

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProductModal({ isOpen, onClose }: CreateProductModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'basic' | 'relations' | 'images'>('basic');
  const [imageMode, setImageMode] = useState<'file' | 'url'>('file');
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
    defaultValues: {
      name: '',
      price: 0,
      is_featured: false,
      is_active: true,
      badge_ids: [],
      concern_ids: [],
      ingredient_ids: [],
      skin_type_ids: [],
    }
  });

  const watchBadgeIds = watch('badge_ids');
  const watchConcernIds = watch('concern_ids');
  const watchIngredientIds = watch('ingredient_ids');
  const watchSkinTypeIds = watch('skin_type_ids');
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
    mutationFn: createProduct,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Product created successfully');
        queryClient.invalidateQueries({ queryKey: ['products'] });
        handleClose();
      } else {
        toast.error(response.message || 'Failed to create product');
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
    if (data.ingredient_full_text) formData.append('ingredient_full_text', data.ingredient_full_text);
    if (data.usage_instructions) formData.append('usage_instructions', data.usage_instructions);
    formData.append('is_featured', data.is_featured.toString());
    formData.append('is_active', data.is_active.toString());

    // Image handling
    if (imageMode === 'file' && selectedFile) {
      formData.append('image', selectedFile);
    } else if (imageMode === 'url' && data.image_url) {
      formData.append('image_url', data.image_url);
    }

    // Relation arrays as JSON strings
    formData.append('badge_ids', JSON.stringify(data.badge_ids));
    formData.append('concern_ids', JSON.stringify(data.concern_ids));
    formData.append('ingredient_ids', JSON.stringify(data.ingredient_ids));
    formData.append('skin_type_ids', JSON.stringify(data.skin_type_ids));

    mutation.mutate(formData);
  };

  const handleClose = () => {
    reset();
    setActiveTab('basic');
    setImageMode('file');
    handleRemoveFile();
    onClose();
  };

  const toggleRelation = (field: keyof ProductFormData, id: number) => {
    const currentIds = watch(field) as number[];
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
                <h2 className="text-2xl font-bold text-gray-900">Create New Product</h2>
                <p className="text-sm text-gray-500">Fill in the details and upload product media.</p>
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
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
                      activeTab === tab.id ? 'text-[#7a9e8e]' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabProduct"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#7a9e8e] rounded-t-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="overflow-y-auto flex-1 bg-gray-50/30">
              <form id="create-product-form" onSubmit={handleSubmit(onSubmit)} className="p-8">
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
                            placeholder="e.g. Ceramide Facial Moisturizer"
                            className={`w-full px-4 py-3 bg-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition ${
                              errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#7a9e8e]'
                            }`}
                          />
                          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Price (VND)</label>
                          <input
                            type="number"
                            {...register('price')}
                            placeholder="0"
                            className={`w-full px-4 py-3 bg-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition ${
                              errors.price ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#7a9e8e]'
                            }`}
                          />
                          {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
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
                        <input
                          {...register('summary')}
                          placeholder="Short tagline for the product..."
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 focus:border-[#7a9e8e] transition"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Full Description</label>
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 focus-within:border-[#7a9e8e] transition">
                          <ReactQuill 
                            theme="snow"
                            value={watch('description') || ''}
                            onChange={(content) => setValue('description', content)}
                            className="quill-editor"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Ingredients (Full Text)</label>
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 focus-within:border-[#7a9e8e] transition">
                          <ReactQuill 
                            theme="snow"
                            value={watch('ingredient_full_text') || ''}
                            onChange={(content) => setValue('ingredient_full_text', content)}
                            className="quill-editor"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Usage Instructions</label>
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 focus-within:border-[#7a9e8e] transition">
                          <ReactQuill 
                            theme="snow"
                            value={watch('usage_instructions') || ''}
                            onChange={(content) => setValue('usage_instructions', content)}
                            className="quill-editor"
                          />
                        </div>
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
                          Main Product Image
                        </label>
                        
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-4 w-fit">
                          <button
                            type="button"
                            onClick={() => setImageMode('file')}
                            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                              imageMode === 'file' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <FileImage size={14} />
                            Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageMode('url')}
                            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                              imageMode === 'url' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <LinkIcon size={14} />
                            Paste URL
                          </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/3 aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative">
                            {imageMode === 'file' ? (
                              filePreview ? (
                                <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-center p-4">
                                  <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                                  <p className="text-xs text-gray-400">Image Preview</p>
                                </div>
                              )
                            ) : (
                              watchImageUrl ? (
                                <img src={watchImageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Invalid+URL'; }} />
                              ) : (
                                <div className="text-center p-4">
                                  <LinkIcon size={32} className="mx-auto text-gray-300 mb-2" />
                                  <p className="text-xs text-gray-400">URL Preview</p>
                                </div>
                              )
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            {imageMode === 'file' ? (
                              <div className="space-y-4">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="w-full flex items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-200 rounded-3xl hover:border-[#7a9e8e] hover:bg-[#7a9e8e]/5 transition cursor-pointer group"
                                >
                                  <div className="text-center">
                                    <Upload size={24} className="mx-auto text-gray-400 group-hover:text-[#7a9e8e] mb-2" />
                                    <p className="text-sm font-bold text-gray-700">Click to upload product image</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                                  </div>
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                {selectedFile && (
                                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                      <FileImage size={18} className="text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-gray-900 truncate">{selectedFile.name}</p>
                                      <p className="text-[10px] text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button type="button" onClick={handleRemoveFile} className="p-2 text-gray-400 hover:text-red-500 rounded-full transition cursor-pointer">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Image URL</label>
                                <div className="relative">
                                  <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input
                                    {...register('image_url')}
                                    placeholder="https://example.com/image.jpg"
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition ${
                                      errors.image_url ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#7a9e8e]'
                                    }`}
                                  />
                                </div>
                                {errors.image_url && <p className="text-xs text-red-500 mt-1">{errors.image_url.message}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">Featured</p>
                            <p className="text-xs text-gray-500">Show in featured lists</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setValue('is_featured', !watch('is_featured'))}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              watch('is_featured') ? 'bg-[#7a9e8e]' : 'bg-gray-200'
                            }`}
                          >
                            <motion.div animate={{ x: watch('is_featured') ? 26 : 2 }} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" />
                          </button>
                        </div>
                        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">Active</p>
                            <p className="text-xs text-gray-500">Visible to customers</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setValue('is_active', !watch('is_active'))}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              watch('is_active') ? 'bg-[#7a9e8e]' : 'bg-gray-200'
                            }`}
                          >
                            <motion.div animate={{ x: watch('is_active') ? 26 : 2 }} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" />
                          </button>
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
                {activeTab !== 'basic' && (
                  <button type="button" onClick={() => setActiveTab(activeTab === 'images' ? 'relations' : 'basic')} className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition cursor-pointer">Back</button>
                )}
                <button type="button" onClick={handleClose} className="px-6 py-3 text-gray-400 font-bold rounded-2xl hover:text-gray-600 transition cursor-pointer">Cancel</button>
              </div>
              
              <div className="flex gap-3">
                {activeTab !== 'images' ? (
                  <button 
                    key="next-btn"
                    type="button" 
                    onClick={() => setActiveTab(activeTab === 'basic' ? 'relations' : 'images')} 
                    className="px-8 py-3 bg-[#7a9e8e] text-white font-bold rounded-2xl hover:bg-[#5a7a6b] transition shadow-lg shadow-[#7a9e8e]/20 cursor-pointer"
                  >
                    Next Step
                  </button>
                ) : (
                  <button 
                    key="submit-btn"
                    type="submit" 
                    form="create-product-form" 
                    disabled={mutation.isPending} 
                    className="px-10 py-3 bg-[#7a9e8e] text-white font-bold rounded-2xl hover:bg-[#5a7a6b] transition flex items-center justify-center gap-2 shadow-xl shadow-[#7a9e8e]/30 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {mutation.isPending ? <><Loader2 size={20} className="animate-spin" />Creating...</> : 'Create Product'}
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
