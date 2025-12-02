import React from 'react';
import Image from 'next/image';
import { Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="https://res.cloudinary.com/dqtjja88b/image/upload/v1760219419/Screenshot_2025-10-11_224658_q8bjy2.png"
                alt="wholesale naija logo"
                height={70}
                width={70}
              />
            </div>
            <p className="text-sm">
              Connecting buyers with trusted sellers nationwide.
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Download App */}
          <div>
            <h3 className="text-white font-semibold mb-4">DOWNLOAD APP</h3>
            <div className="space-y-2">
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

          {/* Marketplace */}
          <div>
            <h3 className="text-white font-semibold mb-4">MARKETPLACE</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">Categories</li>
              <li className="hover:text-white cursor-pointer">
                Become A Seller
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">SUPPORT</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">FAQs</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-white font-semibold mb-4">CONTACT US</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email: support@whalesale.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                WhatsApp: +234 9012345678
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Phone: +234 9012345678
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-500 pt-6 text-center text-sm">
          <p>© 2025 Wholesale Naija. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
