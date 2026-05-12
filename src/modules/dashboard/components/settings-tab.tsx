'use client';

import { useState } from 'react';
import Link from 'next/link';
import { updatePassword } from '@/modules/auth/services/auth.service';
import { Loader2, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export function SettingsTab() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validations
    if (!oldPassword.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập mật khẩu cũ.' });
      return;
    }
    if (!newPassword.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập mật khẩu mới.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải dài tối thiểu 6 ký tự.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Xác nhận mật khẩu không trùng khớp.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updatePassword({
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
        // Clear inputs on success
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: response.message || 'Có lỗi xảy ra khi đổi mật khẩu.' });
      }
    } catch (err: any) {
      console.error('Password change failed:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 border border-[#e8e5dd]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Cài đặt tài khoản
      </h2>

      <div className="space-y-8">
        {/* Notifications */}
        {/* <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            Tùy chọn nhận thông báo
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-gray-700">
                Cập nhật thông tin đơn hàng
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-gray-700">
                Gợi ý sản phẩm phù hợp với da
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-gray-700">
                Chương trình khuyến mãi và ưu đãi đặc biệt
              </span>
            </label>
          </div>
        </div> */}

        {/* Skin Profile */}
        {/* <div className="pt-6 border-t border-[#e8e5dd]">
          <h3 className="font-semibold text-gray-900 mb-4">
            Hồ sơ làn da của bạn (Skin Profile)
          </h3>
          <p className="text-sm text-gray-500 mb-4">Cập nhật đặc tính làn da của bạn để chatbot đưa ra gợi ý sản phẩm phù hợp nhất.</p>
          <Link
            href="/onboarding/skin-profile"
            className="inline-block px-6 py-2 bg-[#7a9e8e] text-[#ffffff] font-semibold rounded-lg hover:bg-[#5a7a6b] transition cursor-pointer"
          >
            Cập nhật Skin Profile
          </Link>
        </div> */}

        {/* Change Password */}
        <div className="pt-6 border-t border-[#e8e5dd]">
          <div className="flex items-center gap-2.5 mb-4">
            <KeyRound className="w-5 h-5 text-[#7a9e8e]" />
            <h3 className="font-semibold text-gray-900">
              Đổi mật khẩu tài khoản
            </h3>
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

          <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] disabled:opacity-60"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] disabled:opacity-60"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] disabled:opacity-60"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#7a9e8e] text-white font-bold rounded-lg hover:bg-[#5a7a6b] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  'Đổi mật khẩu'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

