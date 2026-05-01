'use client';
 
import Link from 'next/link';
import { ShoppingBag, Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useCart } from '@/modules/cart/hooks/useCart';

import { GlassCard } from './ui/glass-container';
import { DarkGlassCard } from './ui/dark-glass-card';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center">
      <GlassCard className="w-full max-w-6xl rounded-full px-6 py-2" variant="none">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <X className="w-6 h-6 text-[#9eb57a] rotate-45" />
            <span className="text-2xl font-semibold text-[#4a4a4a] tracking-tight">Liora</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link href="/" className="text-sm font-bold text-gray-900 border-b-2 border-[#9eb57a] pb-0.5">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
              Shop
            </Link>
            <Link href="#services" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
              Services
            </Link>
            <Link href="#about" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
              About us
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1">
            {/* Cart Button */}
            <Link 
              href="/cart" 
              className="flex items-center gap-3 bg-white hover:bg-gray-50 transition rounded-full pl-4 pr-1 py-1 shadow-sm border border-gray-100"
            >
              <span className="text-[10px] font-bold tracking-widest text-[#4a4a4a]">CART({itemCount})</span>
              <div className="bg-[#9eb57a] p-2 rounded-full shadow-inner">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
            </Link>

            {/* User Profile */}
            <div className="relative group ml-1">
              {user ? (
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full bg-[#7a9e8e] flex items-center justify-center text-white font-bold shadow-sm border-2 border-white hover:scale-105 transition">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                    <DarkGlassCard 
                      className="w-60 overflow-hidden !rounded-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                      variant="none"
                      opacity={0.85}
                      blur={25}
                    >
                      <div className="px-6 py-5 border-b border-white/10 bg-white/5">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      
                      <div className="py-2">
                        {user.role === 'ADMIN' && (
                          <Link href="/admin/dashboard" className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                            <LayoutDashboard size={18} className="text-[#9eb57a]" />
                            Admin Panel
                          </Link>
                        )}
                        
                        <Link href="/account" className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                          <UserIcon size={18} className="text-[#9eb57a]" />
                          My Profile
                        </Link>
                        
                        <div className="px-4 pt-2 mt-2 border-t border-white/10">
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all text-left"
                          >
                            <LogOut size={18} />
                            Log out
                          </button>
                        </div>
                      </div>
                    </DarkGlassCard>
                  </div>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition"
                >
                  <UserIcon size={20} />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100 mt-2 flex flex-col gap-4 items-center">
            <Link href="/" className="text-sm font-bold text-gray-900" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-gray-500" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
            <Link href="#services" className="text-sm font-medium text-gray-500" onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            <Link href="#about" className="text-sm font-medium text-gray-500" onClick={() => setMobileMenuOpen(false)}>
              About us
            </Link>
          </nav>
        )}
      </GlassCard>
    </div>
  );
}

