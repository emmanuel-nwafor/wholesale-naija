'use client';

import React from 'react';
import Header from '../../components/header/Header';
import CategoriesList from '../../components/header/CategoriesList';
import CarouselBanner from '../../components/carousels/CarouselBanner';
import FeaturedGrid from '@/app/components/featured/FeaturedGrid';
import CategoryGrid from '@/app/components/category/CategoryGrid';
import NewProducts from '@/app/components/new-products/NewProducts';
import LandingPageBanner from '@/app/components/banner/LandingPageBanner';
import NewsLetter from '@/app/components/new-letter/NewsLetter';
import Footer from '@/app/components/footer/Footer';

export default function LandingPage() {
  return (
    <>
      <div className="">
        <Header />
        <CategoriesList />
        <CarouselBanner />
        <div className="p-5">
          <FeaturedGrid />
          <CategoryGrid />
          <NewProducts />
          <FeaturedGrid />
          <LandingPageBanner />
        </div>
        <NewsLetter />
        <Footer />
      </div>
    </>
  );
}
