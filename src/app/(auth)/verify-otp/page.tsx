'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { verifyOtp } from '@/modules/auth/services/auth.service';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyOtp({ email, otp: otpValue });
      
      if (!response.success) {
        setError(response.message || 'Invalid verification code');
        setLoading(false);
        return;
      }
      
      // Show success state
      setIsSuccess(true);
      setLoading(false);

      // Wait 1 second then redirect to login
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid verification code');
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    // Add resend logic here
    console.log('Resending OTP to:', email);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Back Link */}
            <Link href="/register" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#7a9e8e] mb-8 transition">
              <ArrowLeft size={16} />
              Back to registration
            </Link>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#7a9e8e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-[#7a9e8e]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
              <p className="text-gray-600">
                We've sent a 6-digit verification code to <br />
                <span className="font-semibold text-gray-900">{email || 'your email'}</span>
              </p>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center animate-in fade-in zoom-in duration-300">
                <p className="text-sm text-green-700 font-semibold flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                  Verification successful! Redirecting...
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border border-gray-200 rounded-xl focus:border-[#7a9e8e] focus:ring-4 focus:ring-[#7a9e8e]/10 outline-none transition"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || isSuccess || otp.join('').length < 6}
                className="w-full py-3 bg-[#7a9e8e] text-white font-semibold rounded-xl hover:bg-[#5a7a6b] transition shadow-lg shadow-[#7a9e8e]/20 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : isSuccess ? 'Verified!' : 'Verify Account'}
              </button>
            </form>

            {/* Resend Logic */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                {resendTimer > 0 ? (
                  <span className="text-gray-400 font-medium">Wait {resendTimer}s</span>
                ) : (
                  <button 
                    onClick={handleResend}
                    className="text-[#7a9e8e] font-bold hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
