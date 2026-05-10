'use client';

import Link from 'next/link';

export function WishlistTab() {
  return (
    <div className="bg-white rounded-lg p-8 border border-[#e8e5dd]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        My Wishlist
      </h2>
      <p className="text-gray-600">
        Your wishlist is empty. Add your favorite products!
      </p>
      <Link
        href="/products"
        className="inline-block mt-4 px-6 py-2 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition cursor-pointer"
      >
        Browse Products
      </Link>
    </div>
  );
}
