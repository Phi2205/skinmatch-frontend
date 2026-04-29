'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { X, Loader2, Upload, ImageIcon, Trash2, Link, FileImage } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBadge } from '../services/badge.service';
import { Badge } from '../types/badge.type';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const badgeSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
});

type BadgeFormData = zod.infer<typeof badgeSchema>;

interface UpdateBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge | null;
}

export function UpdateBadgeModal({ isOpen, onClose, badge }: UpdateBadgeModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [iconMode, setIconMode] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [iconUrlInput, setIconUrlInput] = useState('');
  const [removeIcon, setRemoveIcon] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<BadgeFormData>({
    resolver: zodResolver(badgeSchema),
  });

  useEffect(() => {
    if (badge) {
      reset({ name: badge.name });
      setPreviewUrl(badge.icon_url || null);
      setIconUrlInput(badge.icon_url || '');
      setSelectedFile(null);
      setRemoveIcon(false);
      setIconMode('file');
    }
  }, [badge, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRemoveIcon(false);
    }
  };

  const handleRemoveIcon = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIconUrlInput('');
    setRemoveIcon(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleModeSwitch = (mode: 'file' | 'url') => {
    setIconMode(mode);
    if (mode === 'url') {
      // Switching to URL mode: clear file selection, keep URL
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (!iconUrlInput && badge?.icon_url) {
        setIconUrlInput(badge.icon_url);
      }
      setPreviewUrl(iconUrlInput || badge?.icon_url || null);
    } else {
      // Switching to file mode: clear URL input
      setIconUrlInput('');
    }
    setRemoveIcon(false);
  };

  const mutation = useMutation({
    mutationFn: (data: BadgeFormData) => {
      if (!badge) throw new Error('No badge selected');
      
      const formData = new FormData();
      formData.append('name', data.name);
      
      if (iconMode === 'file') {
        if (selectedFile) {
          formData.append('icon', selectedFile);
        } else if (removeIcon) {
          formData.append('icon_url', '');
        }
      } else {
        // URL mode
        if (iconUrlInput.trim()) {
          formData.append('icon_url', iconUrlInput.trim());
        } else if (removeIcon) {
          formData.append('icon_url', '');
        }
      }
      
      return updateBadge(badge.id, formData);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Badge updated successfully');
        queryClient.invalidateQueries({ queryKey: ['badges'] });
        onClose();
      } else {
        toast.error(response.message || 'Failed to update badge');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    },
  });

  const onSubmit = (data: BadgeFormData) => {
    mutation.mutate(data);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Update Badge</h2>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Badge Name</label>
                <input
                  {...register('name')}
                  placeholder="e.g. Best Seller, Vegan"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition ${
                    errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#7a9e8e]'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Badge Icon</label>
                
                {/* Mode Switcher */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('file')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      iconMode === 'file' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FileImage size={14} />
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('url')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      iconMode === 'url' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Link size={14} />
                    Paste URL
                  </button>
                </div>

                {iconMode === 'file' ? (
                  <>
                    {previewUrl && !removeIcon ? (
                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <img 
                          src={previewUrl} 
                          alt="Badge icon preview" 
                          className="w-12 h-12 object-contain rounded-lg bg-white border border-gray-100 p-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {selectedFile ? selectedFile.name : 'Current icon'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-gray-400 hover:text-[#7a9e8e] hover:bg-[#7a9e8e]/10 rounded-lg transition cursor-pointer"
                            title="Change icon"
                          >
                            <Upload size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveIcon}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Remove icon"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#7a9e8e] hover:bg-[#7a9e8e]/5 transition cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#7a9e8e]/10 flex items-center justify-center transition">
                          <ImageIcon size={20} className="text-gray-400 group-hover:text-[#7a9e8e] transition" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">Click to upload icon</p>
                          <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, SVG up to 5MB</p>
                        </div>
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </>
                ) : (
                  <div className="space-y-2">
                    <input
                      value={iconUrlInput}
                      onChange={(e) => {
                        setIconUrlInput(e.target.value);
                        setPreviewUrl(e.target.value || null);
                        setRemoveIcon(!e.target.value);
                      }}
                      placeholder="https://example.com/icon.png"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 focus:border-[#7a9e8e] transition"
                    />
                    {iconUrlInput && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <img 
                          src={iconUrlInput} 
                          alt="Badge icon preview" 
                          className="w-10 h-10 object-contain rounded-lg bg-white border border-gray-100 p-1"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block'; }}
                        />
                        <p className="text-xs text-gray-500 truncate flex-1">{iconUrlInput}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-[#7a9e8e] text-white font-semibold rounded-xl hover:bg-[#5a7a6b] transition flex items-center justify-center gap-2 shadow-lg shadow-[#7a9e8e]/20 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Badge'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
