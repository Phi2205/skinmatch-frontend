'use client';

import { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { X, Loader2, Plus, Trash2, FileJson, ListPlus, Upload, ImageIcon, Link, FileImage } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBadge, createMultipleBadges } from '../services/badge.service';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const badgeSchema = zod.object({
  badges: zod.array(
    zod.object({
      name: zod.string().min(2, 'Name must be at least 2 characters'),
    })
  ).min(1, 'Please add at least one badge'),
});

type BadgeFormData = zod.infer<typeof badgeSchema>;

interface BadgeIconState {
  mode: 'file' | 'url';
  file: File | null;
  url: string;
  previewUrl: string | null;
}

interface CreateBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBadgeModal({ isOpen, onClose }: CreateBadgeModalProps) {
  const queryClient = useQueryClient();
  const [inputMode, setInputMode] = useState<'form' | 'json'>('form');
  const [jsonInput, setJsonInput] = useState('');
  const [iconStates, setIconStates] = useState<BadgeIconState[]>([{ mode: 'file', file: null, url: '', previewUrl: null }]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<BadgeFormData>({
    resolver: zodResolver(badgeSchema),
    defaultValues: {
      badges: [{ name: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'badges'
  });

  const updateIconState = (index: number, updates: Partial<BadgeIconState>) => {
    setIconStates(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      updateIconState(index, { file, previewUrl: URL.createObjectURL(file) });
    }
  };

  const handleRemoveIcon = (index: number) => {
    updateIconState(index, { file: null, url: '', previewUrl: null });
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = '';
    }
  };

  const handleAppend = () => {
    append({ name: '' });
    setIconStates(prev => [...prev, { mode: 'file', file: null, url: '', previewUrl: null }]);
  };

  const handleRemove = (index: number) => {
    remove(index);
    setIconStates(prev => prev.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: async (data: BadgeFormData) => {
      // Create badges one by one since each may have a file
      const results = [];
      for (let i = 0; i < data.badges.length; i++) {
        const formData = new FormData();
        formData.append('name', data.badges[i].name);
        
        const iconState = iconStates[i];
        if (iconState) {
          if (iconState.mode === 'file' && iconState.file) {
            formData.append('icon', iconState.file);
          } else if (iconState.mode === 'url' && iconState.url.trim()) {
            formData.append('icon_url', iconState.url.trim());
          }
        }
        
        const result = await createBadge(formData);
        results.push(result);
      }
      return results;
    },
    onSuccess: () => {
      toast.success('Badges created successfully');
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    },
  });

  const jsonMutation = useMutation({
    mutationFn: createMultipleBadges,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Badges created successfully');
        queryClient.invalidateQueries({ queryKey: ['badges'] });
        handleClose();
      } else {
        toast.error(response.message || 'Failed to create badges');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    },
  });

  const handleFormSubmit = (data: BadgeFormData) => {
    mutation.mutate(data);
  };

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      let payload: any[] = [];
      
      if (Array.isArray(parsed)) {
        payload = parsed.map(item => {
          if (typeof item === 'string') return { name: item };
          if (item && item.name) return { name: item.name, icon_url: item.icon_url || null };
          throw new Error('Invalid format. Array items must be strings or objects with a "name" property.');
        });
      } else if (parsed && Array.isArray(parsed.badges)) {
        payload = parsed.badges;
      } else {
        throw new Error('JSON must be an array or an object containing a "badges" array.');
      }
      
      if (payload.length === 0) throw new Error('No items found');
      
      jsonMutation.mutate({ badges: payload });
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
    setIconStates([{ mode: 'file', file: null, url: '', previewUrl: null }]);
    onClose();
  };

  const isPending = mutation.isPending || jsonMutation.isPending;

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
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Create Badges</h2>
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
                  type="button"
                  onClick={() => setInputMode('form')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    inputMode === 'form' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ListPlus size={16} />
                  Form View
                </button>
                <button
                  type="button"
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
              <form id="badge-form" onSubmit={submitHandler} className="space-y-4">
                {inputMode === 'json' ? (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Paste JSON Data</label>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder={`[
  { "name": "Best Seller", "icon_url": "https://example.com/icon.png" },
  { "name": "Vegan" }
]
// or simply:
["Best Seller", "Vegan"]`}
                      rows={10}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 focus:border-[#7a9e8e] transition font-mono text-sm resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      Supports arrays of strings <code>["A", "B"]</code> or objects <code>[{`{"name": "A", "icon_url": "..."}`}]</code>.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      {fields.map((field, index) => {
                        const iconState = iconStates[index] || { mode: 'file', file: null, url: '', previewUrl: null };
                        return (
                          <div key={field.id} className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl space-y-3">
                            <div className="flex gap-2 items-start">
                              <div className="flex-1 space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Badge Name {index + 1}</label>
                                <input
                                  {...register(`badges.${index}.name` as const)}
                                  placeholder="e.g. Best Seller"
                                  className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition ${
                                    errors.badges?.[index]?.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#7a9e8e]'
                                  }`}
                                />
                                {errors.badges?.[index]?.name && (
                                  <p className="text-xs text-red-500 mt-1">{errors.badges[index]?.name?.message}</p>
                                )}
                              </div>
                              
                              {fields.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemove(index)}
                                  className="mt-[26px] p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                                >
                                  <Trash2 size={20} />
                                </button>
                              )}
                            </div>

                            {/* Icon Mode Switcher */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Icon (Optional)</label>
                              <div className="flex bg-gray-100 p-0.5 rounded-lg">
                                <button
                                  type="button"
                                  onClick={() => updateIconState(index, { mode: 'file' })}
                                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                                    iconState.mode === 'file' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
                                  }`}
                                >
                                  <FileImage size={12} />
                                  File
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateIconState(index, { mode: 'url' })}
                                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                                    iconState.mode === 'url' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
                                  }`}
                                >
                                  <Link size={12} />
                                  URL
                                </button>
                              </div>

                              {iconState.mode === 'file' ? (
                                <>
                                  {iconState.previewUrl ? (
                                    <div className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-gray-200">
                                      <img 
                                        src={iconState.previewUrl} 
                                        alt="Preview" 
                                        className="w-10 h-10 object-contain rounded-md bg-gray-50 border border-gray-100 p-0.5"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-700 truncate">{iconState.file?.name}</p>
                                        <p className="text-xs text-gray-400">{iconState.file ? `${(iconState.file.size / 1024).toFixed(1)} KB` : ''}</p>
                                      </div>
                                      <div className="flex gap-1">
                                        <button
                                          type="button"
                                          onClick={() => fileInputRefs.current[index]?.click()}
                                          className="p-1.5 text-gray-400 hover:text-[#7a9e8e] rounded-md transition cursor-pointer"
                                        >
                                          <Upload size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveIcon(index)}
                                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-md transition cursor-pointer"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => fileInputRefs.current[index]?.click()}
                                      className="w-full flex items-center gap-3 p-3 border border-dashed border-gray-200 rounded-lg hover:border-[#7a9e8e] hover:bg-[#7a9e8e]/5 transition cursor-pointer group"
                                    >
                                      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#7a9e8e]/10 flex items-center justify-center transition">
                                        <ImageIcon size={14} className="text-gray-400 group-hover:text-[#7a9e8e] transition" />
                                      </div>
                                      <div className="text-left">
                                        <p className="text-xs font-medium text-gray-600">Upload icon</p>
                                        <p className="text-xs text-gray-400">PNG, JPG, SVG up to 5MB</p>
                                      </div>
                                    </button>
                                  )}
                                  <input
                                    ref={el => { fileInputRefs.current[index] = el; }}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(index, e)}
                                    className="hidden"
                                  />
                                </>
                              ) : (
                                <div className="space-y-2">
                                  <input
                                    value={iconState.url}
                                    onChange={(e) => updateIconState(index, { url: e.target.value, previewUrl: e.target.value || null })}
                                    placeholder="https://example.com/icon.png"
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 focus:border-[#7a9e8e] transition text-sm"
                                  />
                                  {iconState.url && (
                                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                                      <img 
                                        src={iconState.url} 
                                        alt="Preview" 
                                        className="w-8 h-8 object-contain rounded-md bg-gray-50 p-0.5"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block'; }}
                                      />
                                      <p className="text-xs text-gray-500 truncate flex-1">{iconState.url}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleAppend}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-[#7a9e8e] text-[#7a9e8e] font-semibold rounded-xl hover:bg-[#7a9e8e]/5 transition cursor-pointer"
                    >
                      <Plus size={18} />
                      Add Another Badge
                    </button>
                    {errors.badges && !Array.isArray(errors.badges) && (
                      <p className="text-xs text-red-500 mt-1">{errors.badges.message}</p>
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
                form="badge-form"
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-[#7a9e8e] text-white font-semibold rounded-xl hover:bg-[#5a7a6b] transition flex items-center justify-center gap-2 shadow-lg shadow-[#7a9e8e]/20 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  `Create ${fields.length > 1 ? 'Badges' : 'Badge'}`
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
