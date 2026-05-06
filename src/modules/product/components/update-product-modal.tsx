'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
  FileImage,
  Search
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateProduct, getProductById } from '../services/product.service';
import { Product } from '../types/product.type';
import { getAllCategories, createCategory } from '@/modules/category/services/category.service';
import { getAllBadges, createBadge } from '@/modules/badges/services/badge.service';
import { getAllConcerns, createConcern } from '@/modules/concerns/services/concern.service';
import { getAllIngredients, createIngredient } from '@/modules/ingredients/services/ingredient.service';
import { getAllSkinTypes, createSkinType } from '@/modules/skin-types/services/skin-type.service';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const productSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  variants: zod.array(zod.object({
    id: zod.number().optional(),
    price: zod.preprocess((val) => Number(val), zod.number().min(0, 'Price must be at least 0')),
    sku: zod.string().optional().nullable(),
    stock: zod.preprocess((val) => Number(val), zod.number().min(0).default(0)),
    attributes: zod.array(zod.object({
      id: zod.number().optional(),
      name: zod.string().min(1, 'Name is required'),
      value: zod.string().min(1, 'Value is required'),
    })).min(1, 'At least one attribute is required'),
  })).min(1, 'At least one variant is required'),
  category_ids: zod.array(zod.number()).default([]),
  summary: zod.string().optional().nullable(),
  description: zod.string().optional().nullable(),
  ingredient_full_text: zod.string().optional().nullable(),
  usage_instructions: zod.string().optional().nullable(),
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

// Component for nested attributes array
function VariantAttributesFieldArray({ 
  variantIndex, 
  control, 
  register,
  errors 
}: { 
  variantIndex: number, 
  control: any, 
  register: any,
  errors: any
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.attributes`
  });

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap gap-2">
        {fields.map((field, attrIndex) => (
          <div key={field.id} className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 pr-2 shadow-sm">
            <input
              {...register(`variants.${variantIndex}.attributes.${attrIndex}.name` as const)}
              placeholder="Name"
              className="w-16 px-1.5 py-0.5 text-[10px] font-bold border-none bg-gray-50 rounded focus:ring-1 focus:ring-[#7a9e8e] transition"
            />
            <span className="text-gray-300">:</span>
            <input
              {...register(`variants.${variantIndex}.attributes.${attrIndex}.value` as const)}
              placeholder="Value"
              className="w-20 px-1.5 py-0.5 text-[10px] border-none bg-gray-50 rounded focus:ring-1 focus:ring-[#7a9e8e] transition"
            />
            <button
              type="button"
              onClick={() => remove(attrIndex)}
              className="ml-1 text-gray-300 hover:text-red-500 transition cursor-pointer"
              disabled={fields.length === 1}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ name: '', value: '' })}
          className="px-2 py-1 bg-white border border-dashed border-gray-300 text-gray-400 rounded-lg hover:border-[#7a9e8e] hover:text-[#7a9e8e] transition text-[10px] flex items-center gap-1 cursor-pointer"
        >
          <Plus size={10} /> Add Attribute
        </button>
      </div>
      {errors.variants?.[variantIndex]?.attributes && (
        <p className="text-[10px] text-red-500">{errors.variants[variantIndex].attributes.message}</p>
      )}
    </div>
  );
}

export function UpdateProductModal({ isOpen, onClose, product }: UpdateProductModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'basic' | 'relations' | 'images'>('basic');
  const [imageMode, setImageMode] = useState<'file' | 'url'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search & Quick Create states
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [quickCreateField, setQuickCreateField] = useState<{ field: string, label: string } | null>(null);
  const [isCreatingRelation, setIsCreatingRelation] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const { data: productDetailResponse, isLoading: isFetchingDetail } = useQuery({
    queryKey: ['product-detail', product?.id],
    queryFn: () => getProductById(product!.id),
    enabled: !!product?.id && isOpen,
    staleTime: 0,
    gcTime: 0,
  });

  const productDetail = productDetailResponse?.data;

  useEffect(() => {
    if (productDetail && isOpen) {
      reset({
        name: productDetail.name,
        variants: productDetail.variants?.length 
          ? productDetail.variants.map(v => ({
              id: v.id,
              price: v.price,
              sku: v.sku || '',
              stock: v.stock || 0,
              attributes: v.attributes?.length 
                ? v.attributes.map(a => ({ id: a.id, name: a.name, value: a.value }))
                : [{ name: 'volume', value: '' }]
            }))
          : [{ price: 0, sku: '', stock: 0, attributes: [{ name: 'volume', value: '' }] }],
        category_ids: productDetail.categories?.map(c => c.id) || [],
        summary: productDetail.summary || '',
        description: productDetail.description || '',
        ingredient_full_text: productDetail.ingredient_full_text || '',
        usage_instructions: productDetail.usage_instructions || '',
        image_url: productDetail.image_url || '',
        is_featured: productDetail.is_featured,
        is_active: productDetail.is_active,
        badge_ids: productDetail.badges?.map(b => b.id) || [],
        concern_ids: productDetail.concerns?.map(c => c.id) || [],
        skin_type_ids: productDetail.skin_types?.map(s => s.id) || [],
        ingredient_ids: productDetail.ingredients?.map(i => i.id) || [],
      });
      setSelectedFile(null);
      setFilePreview(null);
      setImageMode(productDetail.image_url ? 'url' : 'file');
    }
  }, [productDetail, isOpen, reset]);

  const watchBadgeIds = watch('badge_ids') || [];
  const watchCategoryIds = watch('category_ids') || [];
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
    queryKey: ['skin_types'], 
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
    // Strip IDs before sending to backend because it recreates variants
    // Strip IDs from variants and attributes before sending to backend because it recreates variants
    formData.append('variants', JSON.stringify(data.variants.map(({ id, attributes, ...v }) => ({
      ...v,
      attributes: attributes.map(({ id: attrId, ...attr }) => attr)
    }))));
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

    // Relation arrays
    formData.append('category_ids', JSON.stringify(data.category_ids));
    formData.append('badge_ids', JSON.stringify(data.badge_ids));
    formData.append('concern_ids', JSON.stringify(data.concern_ids));
    formData.append('ingredient_ids', JSON.stringify(data.ingredient_ids));
    formData.append('skin_type_ids', JSON.stringify(data.skin_type_ids));

    mutation.mutate(formData);
  };

  const handleClose = () => {
    reset({
      name: '',
      variants: [{ price: 0, sku: '', stock: 0, attributes: [{ name: 'volume', value: '' }] }],
      category_ids: [],
      summary: '',
      description: '',
      ingredient_full_text: '',
      usage_instructions: '',
      image_url: '',
      badge_ids: [],
      concern_ids: [],
      skin_type_ids: [],
      ingredient_ids: [],
    });
    setActiveTab('basic');
    setSearchQueries({});
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

  const handleAddNewRelation = async (field: string, name: string) => {
    if (!name.trim()) return;
    setIsCreatingRelation(true);
    try {
      let response: any;
      if (field === 'category_ids') response = await createCategory({ name });
      else if (field === 'badge_ids') {
        const formData = new FormData();
        formData.append('name', name);
        response = await createBadge(formData);
      }
      else if (field === 'concern_ids') response = await createConcern({ name });
      else if (field === 'ingredient_ids') response = await createIngredient({ name });
      else if (field === 'skin_type_ids') response = await createSkinType({ name });

      if (response?.success) {
        toast.success(`Created new item`);
        const newItem = response.data;
        
        // Update local query cache immediately
        const queryKey = [field.replace('_ids', 's')];
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;
          return { ...old, data: [...(old.data || []), newItem] };
        });

        // Select the new item
        const currentIds = (watch(field as any) || []) as number[];
        setValue(field as any, [...currentIds, newItem.id]);
        
        // Clear search
        setSearchQueries(prev => ({ ...prev, [field]: '' }));
        setQuickCreateField(null);
      }
    } catch (error) {
      toast.error('Failed to create item');
    } finally {
      setIsCreatingRelation(false);
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
  }) => {
    const query = searchQueries[field] || '';
    const filteredOptions = options.filter(opt => 
      opt.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-700">{label}</label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${label.toLowerCase()}...`}
                value={query}
                onChange={(e) => setSearchQueries(prev => ({ ...prev, [field]: e.target.value }))}
                className="pl-8 pr-3 py-1.5 bg-gray-100 border-none rounded-lg text-xs focus:ring-1 focus:ring-[#7a9e8e] transition w-40"
              />
            </div>
            <button
              type="button"
              onClick={() => setQuickCreateField({ field, label })}
              className="p-1.5 bg-[#7a9e8e]/10 text-[#7a9e8e] rounded-lg hover:bg-[#7a9e8e] hover:text-white transition cursor-pointer"
              title={`Add new ${label.toLowerCase()}`}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 p-3 bg-white border border-gray-100 rounded-2xl min-h-[50px] max-h-40 overflow-y-auto shadow-inner">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const isSelected = selectedIds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleRelation(field, opt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected 
                      ? 'bg-[#7a9e8e] text-white border-[#7a9e8e] shadow-md shadow-[#7a9e8e]/20' 
                      : 'bg-gray-50 text-gray-600 border-transparent hover:border-[#7a9e8e] hover:bg-white'
                  }`}
                >
                  {isSelected && <Check size={12} className="inline mr-1" />}
                  {opt.name}
                </button>
              );
            })
          ) : (
            <div className="w-full py-2 text-center">
              <p className="text-[10px] text-gray-400 italic">No {label.toLowerCase()} found</p>
              {query && (
                <button
                  type="button"
                  onClick={() => handleAddNewRelation(field, query)}
                  className="mt-2 text-[10px] text-[#7a9e8e] font-bold hover:underline cursor-pointer"
                >
                  Create "{query}"?
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

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
                    type="button"
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
            <div className="overflow-y-auto flex-1 bg-gray-50/30 min-h-[400px]">
              {isFetchingDetail ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-[#7a9e8e] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-gray-500">Fetching product details...</p>
                </div>
              ) : (
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
                      </div>

                      <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-gray-900">Product Variants (Volume & Price)</label>
                          <button
                            type="button"
                            onClick={() => append({ price: 0, sku: '', stock: 0, attributes: [{ name: 'volume', value: '' }] })}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#7a9e8e]/10 text-[#7a9e8e] rounded-xl hover:bg-[#7a9e8e] hover:text-white transition text-xs font-bold cursor-pointer"
                          >
                            <Plus size={14} />
                            Add Variant
                          </button>
                        </div>

                        <div className="space-y-4">
                          {fields.map((field, index) => (
                            <div key={field.id} className="p-4 bg-gray-50 rounded-2xl relative group space-y-4">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold text-[#7a9e8e] bg-[#7a9e8e]/10 px-2 py-1 rounded-lg">Variant #{index + 1}</span>
                                {fields.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Price (VND)</label>
                                  <input
                                    type="number"
                                    {...register(`variants.${index}.price` as const)}
                                    placeholder="0"
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7a9e8e] transition text-sm font-bold"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">SKU</label>
                                  <input
                                    {...register(`variants.${index}.sku` as const)}
                                    placeholder="SKU..."
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7a9e8e] transition text-sm"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Stock</label>
                                  <input
                                    type="number"
                                    {...register(`variants.${index}.stock` as const)}
                                    placeholder="0"
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7a9e8e] transition text-sm"
                                  />
                                </div>
                              </div>

                              <div className="space-y-3 pt-2 border-t border-gray-200/50">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Attributes (e.g. Volume, Color)</label>
                                  <VariantAttributesFieldArray variantIndex={index} control={control} register={register} errors={errors} />
                                </div>
                              </div>
                            </div>
                          ))}
                          {errors.variants && (
                            <p className="text-xs text-red-500">{errors.variants.message}</p>
                          )}
                        </div>
                      </div>

                      <MultiSelectField label="Categories" field="category_ids" options={categories} selectedIds={watchCategoryIds} />

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Summary</label>
                        <input {...register('summary')} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 focus:border-[#7a9e8e] transition" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Full Description</label>
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 focus-within:border-[#7a9e8e] transition">
                          <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                              <ReactQuill 
                                theme="snow"
                                value={field.value || ''}
                                onChange={field.onChange}
                                className="quill-editor"
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Ingredients (Full Text)</label>
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 focus-within:border-[#7a9e8e] transition">
                          <Controller
                            name="ingredient_full_text"
                            control={control}
                            render={({ field }) => (
                              <ReactQuill 
                                theme="snow"
                                value={field.value || ''}
                                onChange={field.onChange}
                                className="quill-editor"
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Usage Instructions</label>
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 focus-within:border-[#7a9e8e] transition">
                          <Controller
                            name="usage_instructions"
                            control={control}
                            render={({ field }) => (
                              <ReactQuill 
                                theme="snow"
                                value={field.value || ''}
                                onChange={field.onChange}
                                className="quill-editor"
                              />
                            )}
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
                                    <button type="button" onClick={handleRemoveFile} className="p-2 text-gray-400 hover:text-red-500 rounded-full transition cursor-pointer"><Trash2 size={16} /></button>
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
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-white sticky bottom-0 z-10">
              <div className="flex gap-2">
                {activeTab !== 'basic' && <button type="button" onClick={() => setActiveTab(activeTab === 'images' ? 'relations' : 'basic')} className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition cursor-pointer">Back</button>}
                <button type="button" onClick={handleClose} className="px-6 py-3 text-gray-400 font-bold rounded-2xl hover:text-gray-600 transition cursor-pointer">Cancel</button>
              </div>
              <div className="flex gap-3">
                {activeTab !== 'images' ? (
                  <button 
                    key="next-btn"
                    type="button" 
                    onClick={() => setActiveTab(activeTab === 'basic' ? 'relations' : 'images')} 
                    className="px-8 py-3 bg-[#7a9e8e] text-white font-bold rounded-2xl hover:bg-[#5a7a6b] transition cursor-pointer"
                  >
                    Next Step
                  </button>
                ) : (
                  <button 
                    key="save-btn"
                    type="submit" 
                    form="update-product-form" 
                    disabled={mutation.isPending} 
                    className="px-10 py-3 bg-[#7a9e8e] text-white font-bold rounded-2xl hover:bg-[#5a7a6b] transition flex items-center justify-center gap-2 shadow-xl shadow-[#7a9e8e]/30 disabled:opacity-70 cursor-pointer"
                  >
                    {mutation.isPending ? <><Loader2 size={20} className="animate-spin" />Saving...</> : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          <QuickCreateModal
            isOpen={!!quickCreateField}
            onClose={() => setQuickCreateField(null)}
            onConfirm={(name) => quickCreateField && handleAddNewRelation(quickCreateField.field, name)}
            label={quickCreateField?.label || ''}
            isPending={isCreatingRelation}
            initialValue={quickCreateField ? searchQueries[quickCreateField.field] : ''}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

// Quick Create Modal Component
function QuickCreateModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  label, 
  isPending,
  initialValue = ''
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: (name: string) => void, 
  label: string, 
  isPending: boolean,
  initialValue?: string
}) {
  const [name, setName] = useState(initialValue);

  useEffect(() => {
    if (isOpen) setName(initialValue);
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New {label}</h3>
        <div className="space-y-4">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()} name...`}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] transition"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.trim()) onConfirm(name);
              if (e.key === 'Escape') onClose();
            }}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!name.trim() || isPending}
              onClick={() => onConfirm(name)}
              className="flex-[2] px-4 py-2.5 bg-[#7a9e8e] text-white font-bold rounded-xl hover:bg-[#5a7a6b] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : 'Create'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
