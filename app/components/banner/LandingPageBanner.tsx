import React from 'react';
import Image from 'next/image';

export default function LandingPageBanner() {
  return (
    <div className="bg-[url('/svgs/banner.svg')] text-white rounded-2xl py-2">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl text-center md:text-left font-bold">
            Connecting Buyers & Sellers Seamlessly
          </h2>
          <p className="text-green-100 text-center md:text-left">
            Whether you're here to buy or sell, our platform makes everything easy, secure, and fast.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Image
              src="/svgs/playstore-logo.svg"
              alt="Get it on Google Play"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
            <Image
              src="/svgs/apple-logo.svg"
              alt="Download on the App Store"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </div>
        </div>
        <div className="relative">
          <Image
            src="/svgs/mobile-app.svg"
            alt="Whale App"
            width={300}
            height={500}
            className="relative z-10 mx-auto translate-y-2 rounded-t-[45px]"
          />
        </div>
      </div>
    </div>
  );
}