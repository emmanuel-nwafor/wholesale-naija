import React from 'react';
import Image from 'next/image';
import { Star, Verified } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard() {
  return (
    <>
    <Link href={`/product/:id`}>
      <div className="overflow-hidden hover:cursor-pointer z-10">
        <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center p-8">
          <Image
            src="/svgs/blender.svg"
            alt="50kg Bag of Nigerian Rice"
            width={300}
            height={300}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-base font-medium text-gray-900 line-clamp-2">
            50kg Bag of Nigerian Rice
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">₦28,000</span>
            <span className="text-sm text-gray-500 line-through">₦30,500</span>

          </div>
          <div className="flex-col items-center justify-between">
            <p className="text-xs text-gray-500">MOQ: 20 bags</p>
            <div className="flex items-center justify-between mt-3">
              <span className="flex text-xs text-gray-400">
                AB***** <Verified className="w-4 h-4 fill-green-500 text-white"  />
              </span>

              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">4.5</span>
                <span className="text-xs text-gray-400">(3k+)</span>
                <Star className="w-3 h-3 fill-current text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
    </>
  );
}