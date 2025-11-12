"use client";

import DashboardHeader from "@/app/components/header/DashboardHeader";
import StoreSidebar from "@/app/components/sidebar/StoreSidebar";
import AddProductModal from "@/app/components/modals/AddProductModal";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function VendorProductsPage() {
  const hasProducts = false;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardHeader />

          <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                Products
              </h1>

              {hasProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {/* Product cards */}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden">
                      <Image
                        src="/svgs/emptyState-wholesale-svg.svg"
                        alt="No products"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {/* <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-300 rounded-full"></div> */}
                    {/* <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gray-300 rounded-full"></div> */}
                  </div>

                  <p className="text-gray-600 mb-8">You have no product</p>

                  <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-12 py-3 rounded-xl font-medium hover:bg-slate-800 transition"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add Product
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <AddProductModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}