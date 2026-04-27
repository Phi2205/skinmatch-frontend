'use client';
 
import Link from 'next/link';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/modules/cart/hooks/useCart';

import { GlassCard } from './ui/glass-container';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

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
              className="flex items-center gap-3 bg-white hover:bg-gray-50 transition rounded-full pl-6 pr-1 py-1 shadow-sm border border-gray-100"
            >
              <span className="text-[10px] font-bold tracking-widest text-[#4a4a4a]">CART({itemCount})</span>
              <div className="bg-[#9eb57a] p-2 rounded-full shadow-inner">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
            </Link>

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

