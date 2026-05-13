"use client";
import Image from 'next/image';
import Link from 'next/link';
import { 
  LayoutGrid, 
  Flame, 
  Sparkles, 
  Package, 
  Droplets, 
  Flower2, 
  HeadphonesIcon, 
  CalendarCheck 
} from 'lucide-react';

export function MobileHero() {
  const categories = [
    { name: "Danh Mục", icon: <LayoutGrid size={24} />, color: "bg-emerald-100 text-emerald-600", href: "/categories" },
    { name: "Deal Sốc", icon: <Flame size={24} />, color: "bg-orange-100 text-orange-600", href: "/flash-sales" },
    { name: "Hàng Mới", icon: <Sparkles size={24} />, color: "bg-pink-100 text-pink-600", href: "/new-arrivals" },
    { name: "Combo Rẻ", icon: <Package size={24} />, color: "bg-blue-100 text-blue-600", href: "/combos" },
    { name: "Da Mặt", icon: <Droplets size={24} />, color: "bg-cyan-100 text-cyan-600", href: "/skincare" },
    { name: "Cơ Thể", icon: <Flower2 size={24} />, color: "bg-purple-100 text-purple-600", href: "/bodycare" },
    { name: "Hỗ Trợ", icon: <HeadphonesIcon size={24} />, color: "bg-gray-100 text-gray-600", href: "/support" },
    { name: "Đặt Hẹn", icon: <CalendarCheck size={24} />, color: "bg-rose-100 text-rose-600", href: "/booking" },
  ];

  return (
    <section className="w-full bg-[#f0f5f2] pt-4 pb-6 px-4">
      {/* Mobile Banner */}
      <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden shadow-sm mb-6">
        <Image 
          src="/background.png" 
          alt="Liora Care Mobile Banner" 
          fill 
          className="object-cover"
        />
        <Image 
          src="/mountain.png" 
          alt="Liora Care Mobile Banner Mountain" 
          fill 
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#326e51]/80 to-transparent flex flex-col justify-center px-6">
          <h2 className="text-white font-extrabold text-2xl mb-1">TRUE ESSENCE</h2>
          <p className="text-white/90 text-sm max-w-[60%]">
            Mỹ phẩm thuần chay thiên nhiên
          </p>
          <div className="mt-3">
            <span className="bg-white text-[#326e51] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              Mua Ngay
            </span>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-4 gap-y-6 gap-x-2">
          {categories.map((item, index) => (
            <Link href={item.href} key={index} className="flex flex-col items-center gap-2 group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
                {item.icon}
              </div>
              <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
