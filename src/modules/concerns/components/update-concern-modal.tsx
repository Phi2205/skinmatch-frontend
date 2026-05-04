'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateConcern } from '../services/concern.service';
import { Concern } from '../types/concern.type';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const concernSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
});

type ConcernFormData = zod.infer<typeof concernSchema>;

interface UpdateConcernModalProps {
  isOpen: boolean;
  onClose: () => void;
  concern: Concern | null;
}

export function UpdateConcernModal({ isOpen, onClose, concern }: UpdateConcernModalProps) {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ConcernFormData>({
    resolver: zodResolver(concernSchema),
  });

  useEffect(() => {
    if (concern) {
      reset({
        name: concern.name,
      });
    }
  }, [concern, reset]);

  const mutation = useMutation({
    mutationFn: (data: ConcernFormData) => {
      if (!concern) throw new Error('No concern selected');
      return updateConcern(concern.id, data);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Concern updated successfully');
        queryClient.invalidateQueries({ queryKey: ['concerns'] });
        onClose();
      } else {
        toast.error(response.message || 'Failed to update concern');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    },
  });

  const onSubmit = (data: ConcernFormData) => {
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
              <h2 className="text-xl font-bold text-gray-900">Update Concern</h2>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Concern Name</label>
                <input
                  {...register('name')}
                  placeholder="e.g. Mụn, Nám, Tàn nhang"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition ${
                    errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#7a9e8e]'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
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
                    'Update Concern'
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
