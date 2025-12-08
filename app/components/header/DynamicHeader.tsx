// app/components/header/DynamicHeader.tsx
'use client';

import React, { Suspense } from 'react'; 
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const BreadcrumbContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams(); 

  const segments = pathname.split('/').filter(Boolean);

  const knownLabels: Record<string, string> = {
    products: 'Products',
    categories: 'Categories',
    cart: 'Cart',
    profile: 'Profile',
    messages: 'Messages',
    store: 'Store',
    dashboard: 'Dashboard',
  };

  const isId = (segment: string) => {
    return segment.length >= 12 && /^[a-f0-9]{12,}$/i.test(segment);
  };

  const getNameFromQuery = () => {
    const name = searchParams.get('name');
    return name ? decodeURIComponent(name) : null;
  };

  const breadcrumbs: { label: string; href: string; isLast: boolean }[] = [];

  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    if (isId(segment)) {
      return;
    }

    const isLast = index === segments.length - 1;
    let label =
      knownLabels[segment] ||
      segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    if (isLast) {
      const nameFromUrl = getNameFromQuery();
      if (nameFromUrl) {
        label = nameFromUrl;
      }
    }

    breadcrumbs.push({
      label,
      href: currentPath,
      isLast,
    });
  });

  // Always show Home
  const items = [{ label: 'Home', href: '/', isLast: false }, ...breadcrumbs];

  if (pathname === '/' || items.length <= 1) return null;

  return (
    <nav className="bg-gray-100 py-6 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
          {items.map((item, index) => (
            <React.Fragment key={item.href}>
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              {item.isLast ? (
                <span className="font-semibold text-gray-900">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </ol>
      </div>
    </nav>
  );
};


export default function DynamicHeader() {
  const Fallback = () => (
    <div className="bg-gray-100 py-6 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto h-5 bg-gray-200 w-1/3 rounded animate-pulse"></div>
    </div>
  );
  
  return (
    <Suspense fallback={<Fallback />}>
      <BreadcrumbContent />
    </Suspense>
  );
}