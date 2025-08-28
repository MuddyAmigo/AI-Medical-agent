// AppHeader.tsx

'use client'; // Required for using hooks like usePathname and useState

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react'; // Using lucide-react for icons

const menuOptions = [
  { id: 1, name: 'Home', path: '/' }, 
  { id: 2, name: 'History', path: '/dashboard/history' },
  { id: 3, name: 'Profile', path: '/dashboard/profile' }
];

export default function AppHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative w-full bg-white/80 px-4 py-1 shadow-lg shadow-sky-200/50 backdrop-blur-lg md:px-8 lg:px-16">
      <div className="flex w-full items-center justify-between">
        
        {/* Logo */}
        <Link href="/dashboard">
          <Image src={'/logo2.png'} alt="logo" width={160} height={80} className="rounded-lg" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {menuOptions.map(option => {
            const isActive = pathname === option.path;
            return (
              <Link key={option.id} href={option.path}>
                <span className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' 
                    : 'text-slate-600 hover:bg-sky-100 hover:text-sky-600'
                  }
                `}>
                  {option.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 ring-2 ring-offset-2 ring-sky-400"
              }
            }}
          />
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-700 hover:bg-sky-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <nav className="md:hidden mt-4">
          <div className="flex flex-col items-center gap-4 bg-white rounded-lg p-4 shadow-inner">
            {menuOptions.map(option => {
              const isActive = pathname === option.path;
              return (
                <Link key={option.id} href={option.path} onClick={() => setMobileMenuOpen(false)}>
                  <span className={`
                    w-full text-center px-4 py-2 rounded-md font-medium
                    ${isActive ? 'bg-sky-500 text-white' : 'text-slate-600 hover:bg-sky-100'}
                  `}>
                    {option.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}