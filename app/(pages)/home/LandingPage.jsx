'use client';

import React from 'react';
import Header from '../../components/header/Header';
import CategoriesList from '../../components/header/CategoriesList';

export default function LandingPage() {
  return (
    <>
      <div className="">
        <Header />
        <CategoriesList />
      </div>
    </>
  );
}
