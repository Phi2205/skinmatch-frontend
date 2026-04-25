'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#e8e5dd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7a9e8e] rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg">✕</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">Silvor Care</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-700 hover:text-[#7a9e8e] transition">
              Home
            </Link>
            <Link href="/products" className="text-sm text-gray-700 hover:text-[#7a9e8e] transition">
              Shop
            </Link>
            <Link href="#services" className="text-sm text-gray-700 hover:text-[#7a9e8e] transition">
              Services
            </Link>
            <Link href="#about" className="text-sm text-gray-700 hover:text-[#7a9e8e] transition">
              About us
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#c9b896] text-white hover:bg-[#b5a080] transition"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link href="/account" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#f5f2ed] transition">
              <User className="w-5 h-5 text-gray-700" />
              <span className="text-sm text-gray-700 hidden lg:inline">Account</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-[#e8e5dd]">
            <Link href="/" className="block py-2 text-sm text-gray-700 hover:text-[#7a9e8e]">
              Home
            </Link>
            <Link href="/products" className="block py-2 text-sm text-gray-700 hover:text-[#7a9e8e]">
              Shop
            </Link>
            <Link href="#services" className="block py-2 text-sm text-gray-700 hover:text-[#7a9e8e]">
              Services
            </Link>
            <Link href="#about" className="block py-2 text-sm text-gray-700 hover:text-[#7a9e8e]">
              About us
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
