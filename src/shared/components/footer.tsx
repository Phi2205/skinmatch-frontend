import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#2a2a2a] text-[#f5f2ed] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#7a9e8e] rounded-sm flex items-center justify-center">
                <span className="text-white font-bold">✕</span>
              </div>
              <span className="text-lg font-bold">Liora Care</span>
            </div>
            <p className="text-sm text-gray-400">
              Pure care, powered by nature. Cruelty-free & eco-conscious skincare for everyone.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-[#7a9e8e] transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=cleansers" className="text-gray-400 hover:text-[#7a9e8e] transition">
                  Cleansers
                </Link>
              </li>
              <li>
                <Link href="/products?category=moisturizers" className="text-gray-400 hover:text-[#7a9e8e] transition">
                  Moisturizers
                </Link>
              </li>
              <li>
                <Link href="/products?category=serums-treatments" className="text-gray-400 hover:text-[#7a9e8e] transition">
                  Serums & Treatments
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#about" className="text-gray-400 hover:text-[#7a9e8e] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-[#7a9e8e] transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-gray-400 hover:text-[#7a9e8e] transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#careers" className="text-gray-400 hover:text-[#7a9e8e] transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#faq" className="text-gray-400 hover:text-[#7a9e8e] transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#shipping" className="text-gray-400 hover:text-[#7a9e8e] transition">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="#returns" className="text-gray-400 hover:text-[#7a9e8e] transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-gray-400 hover:text-[#7a9e8e] transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; 2024 Liora Care. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#7a9e8e] transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#7a9e8e] transition">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#7a9e8e] transition">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
