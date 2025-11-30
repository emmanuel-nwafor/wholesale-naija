import React from "react";
import { Store, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="mt-6">
      <h1 className="m-2 text-gray-700 font-semibold">
        Quick Actions
      </h1>

      <div className="flex gap-4">
        {/* Add Store Info */}
        <button
          onClick={() => router.push("/store/management")}
          className="hover:cursor-pointer px-10 py-4 flex flex-col items-center justify-center gap-3 bg-gray-300 rounded-3xl hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <Store className="w-8 h-8 text-gray-700" />
          <span className="text-sm text-gray-700">Add Store Info</span>
        </button>

        {/* Add Product */}
        <button
          onClick={() => router.push("/store/products")}
          className="hover:cursor-pointer px-10 py-4 flex flex-col items-center justify-center gap-3 bg-slate-900 rounded-3xl hover:bg-slate-800 transition-colors text-white"
        >
          <ShoppingBag className="w-8 h-8" />
          <span className="text-sm">Add Product</span>
        </button>
      </div>
    </div>
  );
}
