'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { updateUserProfile, uploadUserAvatar } from '@/modules/user/services/user.service';
import { Loader2, CheckCircle2, AlertCircle, Camera, User as UserIcon } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  role?: string;
  phone?: string;
  avatar_url?: string;
}

interface ProfileTabProps {
  user?: UserData;
}

export function ProfileTab({ user: propUser }: ProfileTabProps) {
  const { user: authUser, updateUser } = useAuth();
  const user = authUser || propUser;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync state on load or when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-white rounded-lg p-8 border border-[#e8e5dd] flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#7a9e8e]" />
      </div>
    );
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Limit 5MB
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Kích thước ảnh đại diện không vượt quá 5MB.' });
        return;
      }

      setIsUploadingAvatar(true);
      setMessage(null);

      try {
        const response = await uploadUserAvatar(file);
        if (response.success && response.data) {
          updateUser(response.data);
          setMessage({ type: 'success', text: 'Cập nhật ảnh đại diện thành công!' });
        } else {
          setMessage({ type: 'error', text: response.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện.' });
        }
      } catch (err: any) {
        console.error('Failed to upload avatar:', err);
        setMessage({
          type: 'error',
          text: err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện. Vui lòng thử lại.',
        });
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Validation
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập họ và tên.' });
      setIsSubmitting(false);
      return;
    }
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập địa chỉ email.' });
      setIsSubmitting(false);
      return;
    }

    // Regex match Vietnamese phone if filled
    if (phone.trim() && !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone.trim())) {
      setMessage({ type: 'error', text: 'Số điện thoại không hợp lệ (Ví dụ: 0987654321).' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await updateUserProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });

      if (response.success && response.data) {
        // Update user context state & local storage
        updateUser(response.data);
        setMessage({ type: 'success', text: 'Cập nhật thông tin tài khoản thành công!' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Có lỗi xảy ra khi lưu thay đổi.' });
      }
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Có lỗi xảy ra khi lưu thay đổi. Vui lòng thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 lg:p-8 border border-[#e8e5dd]">
      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
        Thông tin tài khoản
      </h2>

      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-2 lg:gap-3 mb-6 lg:mb-8 pb-4 lg:pb-6 border-b border-[#e8e5dd]">
        <div className="relative group w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-[#7a9e8e]/30 shadow-md flex-shrink-0">
          {isUploadingAvatar ? (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white z-10">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : null}

          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#7a9e8e]/10 flex items-center justify-center text-[#7a9e8e]">
              <UserIcon className="w-10 h-10" />
            </div>
          )}

          {/* Upload overlay hover trigger */}
          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1 text-[10px] font-bold cursor-pointer select-none">
            <Camera className="w-5 h-5 text-white" />
            Thay đổi
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={isUploadingAvatar}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-xs text-gray-500 font-medium">Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa 5MB)</p>
      </div>

      {message && (
        <div
          className={`p-4 mb-6 rounded-xl border flex items-start gap-3 transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
              : 'bg-rose-50 text-rose-800 border-rose-100'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Họ và tên
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] disabled:opacity-60 disabled:bg-gray-50"
            placeholder="Nhập họ và tên của bạn"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Địa chỉ Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] disabled:opacity-60 disabled:bg-gray-50"
            placeholder="example@domain.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isSubmitting}
            placeholder="Nhập số điện thoại của bạn (ví dụ: 0987654321)"
            className="w-full px-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] disabled:opacity-60 disabled:bg-gray-50"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#7a9e8e] text-white font-bold rounded-lg hover:bg-[#5a7a6b] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

