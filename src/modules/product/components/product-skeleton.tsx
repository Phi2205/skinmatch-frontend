'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';

export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
            <div className="flex gap-4">
              <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
              <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-12 w-48 bg-gray-100 rounded animate-pulse" />
            <div className="space-y-2 py-6 border-y border-gray-100">
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-14 flex-1 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="h-14 flex-1 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Nav Skeleton */}
        <div className="h-12 w-full bg-gray-50 rounded-xl mb-8 animate-pulse" />
        
        {/* Sections Skeleton */}
        <div className="space-y-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <div className="h-16 bg-gray-50/50 p-6 animate-pulse" />
              <div className="p-8 space-y-4">
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-5 flex flex-col h-full space-y-4">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-50 rounded-xl animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 bg-gray-100/50 rounded-full" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          {/* Category Tag */}
          <div className="h-5 w-16 bg-gray-100 rounded-md animate-pulse" />
          {/* Star Rating */}
          <div className="h-4 w-8 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-2 flex-1">
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Price & Button */}
        <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
          <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
