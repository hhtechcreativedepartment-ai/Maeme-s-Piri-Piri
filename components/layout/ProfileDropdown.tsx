'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { LogOut, User, History, Zap, FileText, Shield } from 'lucide-react';

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (!user) return null;

  const menuItems = [
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: History, label: 'Order History', href: '/orders' },
    { icon: Zap, label: 'Promo', href: '/promo' },
    { icon: FileText, label: 'Terms & Conditions', href: '/terms' },
    { icon: Shield, label: 'Privacy Policy', href: '/privacy' },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Get user initials for avatar
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#99041e] text-white font-bold text-sm hover:bg-[#7f0318] transition-colors"
        aria-label="User profile"
        title={user.email}
      >
        {initials}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-[#F0E5D8] py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-[#F0E5D8]">
            <p className="font-semibold text-[#1A1A1A] text-sm">{user.name}</p>
            <p className="text-xs text-[#666666]">{user.email}</p>
          </div>

          {/* Menu Items */}
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 text-[#1A1A1A] text-sm hover:bg-[#FAF8F5] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={18} className="text-[#99041e]" />
              {item.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t border-[#F0E5D8] my-2" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#99041e] text-sm hover:bg-[#FFF5F5] transition-colors font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
