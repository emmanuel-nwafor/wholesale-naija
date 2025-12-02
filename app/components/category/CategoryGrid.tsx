import React from 'react';
import Image from 'next/image';

const categories = [
  {
    name: 'Phones & Tablets',
    img: '/svgs/grid-1.svg',
    span: 'col-span-2 row-span-1',
  },
  {
    name: 'Computers & Accessories',
    img: '/svgs/grid-2.svg',
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'Home Appliances',
    img: '/svgs/grid-3.svg',
    span: 'col-span-1 row-span-1',
  },
  { name: 'Fashion', img: '/svgs/grid-4.svg', span: 'col-span-1 row-span-1' },
  {
    name: 'Cosmetics & Health',
    img: '/svgs/grid-5.svg',
    span: 'col-span-1 row-span-1',
  },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 p-4">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className={`relative overflow-hidden rounded-2xl group cursor-pointer ${cat.span}`}
        >
          <Image
            src={cat.img}
            alt={cat.name}
            width={cat.span.includes('col-span-2') ? 800 : 400}
            height={300}
            className="w-full h-24 sm:h-24 md:h-60 lg:h-40 object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 bg-opacity-40 flex items-end p-4">
            <h3 className="text-white text-sm font-medium">{cat.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
