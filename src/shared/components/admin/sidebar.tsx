'use client';

import { 
  ShoppingBag, 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Tag,
  Droplets,
  AlertCircle,
  Beaker,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Manage Categories', href: '/admin/categories', icon: Tag },
    { name: 'Manage Skin Types', href: '/admin/skin-types', icon: Droplets },
    { name: 'Manage Concerns', href: '/admin/concerns', icon: AlertCircle },
    { name: 'Manage Ingredients', href: '/admin/ingredients', icon: Beaker },
    { name: 'Manage Badges', href: '/admin/badges', icon: Award },
    { name: 'Manage Users', href: '#', icon: Users },
    { name: 'Settings', href: '#', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-6 border-b border-gray-50">
        <span className="text-xl font-bold text-[#7a9e8e]">Silvor Admin</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive 
                ? 'bg-[#7a9e8e] text-white shadow-lg shadow-[#7a9e8e]/20' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl font-semibold transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
