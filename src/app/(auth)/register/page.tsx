'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Check, X } from 'lucide-react';
import { register } from '@/modules/auth/services/auth.service';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password validation
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const passwordValid = Object.values(passwordRequirements).every((req) => req);
  const passwordMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (!passwordMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await register({ email, password, name });

      if (!response.success) {
        setError(response.message || 'Registration failed');
        setLoading(false);
        return;
      }

      
      // Set cookies for middleware
      // document.cookie = `user_id=${response.data.user.id}; path=/; max-age=86400; SameSite=Lax`;
      // document.cookie = `user_role=${response.data.user.role}; path=/; max-age=86400; SameSite=Lax`;

      // Redirect to verification screen
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* <Header /> */}

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Join Silvor Care
              </h1>
              <p className="text-gray-600">
                Create your account for personalized skincare
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]"
                    required
                  />
                </div>

                {/* Password Requirements */}
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {passwordRequirements.length ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={passwordRequirements.length ? 'text-green-700' : 'text-gray-600'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRequirements.uppercase ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={passwordRequirements.uppercase ? 'text-green-700' : 'text-gray-600'}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRequirements.number ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={passwordRequirements.number ? 'text-green-700' : 'text-gray-600'}>
                      One number
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      confirmPassword
                        ? passwordMatch
                          ? 'border-green-300 focus:ring-green-500'
                          : 'border-red-300 focus:ring-red-500'
                        : 'border-[#e8e5dd] focus:ring-[#7a9e8e]'
                    }`}
                    required
                  />
                  {confirmPassword && (
                    <div className="absolute right-3 top-3">
                      {passwordMatch ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded mt-1" required />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="#" className="text-[#7a9e8e] hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-[#7a9e8e] hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !passwordValid || !passwordMatch}
                className="w-full py-2 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[#7a9e8e] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

