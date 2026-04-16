'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { navConfig } from '@/src/lib/constants/nav';
import AuthSheet from './AuthSheet';

export default function Navbar() {
  const pathname = usePathname();
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Check if a route is active
  const isActive = (href: string) => {
    return pathname?.startsWith(href);
  };

  // Check if category is active based on its primary href
  const isCategoryActive = (categoryId: string) => {
    const category = navConfig.find(cat => cat.id === categoryId);
    if (!category) return false;
    return isActive(category.primaryHref);
  };

  // Handle mega menu open/close
  const handleMouseEnter = (categoryId: string) => {
    if (navConfig.find(cat => cat.id === categoryId)?.sections.length) {
      setActiveMegaMenu(categoryId);
    }
  };

  const handleMouseLeave = () => {
    setActiveMegaMenu(null);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center space-x-2 relative flex-shrink-0">
              <div className="h-8 w-8 rounded-lg brand-logo flex items-center justify-center text-white text-sm font-bold shadow-sm">
                CP
              </div>
              <Link href="/" className="text-xl font-semibold text-slate-900 tracking-tight">
                Cryptopedia
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 text-sm relative">
              {navConfig.map((category) => {
                const active = isCategoryActive(category.id);
                const hasDropdown = category.sections.length > 0;
                return (
                  <div
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(category.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={category.primaryHref}
                      className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                        active
                          ? 'text-slate-900 bg-blue-50 border border-blue-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {category.label}
                    </Link>

                    {/* Mega Menu */}
                    {activeMegaMenu === category.id && hasDropdown && (
                      <div
                        ref={megaMenuRef}
                        className="absolute top-full left-0 mt-1 w-72 max-w-[90vw] bg-white border border-slate-200 rounded-xl shadow-xl z-50"
                        role="menu"
                        aria-label={`${category.label} menu`}
                      >
                        <div className="p-5 text-left">
                          <ul className="space-y-1" role="none">
                            {category.sections.flatMap(section => section.links).map((link) => (
                              <li key={link.href} role="none">
                                <Link
                                  href={link.href}
                                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    isActive(link.href) ? 'bg-blue-50 text-blue-700' : 'text-slate-900 hover:text-blue-600'
                                  }`}
                                  role="menuitem"
                                  onClick={() => setActiveMegaMenu(null)}
                                >
                                  <span className="flex-shrink-0 w-4 h-4"></span>
                                  <span>{link.label}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Membership button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuthOpen(true)}
              className="px-4 py-2 rounded-full bg-[#2157b2] text-white text-sm font-medium whitespace-nowrap ml-auto focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors shadow-sm hover:shadow-md"
            >
              Sign up / Log in
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-2">
              {navConfig.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-slate-900 uppercase tracking-wider">
                    {category.label}
                  </div>

                  {/* If a category has no sections (e.g. About), show its primary link */}
                  {category.sections.length === 0 ? (
                    <Link
                      href={category.primaryHref}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block ml-4 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive(category.primaryHref)
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-medium">{category.label}</div>
                    </Link>
                  ) : (
                    category.sections.map((section) => (
                      <div key={section.title} className="ml-4 space-y-1">
                        <div className="px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          {section.title}
                        </div>
                        {section.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                              isActive(link.href)
                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="font-medium">{link.label}</div>
                            {link.description && (
                              <div className="text-xs text-slate-500 mt-1">
                                {link.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* AuthSheet modal */}
        <AuthSheet open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </nav>
  );
}
