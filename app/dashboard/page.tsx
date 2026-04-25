'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Package, Heart, Settings } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      setLoading(false);
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('user');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-[#e8e5dd]">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b border-[#e8e5dd]">
                <div className="w-16 h-16 bg-[#7a9e8e] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'profile'
                      ? 'bg-[#f5f2ed] text-[#7a9e8e] font-semibold'
                      : 'text-gray-700 hover:bg-[#f5f2ed]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'orders'
                      ? 'bg-[#f5f2ed] text-[#7a9e8e] font-semibold'
                      : 'text-gray-700 hover:bg-[#f5f2ed]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5" />
                    <span>Orders</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'wishlist'
                      ? 'bg-[#f5f2ed] text-[#7a9e8e] font-semibold'
                      : 'text-gray-700 hover:bg-[#f5f2ed]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5" />
                    <span>Wishlist</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'settings'
                      ? 'bg-[#f5f2ed] text-[#7a9e8e] font-semibold'
                      : 'text-gray-700 hover:bg-[#f5f2ed]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </div>
                </button>
              </nav>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full mt-6 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-semibold flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg p-8 border border-[#e8e5dd]">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Information
                </h2>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Your phone number"
                      className="w-full px-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg p-8 border border-[#e8e5dd]">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order History
                </h2>
                <p className="text-gray-600">
                  You haven&apos;t placed any orders yet.
                </p>
                <Link
                  href="/products"
                  className="inline-block mt-4 px-6 py-2 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition"
                >
                  Start Shopping
                </Link>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg p-8 border border-[#e8e5dd]">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  My Wishlist
                </h2>
                <p className="text-gray-600">
                  Your wishlist is empty. Add your favorite products!
                </p>
                <Link
                  href="/products"
                  className="inline-block mt-4 px-6 py-2 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition"
                >
                  Browse Products
                </Link>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg p-8 border border-[#e8e5dd]">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Settings
                </h2>

                <div className="space-y-6">
                  {/* Notifications */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Email Preferences
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">
                          Order updates
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">
                          Product recommendations
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">
                          Promotional offers
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Skin Profile */}
                  <div className="pt-6 border-t border-[#e8e5dd]">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Skin Profile
                    </h3>
                    <Link
                      href="/onboarding/skin-profile"
                      className="inline-block px-6 py-2 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition"
                    >
                      Update Skin Profile
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
