'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { X, Loader2, Plus, Trash2, FileJson, ListPlus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMultipleCategories } from '../services/category.service';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const categorySchema = zod.object({
  categories: zod.array(
    zod.object({
      name: zod.string().min(2, 'Name must be at least 2 characters'),
    })
  ).min(1, 'Please add at least one category'),
});

type CategoryFormData = zod.infer<typeof categorySchema>;

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCategoryModal({ isOpen, onClose }: CreateCategoryModalProps) {
  const queryClient = useQueryClient();
  const [inputMode, setInputMode] = useState<'form' | 'json'>('form');
  const [jsonInput, setJsonInput] = useState('');
  
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categories: [{ name: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories'
  });

  const mutation = useMutation({
    mutationFn: createMultipleCategories,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Categories created successfully');
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        reset();
        onClose();
      } else {
        toast.error(response.message || 'Failed to create categories');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    },
  });

  const handleFormSubmit = (data: CategoryFormData) => {
    mutation.mutate(data);
  };

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      let payload: any[] = [];
      
      if (Array.isArray(parsed)) {
        payload = parsed.map(item => {
          if (typeof item === 'string') return { name: item };
          if (item && item.name) return { name: item.name };
          throw new Error('Invalid format. Array items must be strings or objects with a "name" property.');
        });
      } else if (parsed && Array.isArray(parsed.categories)) {
        payload = parsed.categories;
      } else {
        throw new Error('JSON must be an array or an object containing a "categories" array.');
      }
      
      if (payload.length === 0) throw new Error('No items found');
      
      mutation.mutate({ categories: payload });
    } catch (err: any) {
      toast.error('JSON Error: ' + err.message);
    }
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMode === 'json') {
      handleJsonSubmit();
    } else {
      handleSubmit(handleFormSubmit)(e);
    }
  };

  const handleClose = () => {
    reset();
    setJsonInput('');
    setInputMode('form');
    onClose();
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
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Create Categories</h2>
              <button 
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 pt-4">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setInputMode('form')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    inputMode === 'form' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ListPlus size={16} />
                  Form View
                </button>
                <button
                  onClick={() => setInputMode('json')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    inputMode === 'json' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileJson size={16} />
                  JSON View
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              <form id="category-form" onSubmit={submitHandler} className="space-y-4">
                {inputMode === 'json' ? (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Paste JSON Data</label>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder={`[
  { "name": "Serums" },
  { "name": "Moisturizers" }
]
// or simply:
["Serums", "Moisturizers"]`}
                      rows={10}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 focus:border-[#7a9e8e] transition font-mono text-sm resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      Supports arrays of strings <code>["A", "B"]</code> or objects <code>[{`{"name": "A"}`}]</code>.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Category Name {index + 1}</label>
                        <input
                          {...register(`categories.${index}.name` as const)}
                          placeholder="e.g. Cleansers, Toners"
                          className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition ${
                            errors.categories?.[index]?.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#7a9e8e]'
                          }`}
                        />
                        {errors.categories?.[index]?.name && (
                          <p className="text-xs text-red-500 mt-1">{errors.categories[index]?.name?.message}</p>
                        )}
                      </div>
                      
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-[26px] p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => append({ name: '' })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-[#7a9e8e] text-[#7a9e8e] font-semibold rounded-xl hover:bg-[#7a9e8e]/5 transition cursor-pointer"
                >
                  <Plus size={18} />
                  Add Another Category
                </button>
                {errors.categories && !Array.isArray(errors.categories) && (
                  <p className="text-xs text-red-500 mt-1">{errors.categories.message}</p>
                )}
                  </>
                )}
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-white">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="category-form"
                disabled={mutation.isPending}
                className="flex-1 px-4 py-2.5 bg-[#7a9e8e] text-white font-semibold rounded-xl hover:bg-[#5a7a6b] transition flex items-center justify-center gap-2 shadow-lg shadow-[#7a9e8e]/20 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  `Create ${fields.length > 1 ? 'Categories' : 'Category'}`
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
