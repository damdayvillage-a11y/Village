'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';

// Navigation data structure
const navigationData = {
  main: [
    {
      name: 'Home',
      href: '/',
      description: 'Welcome to Damday Village',
    },
    {
      name: 'About',
      href: '/about',
      description: 'Our story and heritage',
    },
    {
      name: 'Village Tour',
      href: '/village-tour',
      description: '360° immersive experience',
    },
    {
      name: 'Digital Twin',
      href: '/digital-twin',
      description: '3D village exploration',
    },
  ],
  services: [
    {
      name: 'Book Homestay',
      href: '/book-homestay',
      description: 'Authentic village accommodation',
      icon: '🏠',
    },
    {
      name: 'Marketplace',
      href: '/marketplace',
      description: 'Local products and crafts',
      icon: '🛒',
    },
    {
      name: 'Events',
      href: '/events',
      description: 'Festivals and cultural events',
      icon: '🎉',
    },
    {
      name: 'Projects',
      href: '/projects',
      description: 'Community development initiatives',
      icon: '🔧',
    },
  ],
  community: [
    {
      name: 'Vision & Mission',
      href: '/vision',
      description: 'Our sustainable future goals',
    },
    {
      name: 'Articles & Blog',
      href: '/articles',
      description: 'Community stories and insights',
    },
    {
      name: 'Contact Us',
      href: '/contact',
      description: 'Get in touch with our team',
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      description: 'Analytics and insights',
    },
  ],
} as const;

interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className={`bg-white shadow-md border-b border-neutral-200 sticky top-0 z-50 ${className}`}>
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-display font-bold text-primary-500 hover:text-primary-600 transition-colors duration-200"
            >
              Damday Village
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" ref={dropdownRef}>
            {/* Main Links (no dropdown) */}
            {navigationData.main.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActiveLink(item.href)
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                    : 'text-neutral-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('services')}
                className={`text-sm font-medium transition-colors duration-200 flex items-center ${
                  activeDropdown === 'services'
                    ? 'text-primary-600'
                    : 'text-neutral-700 hover:text-primary-600'
                }`}
              >
                Services
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === 'services' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Services Mega Menu */}
              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-neutral-200 p-6 animate-fade-in">
                  <div className="grid grid-cols-1 gap-4">
                    {navigationData.services.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group flex items-start p-3 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 text-2xl mr-3">{item.icon}</div>
                        <div>
                          <div className="text-sm font-medium text-neutral-900 group-hover:text-primary-600">
                            {item.name}
                          </div>
                          <div className="text-xs text-neutral-500 mt-1">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Community Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('community')}
                className={`text-sm font-medium transition-colors duration-200 flex items-center ${
                  activeDropdown === 'community'
                    ? 'text-primary-600'
                    : 'text-neutral-700 hover:text-primary-600'
                }`}
              >
                Community
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === 'community' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Community Dropdown */}
              {activeDropdown === 'community' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-neutral-200 p-4 animate-fade-in">
                  <div className="space-y-2">
                    {navigationData.community.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block p-2 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                      >
                        <div className="text-sm font-medium text-neutral-900 hover:text-primary-600">
                          {item.name}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          {item.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/auth/signin" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors duration-200">
              Sign In
            </Link>
            <Button variant="primary" size="sm" asChild>
              <Link href="/book-homestay">Book Stay</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Main Navigation */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">
                  Navigate
                </h3>
                <div className="space-y-2">
                  {navigationData.main.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActiveLink(item.href)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">
                  Services
                </h3>
                <div className="space-y-2">
                  {navigationData.services.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors duration-200"
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs text-neutral-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Community */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">
                  Community
                </h3>
                <div className="space-y-2">
                  {navigationData.community.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="space-y-3">
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Button variant="primary" size="sm" className="w-full" asChild>
                    <Link href="/book-homestay">Book Your Stay</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}