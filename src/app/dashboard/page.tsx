'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/modules/orders/hooks/use-orders';

import { ChevronLeft } from 'lucide-react';
import { Sidebar } from '@/modules/dashboard/components/sidebar';
import { ProfileTab } from '@/modules/dashboard/components/profile-tab';
import { OrdersTab } from '@/modules/orders/components/orders-tab';
import { WishlistTab } from '@/modules/dashboard/components/wishlist-tab';
import { SettingsTab } from '@/modules/dashboard/components/settings-tab';
import { useAuth } from '@/contexts/authContext';

interface UserData {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileView, setMobileView] = useState<'menu' | 'content'>('menu');
  const [loading, setLoading] = useState(true);
  const { orders, meta, isLoading, error, fetchOrders } = useOrders();
  const [ordersPage, setOrdersPage] = useState(1);

  // Sync tab with pathname on mount/load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.includes('/dashboard/order')) {
        setActiveTab('orders');
      } else if (pathname.includes('/dashboard/wishlist')) {
        setActiveTab('wishlist');
      } else if (pathname.includes('/dashboard/settings')) {
        setActiveTab('settings');
      } else {
        setActiveTab('profile');
      }
    }
  }, []);

  // Update pathname when activeTab changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      let targetPath = '/dashboard';
      if (activeTab === 'orders') {
        targetPath = '/dashboard/order';
      } else if (activeTab === 'wishlist' || activeTab === 'settings') {
        targetPath = `/dashboard/${activeTab}`;
      }

      if (currentPath !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders(ordersPage, 5);
    }
  }, [activeTab, ordersPage, fetchOrders, user]);

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
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-28">
          <p>Đang tải...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 md:pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className={`lg:col-span-1 ${mobileView === 'content' ? 'hidden lg:block' : 'block'}`}>
            <Sidebar
              user={user}
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileView('content');
              }}
              onLogout={handleLogout}
            />
          </div>

          {/* Main Content */}
          <div className={`lg:col-span-3 ${mobileView === 'menu' ? 'hidden lg:block' : 'block'}`}>
            <div className="lg:hidden mb-4">
              <button
                type="button"
                onClick={() => setMobileView('menu')}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#7a9e8e] py-2.5 px-4 bg-white rounded-xl border border-[#e8e5dd] shadow-sm hover:bg-gray-50 transition cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 text-[#7a9e8e]" />
                <span>Quay lại danh mục</span>
              </button>
            </div>

            {activeTab === 'profile' && <ProfileTab user={user} />}
            
            {activeTab === 'orders' && (
              <OrdersTab
                orders={orders}
                meta={meta}
                isLoading={isLoading}
                error={error}
                fetchOrders={fetchOrders}
                ordersPage={ordersPage}
                setOrdersPage={setOrdersPage}
              />
            )}

            {/* {activeTab === 'wishlist' && <WishlistTab />} */}

            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}