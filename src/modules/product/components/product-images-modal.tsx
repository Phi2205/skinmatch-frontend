'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Loader2, 
  Upload, 
  Link as LinkIcon, 
  Trash2,
  Plus,
  ImageIcon,
  FileImage,
  ExternalLink,
  Undo2,
  CheckCircle2,
  Star
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  addSingleProductImage, 
  updateProductImage, 
  deleteProductImage,
  reorderProductImages
} from '../services/product.service';
import { Product } from '../types/product.type';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

type ImageItem = {
  id: string | number; // number if from DB, string if local temporary
  image_url: string;
  is_main: boolean;
  position: number;
  type: 'FILE' | 'URL';
  file?: File;
  isPending?: boolean;
};

export function ProductImagesModal({ isOpen, onClose, product }: ProductImagesModalProps) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<ImageItem[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const wasOpen = useRef(false);
  const pendingActions = useRef<Record<string, { timeout: NodeJS.Timeout, originalItems: ImageItem[] }>>({});

  useEffect(() => {
    if (product && isOpen) {
      // Map existing images from product
      const existingImages: ImageItem[] = (product.images || []).map((img): ImageItem => ({
        id: img.id,
        image_url: img.image_url,
        is_main: img.is_main,
        position: img.position,
        type: 'URL'
      })).sort((a, b) => a.position - b.position);
      
      setItems(existingImages);
    }
  }, [product, isOpen]);

  // Invalidate cache when modal closes for any reason
  useEffect(() => {
    if (!isOpen && wasOpen.current) {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
    wasOpen.current = isOpen;
  }, [isOpen, queryClient]);

  const scheduleAction = (actionId: string, updatedItems: ImageItem[], apiCall: () => Promise<any>) => {
    // Save current state for undo
    const originalItems = [...items];
    
    // 1. Update UI immediately (Optimistic)
    setItems(updatedItems);

    // 2. Clear any existing timeout for this specific action type if needed (optional)
    if (pendingActions.current[actionId]) {
      clearTimeout(pendingActions.current[actionId].timeout);
    }

    // 3. Set timeout for API call (3 seconds)
    const timeout = setTimeout(async () => {
      try {
        await apiCall();
        delete pendingActions.current[actionId];
        queryClient.invalidateQueries({ queryKey: ['products'] });
      } catch (error) {
        toast.error('Failed to sync changes with server');
        setItems(originalItems); // Rollback on error
      }
    }, 3000);

    pendingActions.current[actionId] = { timeout, originalItems };

    // 4. Show toast with Undo
    toast.info('Changes will be saved in 3 seconds', {
      id: actionId,
      action: {
        label: 'Undo',
        onClick: () => {
          clearTimeout(timeout);
          setItems(originalItems);
          delete pendingActions.current[actionId];
          toast.success('Action undone', { id: `${actionId}-undone` });
        }
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const tempId = `temp-${Math.random().toString(36).substr(2, 9)}`;
      const preview = URL.createObjectURL(file);
      
      const newItem: ImageItem = {
        id: tempId,
        image_url: preview,
        is_main: items.length === 0,
        position: items.length,
        type: 'FILE',
        file
      };

      const newItems = [...items, newItem];
      
      scheduleAction(tempId, newItems, async () => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('position', newItem.position.toString());
        formData.append('is_main', newItem.is_main.toString());
        return addSingleProductImage(product!.id, formData);
      });
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const tempId = `temp-${Math.random().toString(36).substr(2, 9)}`;
    
    const newItem: ImageItem = {
      id: tempId,
      image_url: urlInput,
      is_main: items.length === 0,
      position: items.length,
      type: 'URL'
    };

    const newItems = [...items, newItem];
    setUrlInput('');
    setIsAddingUrl(false);

    scheduleAction(tempId, newItems, async () => {
      const formData = new FormData();
      formData.append('image_url', newItem.image_url);
      formData.append('position', newItem.position.toString());
      formData.append('is_main', newItem.is_main.toString());
      return addSingleProductImage(product!.id, formData);
    });
  };

  const removeItem = (id: string | number) => {
    const itemToDelete = items.find(i => i.id === id);
    if (!itemToDelete) return;

    const actionId = `delete-${id}`;
    const newItems = items.filter(item => item.id !== id);

    scheduleAction(actionId, newItems, async () => {
      if (typeof id === 'number') {
        return deleteProductImage(product!.id, id);
      }
      return Promise.resolve(); // If it was a temp item, it's already "deleted" locally
    });
  };

  const setMainImage = (id: string | number) => {
    const actionId = `main-${id}`;
    const newItems = items.map(item => ({
      ...item,
      is_main: item.id === id,
      position: item.id === id ? 0 : (item.position >= (items.find(i => i.id === id)?.position || 0) ? item.position : item.position + 1)
    })).sort((a, b) => a.position - b.position);

    scheduleAction(actionId, newItems, async () => {
      if (typeof id === 'number') {
        const formData = new FormData();
        formData.append('is_main', 'true');
        formData.append('position', '0');
        return updateProductImage(product!.id, id, formData);
      }
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const item = items[index];
    const actionId = `move-${item.id}-${Date.now()}`;
    
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    
    const finalItems = newItems.map((it, idx) => ({ ...it, position: idx }));

    scheduleAction(actionId, finalItems, async () => {
      const orders = finalItems
        .filter(it => typeof it.id === 'number')
        .map(it => ({ id: it.id as number, position: it.position }));
      return reorderProductImages(product!.id, orders);
    });
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const item = items[index];
    const actionId = `move-${item.id}-${Date.now()}`;

    const newItems = [...items];
    [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    
    const finalItems = newItems.map((it, idx) => ({ ...it, position: idx }));

    scheduleAction(actionId, finalItems, async () => {
      const orders = finalItems
        .filter(it => typeof it.id === 'number')
        .map(it => ({ id: it.id as number, position: it.position }));
      return reorderProductImages(product!.id, orders);
    });
  };

  const handleClose = () => {
    onClose();
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#7a9e8e]/10 rounded-2xl flex items-center justify-center">
                  <ImageIcon className="text-[#7a9e8e]" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Product Gallery</h2>
                  <p className="text-sm text-gray-500 font-medium">Managing images for <span className="text-[#7a9e8e] font-bold">{product.name}</span></p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50">
              {/* Add Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-200 rounded-[24px] hover:border-[#7a9e8e] hover:bg-[#7a9e8e]/5 transition-all group cursor-pointer shadow-sm bg-white"
                >
                  <div className="w-10 h-10 bg-[#7a9e8e]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload size={20} className="text-[#7a9e8e]" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Upload Photos</span>
                </button>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />

                <button 
                  onClick={() => setIsAddingUrl(!isAddingUrl)}
                  className={`flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed rounded-[24px] transition-all group cursor-pointer shadow-sm bg-white ${isAddingUrl ? 'border-[#7a9e8e] bg-[#7a9e8e]/5' : 'border-gray-200 hover:border-[#7a9e8e] hover:bg-[#7a9e8e]/5'}`}
                >
                  <div className="w-10 h-10 bg-[#7a9e8e]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LinkIcon size={20} className="text-[#7a9e8e]" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Add from URL</span>
                </button>
              </div>

              {/* URL Input Area */}
              <AnimatePresence>
                {isAddingUrl && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white border border-[#7a9e8e]/20 rounded-2xl flex gap-2 shadow-sm">
                      <input 
                        type="text" 
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Paste image URL here..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                      />
                      <button 
                        onClick={handleAddUrl}
                        className="px-6 py-2 bg-[#7a9e8e] text-white text-xs font-bold rounded-xl hover:bg-[#5a7a6b] transition-colors"
                      >
                        Add Image
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Gallery Queue ({items.length})</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                    <CheckCircle2 size={12} className="text-[#7a9e8e]" />
                    Auto-saving enabled
                  </div>
                </div>

                <div className="grid gap-3">
                  {items.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[32px] bg-white/50">
                      <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-sm text-gray-400 font-bold">Your gallery is empty</p>
                      <p className="text-xs text-gray-300 mt-1">Upload images to showcase this product</p>
                    </div>
                  ) : (
                    items.map((item, index) => (
                      <motion.div 
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-4 p-4 bg-white border rounded-[24px] shadow-sm group transition-all ${item.is_main ? 'border-[#7a9e8e] ring-2 ring-[#7a9e8e]/5' : 'border-gray-100 hover:border-[#7a9e8e]/30'}`}
                      >
                        {/* Position & Order Controls */}
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${item.is_main ? 'bg-[#7a9e8e] text-white' : 'bg-gray-50 text-gray-400'}`}>
                            {index + 1}
                          </div>
                          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              type="button"
                              onClick={() => moveUp(index)}
                              disabled={index === 0}
                              className="p-1 text-gray-300 hover:text-[#7a9e8e] disabled:opacity-0 transition-colors"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                            </button>
                            <button 
                              type="button"
                              onClick={() => moveDown(index)}
                              disabled={index === items.length - 1}
                              className="p-1 text-gray-300 hover:text-[#7a9e8e] disabled:opacity-0 transition-colors"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                          </div>
                        </div>
                        
                        {/* Preview */}
                        <div className="w-20 h-20 rounded-[20px] overflow-hidden bg-gray-50 border border-gray-100 relative shadow-inner">
                          <img src={item.image_url} alt="Preview" className="w-full h-full object-cover" />
                          {item.type === 'URL' && !item.image_url.startsWith('blob:') && (
                            <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-sm">
                              <ExternalLink size={10} className="text-[#7a9e8e]" />
                            </div>
                          )}
                          {item.is_main && (
                            <div className="absolute bottom-0 left-0 right-0 bg-[#7a9e8e]/90 backdrop-blur-sm py-0.5 text-[8px] font-black text-white text-center uppercase tracking-widest">
                              Main
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-gray-900 truncate max-w-[150px]">
                              {item.type === 'FILE' ? item.file?.name : 'External Image'}
                            </p>
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${item.type === 'FILE' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                              {item.type}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <button 
                              onClick={() => setMainImage(item.id)}
                              disabled={item.is_main}
                              className={`text-[10px] font-bold flex items-center gap-1.5 transition-colors ${item.is_main ? 'text-[#7a9e8e]' : 'text-gray-400 hover:text-[#7a9e8e]'}`}
                            >
                              <Star size={12} fill={item.is_main ? 'currentColor' : 'none'} />
                              {item.is_main ? 'Primary Photo' : 'Set as Main'}
                            </button>
                          </div>
                        </div>

                        {/* Delete Action */}
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all cursor-pointer"
                        >
                          <Trash2 size={20} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between sticky bottom-0 z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                <p className="text-xs text-gray-500 font-medium">Changes are saved automatically.</p>
              </div>
              <button 
                onClick={handleClose}
                className="px-10 py-3 bg-gray-900 text-white font-bold rounded-[20px] hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
