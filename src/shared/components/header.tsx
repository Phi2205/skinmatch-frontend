'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Search, Home, Flame, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useCart } from '@/modules/cart/hooks/useCart';
import { useRouter, usePathname } from 'next/navigation';

import { GlassCard } from './ui/glass-container';
import { DarkGlassCard } from './ui/dark-glass-card';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const pathname = usePathname();
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

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* === MOBILE VIEW === */}
      
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[60] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center justify-between gap-2 px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div className="flex items-center shrink-0">
          <button className="p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
          
          <Link href="/" className="flex items-center gap-1 ml-1" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5 text-[#9eb57a] rotate-45" />
            <span className="text-lg font-bold text-[#4a4a4a] tracking-tight">Liora</span>
          </Link>
        </div>
        
        <form onSubmit={handleMobileSearch} className="flex-1 relative max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#7a9e8e]"
          />
        </form>
        
        <Link href={user ? "/dashboard" : "/login"} className="p-1 shrink-0">
          {user ? (
            <div className="w-7 h-7 rounded-full bg-[#7a9e8e] flex items-center justify-center text-white font-bold text-xs shadow-sm border border-white overflow-hidden">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
          ) : (
            <UserIcon className="w-6 h-6 text-gray-700" />
          )}
        </Link>
      </div>

      {/* Mobile Menu Left Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[65] flex animate-in fade-in duration-300">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content - Sliding from Left with Black Glassmorphism */}
          <div className="relative w-4/5 max-w-sm h-full bg-black/20 backdrop-blur-sm border-r border-white/10 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <span className="text-xl font-bold text-white tracking-tight">Liora</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
              <Link href="/" className="text-white/90 hover:text-[#9eb57a] text-lg font-semibold tracking-wide transition-colors" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link>
              <Link href="/products" className="text-white/90 hover:text-[#9eb57a] text-lg font-semibold tracking-wide transition-colors" onClick={() => setMobileMenuOpen(false)}>Sản phẩm</Link>
              <Link href="/flash-sales" className="text-white/90 hover:text-[#9eb57a] text-lg font-semibold tracking-wide transition-colors" onClick={() => setMobileMenuOpen(false)}>Flash Sale</Link>
              <Link href="/about" className="text-white/90 hover:text-[#9eb57a] text-lg font-semibold tracking-wide transition-colors" onClick={() => setMobileMenuOpen(false)}>Về chúng tôi</Link>
              
              {user && (
                <div className="mt-auto pt-6 border-t border-white/10 space-y-6">
                  {user.role === 'ADMIN' && (
                    <Link href="/admin/dashboard" className="flex items-center gap-3 text-white/90 hover:text-[#9eb57a] text-lg font-semibold transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      <LayoutDashboard size={20} className="text-[#9eb57a]" />
                      Quản trị viên
                    </Link>
                  )}
                  <Link href="/dashboard" className="flex items-center gap-3 text-white/90 hover:text-[#9eb57a] text-lg font-semibold transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    <UserIcon size={20} className="text-[#9eb57a]" />
                    Tài khoản của tôi
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 text-lg font-semibold transition-colors cursor-pointer">
                    <LogOut size={20} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center w-full px-2 py-1.5">
          <Link href="/" className={`flex flex-col items-center gap-1 w-[25%] ${pathname === '/' ? 'text-[#7a9e8e]' : 'text-gray-500 hover:text-[#7a9e8e]'}`}>
            <Home className={`w-6 h-6 ${pathname === '/' ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Trang chủ</span>
          </Link>
          
          <Link href="/products" className={`flex flex-col items-center gap-1 w-[25%] ${pathname.startsWith('/products') ? 'text-[#7a9e8e]' : 'text-gray-500 hover:text-[#7a9e8e]'}`}>
            <LayoutGrid className={`w-6 h-6 ${pathname.startsWith('/products') ? 'fill-current text-[#7a9e8e]' : ''}`} />
            <span className="text-[10px] font-medium">Danh mục</span>
          </Link>
          
          <Link href="/flash-sales" className={`flex flex-col items-center gap-1 w-[25%] ${pathname.startsWith('/flash-sales') ? 'text-[#7a9e8e]' : 'text-gray-500 hover:text-[#7a9e8e]'}`}>
            <Flame className={`w-6 h-6 ${pathname.startsWith('/flash-sales') ? 'fill-[#7a9e8e]' : ''}`} />
            <span className="text-[10px] font-medium">Sale</span>
          </Link>
          
          <Link href="/cart" className={`flex flex-col items-center gap-1 relative w-[25%] ${pathname === '/cart' ? 'text-[#7a9e8e]' : 'text-gray-500 hover:text-[#7a9e8e]'}`}>
            <div className="relative">
              <ShoppingBag className={`w-6 h-6 ${pathname === '/cart' ? 'fill-current text-[#7a9e8e]' : ''}`} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center border border-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Giỏ hàng</span>
          </Link>
        </div>
      </div>

      {/* === DESKTOP VIEW === */}
      <div className="hidden md:flex fixed top-4 left-0 right-0 z-50 px-4 justify-center">
        <GlassCard className="w-full max-w-6xl rounded-full px-6 py-2 flex items-center shadow-xl border-white/20" variant="none">
          <div className="flex justify-between items-center h-12 gap-4 w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0" onClick={() => setIsSearchOpen(false)}>
              <X className="w-6 h-6 text-[#9eb57a] rotate-45" />
              <span className="text-2xl font-semibold text-[#4a4a4a] tracking-tight">Liora</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              <Link href="/" className={`text-sm transition pb-0.5 ${pathname === '/' ? 'font-bold text-gray-900 border-b-2 border-[#9eb57a]' : 'font-medium text-gray-500 hover:text-gray-900'}`} onClick={() => setIsSearchOpen(false)}>Trang chủ</Link>
              <Link href="/products" className={`text-sm transition pb-0.5 ${pathname.startsWith('/products') ? 'font-bold text-gray-900 border-b-2 border-[#9eb57a]' : 'font-medium text-gray-500 hover:text-gray-900'}`} onClick={() => setIsSearchOpen(false)}>Sản phẩm</Link>
              <Link href="/flash-sales" className={`text-sm transition pb-0.5 ${pathname.startsWith('/flash-sales') ? 'font-bold text-gray-900 border-b-2 border-[#9eb57a]' : 'font-medium text-gray-500 hover:text-gray-900'}`} onClick={() => setIsSearchOpen(false)}>Flash Sale</Link>
              <Link href="/about" className={`text-sm transition pb-0.5 ${pathname === '/about' ? 'font-bold text-gray-900 border-b-2 border-[#9eb57a]' : 'font-medium text-gray-500 hover:text-gray-900'}`} onClick={() => setIsSearchOpen(false)}>Về chúng tôi</Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Desktop Sliding Search */}
              <div className="hidden md:flex items-center relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchTerm.trim()) {
                      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
                    }
                  }}
                  className={`relative flex items-center transition-all duration-300 ease-out bg-white border border-gray-100 shadow-sm rounded-full hover:bg-gray-50 ${
                    isSearchOpen ? 'w-56 lg:w-64 h-10 px-3.5' : 'w-10 h-10 justify-center cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!isSearchOpen) setIsSearchOpen(true);
                  }}
                >
                  <button
                    type={isSearchOpen ? 'submit' : 'button'}
                    className={`flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors shrink-0 ${isSearchOpen ? 'mr-2' : ''}`}
                    onClick={(e) => {
                      if (!isSearchOpen) {
                        e.preventDefault();
                        setIsSearchOpen(true);
                      } else if (!searchTerm.trim()) {
                        e.preventDefault();
                        setIsSearchOpen(false);
                      }
                    }}
                    title="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-300 ${isSearchOpen ? 'w-full opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
                    style={{ visibility: isSearchOpen ? 'visible' : 'hidden' }}
                    autoFocus={isSearchOpen}
                  />

                  {isSearchOpen && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (searchTerm) setSearchTerm('');
                        else setIsSearchOpen(false);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition ml-1 shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </div>

              {/* Cart Button */}
              <Link href="/cart" className="flex items-center gap-3 bg-white hover:bg-gray-50 transition rounded-full pl-4 pr-1 py-1 shadow-sm border border-gray-100">
                <span className="text-[10px] font-bold tracking-widest text-[#4a4a4a]">GIỎ HÀNG({itemCount})</span>
                <div className="bg-[#9eb57a] p-2 rounded-full shadow-inner">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
              </Link>

              {/* User Profile */}
              <div className="relative group ml-1">
                {user ? (
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full bg-[#7a9e8e] flex items-center justify-center text-white font-bold shadow-sm border-2 border-white hover:scale-105 transition overflow-hidden">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </button>

                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                      <DarkGlassCard className="w-60 overflow-hidden !rounded-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" variant="none" opacity={0.85} blur={25}>
                        <div className="px-6 py-5 border-b border-white/10 bg-white/5">
                          <p className="text-sm font-bold text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="py-2">
                          {user.role === 'ADMIN' && (
                            <Link href="/admin/dashboard" className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                              <LayoutDashboard size={18} className="text-[#9eb57a]" />
                              Quản trị viên
                            </Link>
                          )}
                          <Link href="/dashboard" className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                            <UserIcon size={18} className="text-[#9eb57a]" />
                            Tài khoản
                          </Link>
                          <div className="px-4 pt-2 mt-2 border-t border-white/10">
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all text-left">
                              <LogOut size={18} />
                              Đăng xuất
                            </button>
                          </div>
                        </div>
                      </DarkGlassCard>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition">
                    <UserIcon size={20} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
