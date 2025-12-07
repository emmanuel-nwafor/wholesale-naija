'use client';
import React, { useEffect, useState, useRef } from 'react';
import Header from '@/app/components/header/Header';
import DynamicHeader from '@/app/components/header/DynamicHeader';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface SubCategory {
  name: string;
  image?: string;
}

interface Category {
  _id: string;
  name: string;
  subcategories: SubCategory[];
}

const FALLBACK_IMAGE = 'https://i.pinimg.com/736x/d4/cd/ed/d4cdedf5473646352923c5d44f94c6bf.jpg';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { current } = scrollRef;
    const scrollAmount = 300;
    current?.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!categoryId) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchWithToken<{ category: Category }>(`/admin/categories/${categoryId}`);
        setCategory(res.category);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryId]);

  const handleSubcatClick = (subcatName: string) => {
    const slug = subcatName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

    // Pass original name via query so backend gets exact match
router.push(`/category/${categoryId}/${slug}?name=${encodeURIComponent(subcatName)}`);
  };

  if (loading || !category) {
    return (
      <>
        <Header />
        <DynamicHeader />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <DynamicHeader />

      <div className="min-h-screen bg-white pt-8 pb-20">
        {/* Title */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gray-900 text-white py-5 rounded-3xl text-center">
            <h1 className="text-2xl font-semibold">{category.name}</h1>
          </div>
        </div>

        {/* Subcategories */}
        <div className="relative mt-10">
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          <div className="overflow-hidden px-6 md:px-12">
            <div
              ref={scrollRef}
              className="flex gap-12 overflow-x-auto scrollbar-none scroll-smooth py-4"
            >
              {category.subcategories.map((sub) => {
                const name = sub.name.trim();
                return (
                  <button
                    key={name}
                    onClick={() => handleSubcatClick(name)}
                    className=" w-52 group"
                  >
                    <div className="flex flex-col items-center gap-5">
                      <div className="relative w-64 h-40 rounded-3xl overflow-hidden hover:cursor-pointer border-8 border-white transition">
                        <Image
                          src={sub.image || FALLBACK_IMAGE}
                          alt={name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-base font-medium text-gray-800 text-center">
                        {name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}