'use client';

import { useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { axiosInstance } from '@/services/axiosInstance';
import { toast } from 'sonner';

function AuthSuccessHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUser } = useAuth();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const handleSuccess = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        if (response && response.data?.success && response.data?.data) {
          const userData = response.data.data;
          updateUser(userData);
          toast.success('Đăng nhập bằng Google thành công!');
          
          if (userData.role === 'ADMIN') {
            router.replace('/admin/dashboard');
          } else {
            router.replace('/');
          }
        } else {
          throw new Error('Không thể đồng bộ thông tin tài khoản');
        }
      } catch (error) {
        console.error('Lỗi đăng nhập Google:', error);
        toast.error('Đăng nhập bằng Google thất bại. Vui lòng thử lại!');
        router.replace('/login');
      }
    };

    handleSuccess();
  }, [router, updateUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7a9e8e]"></div>
        <p className="text-gray-600 font-medium">Đang hoàn tất đăng nhập bằng Google...</p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7a9e8e]"></div>
          <p className="text-gray-600 font-medium">Đang tải...</p>
        </div>
      </div>
    }>
      <AuthSuccessHandler />
    </Suspense>
  );
}
