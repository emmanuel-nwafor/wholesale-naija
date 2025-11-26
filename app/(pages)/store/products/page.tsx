"use client";
import { useState, useEffect } from "react";
import DashboardHeader from "@/app/components/header/DashboardHeader";
import StoreSidebar from "@/app/components/sidebar/StoreSidebar";
import AddProductModal from "@/app/components/modals/AddProductModal";
import { ShoppingBag, MoreVertical, Search } from "lucide-react";
import Image from "next/image";
import { fetchWithToken } from "@/app/utils/fetchWithToken";
import { getCurrentSellerId } from "@/app/utils/auth"; 

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  images: string[];
  categories: Category[];
  type: string;
  moq: number;
  price: number;
  status: "active" | "archived" | "draft";
}

interface ProductsResponse {
  products: Product[];
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get sellerId once on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const id = await getCurrentSellerId();
        if (!isMounted) return;
        setSellerId(id);
      } catch (err) {
        console.error("Failed to get seller id:", err);
        if (isMounted) setSellerId(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch products when sellerId is ready
  useEffect(() => {
    if (!sellerId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchWithToken<ProductsResponse>(`/v1/seller/store/${sellerId}`);
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sellerId]);

  // Refresh products after adding one
  const refreshProducts = async () => {
    if (!sellerId) return;
    try {
      const data = await fetchWithToken<ProductsResponse>(`/v1/seller/store/${sellerId}`);
      setProducts(data.products || []);
    } catch (err) {
      console.error("Refresh failed");
    }
  };

  const filteredProducts = products
    .filter(p => activeTab === "all" || p.status === activeTab)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const hasProducts = filteredProducts.length > 0;

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />

          <main className="flex-1 p-6 lg:p-8 md:ml-64">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">My Products</h1>

              {/* Tabs */}
              <div className="flex gap-8 border-b border-gray-200 mb-6">
                {(["all", "active", "archived"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 font-medium capitalize border-b-2 transition ${
                      activeTab === tab
                        ? "border-slate-900 text-slate-900"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "all" ? "All Products" : tab === "active" ? "Active" : "Archived"}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-32 text-gray-500">Loading your products...</div>
              ) : hasProducts ? (
                /* Table View */
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                  <div className="p-6 border-b flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative max-w-md w-full">
                      <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 font-medium"
                    >
                      Add Product
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                      <thead className="bg-gray-50 text-xs font-medium text-gray-600 uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 text-left">Name</th>
                          <th className="px-6 py-4 text-left">Categories</th>
                          <th className="px-6 py-4 text-left">Type</th>
                          <th className="px-6 py-4 text-left">MOQ</th>
                          <th className="px-6 py-4 text-left">Price</th>
                          <th className="px-6 py-4 text-left">Status</th>
                          <th className="px-6 py-4 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredProducts.map(product => (
                          <tr key={product._id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                {product.images[0] ? (
                                  <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <ShoppingBag className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                                <span className="font-medium text-gray-900">{product.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-sm text-gray-600">
                              {product.categories.map(c => c.name).join(", ")}
                            </td>
                            <td className="px-6 py-5 text-sm capitalize">{product.type}</td>
                            <td className="px-6 py-5 text-sm">{product.moq}</td>
                            <td className="px-6 py-5 font-medium text-gray-900">₦{product.price.toLocaleString()}</td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${
                                product.status === "active" ? "bg-green-100 text-green-800" :
                                product.status === "archived" ? "bg-red-100 text-red-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {product.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 relative">
                              <button
                                onClick={() => setDropdownOpen(dropdownOpen === product._id ? null : product._id)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                              >
                                <MoreVertical className="w-5 h-5 text-gray-500" />
                              </button>
                              {dropdownOpen === product._id && (
                                <div className="absolute right-6 top-12 z-20 w-48 bg-white rounded-xl shadow-xl border py-2">
                                  <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm">View Product</button>
                                  <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm">Edit Product</button>
                                  <button className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm">Delete Product</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-32">
                  <Image src="/svgs/emptyState-wholesale-svg.svg" alt="No products" width={160} height={160} className="mx-auto mb-8 opacity-80" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">You have no products yet</h3>
                  <p className="text-gray-600 mb-10 max-w-md mx-auto">
                    Start growing your wholesale business by adding your first product today!
                  </p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 shadow-lg transition"
                  >
                    <ShoppingBag className="w-6 h-6" />
                    Add Your First Product
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <AddProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          refreshProducts();
        }}
      />
    </>
  );
}