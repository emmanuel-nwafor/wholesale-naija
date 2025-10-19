'use client';

import React from 'react';
import Link from 'next/link';

export default function CategoriesList() {
  return (
    <>
      <div className="flex">
        <Link href="/">All Categories</Link>
        <Link href="/">Phones & Tablet</Link>
        <Link href="/">Computer & Accessories</Link>
        <Link href="/">Home Electronics</Link>
        <Link href="/">Home Appliances</Link>
        <Link href="/">Fashion</Link>
        <Link href="/">Cosmetics & Health</Link>
        <Link href="/">Food & Drinks</Link>
      </div>
    </>
  );
}
