'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, PackageCheck, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Join as Tailors', path: '/tailors' },
    { name: 'Join as Delivery Partners', path: '/delivery-partners' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-navy shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="logo"
                className="w-[30vw] sm:w-[12vw] object-cover"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive(item.path)
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-pearl hover:text-gold'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/AuthPage"
              className="bg-gold text-navy px-3 py-2 rounded-lg font-semibold text-sm hover:bg-gold-light transform hover:scale-105 transition-all duration-300"
            >
              Login/Signup
            </Link>

            <Link
              href="/orderspage"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                isActive('/orderspage')
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-pearl hover:text-gold'
              }`}
            >
              <PackageCheck className="h-5 w-5" />
              <span>My Orders</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-pearl hover:text-gold transition-colors duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-navy-light border-t border-gold/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-300 ${
                  isActive(item.path)
                    ? 'text-gold bg-navy'
                    : 'text-pearl hover:text-gold hover:bg-navy'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/AuthPage"
              className="block w-full text-center bg-gold text-navy px-3 py-2 mt-2 rounded-lg font-medium hover:bg-gold-light transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
