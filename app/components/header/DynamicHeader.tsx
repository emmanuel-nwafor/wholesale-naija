'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Split pathname and clean up empty segments
  const segments = pathname.split('/').filter((segment) => segment);

  // Optional: Human-readable mapping (customize as needed)
  const segmentLabels: Record<string, string> = {
    products: 'Products',
    categories: 'Categories',
    'mobile-phones': 'Mobile Phones',
    'apple-phones': 'Apple Phones',
    'iphone-16-pro-max': 'iPhone 16 Pro Max',
    tablets: 'Tablets',
    'iphone-15': 'iPhone 15',
    cart: 'Cart',
    profile: 'Profile',
    messages: 'Messages',
    store: 'Store',
    dashboard: 'Dashboard',
  };

  // Convert slug to readable title
  const formatSegment = (segment: string): string => {
    return segmentLabels[segment] || 
      segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Always show "Home" as first item
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = formatSegment(segment);
      return { label, href };
    }),
  ];

  if (pathname === '/' || segments.length === 0) {
    return null; 
  }

  return (
    <nav className="bg-gray-100 py-7 px-4 sm:px-10 lg:px-14">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <React.Fragment key={crumb.href}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
                )}

                {isLast ? (
                  <span className="font-medium text-gray-900">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}