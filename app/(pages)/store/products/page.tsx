'use client';
import { useState, useEffect, useRef } from 'react';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import AddProductModal from '@/app/components/modals/AddProductModal';
import {
  ShoppingBag,
  MoreVertical,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { getCurrentSellerId } from '@/app/utils/auth';

interface Category {
  _id: string;
  name: string;
}

interface Variant {
  pricingTiers?: { minQty: number; maxQty?: number; price: number }[];
}

interface Product {
  _id: string;
  name: string;
  images: string[];
  price: number;
  moq?: string | number;
  status: 'active' | 'archived' | 'approved' | 'pending' | 'rejected';
  type: string;
  categories?: string[];
  category?: string;
  subcategory?: string;
  brand?: string;
  variants?: Variant[];
}

export default function SellersProductPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'archived'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  useEffect(() => {
    fetchWithToken<{ categories: Category[] }>('/v1/categories')
      .then((res) => setCategories(res.categories || []))
      .catch(() => setCategories([]));
  }, []);

  // Fetch ALL products (no status filter)
  const fetchProducts = async () => {
    const sellerId = getCurrentSellerId();
    if (!sellerId) return setLoading(false);

    try {
      setLoading(true);
      const res = await fetchWithToken<{ products: Product[] }>(
        `/v1/sellers/${sellerId}/products`
      );
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const refreshProducts = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const getCategoryName = (product: Product): string => {
    const id = product.categories?.[0] || product.category;
    if (!id) return '—';
    const cat = categories.find((c) => c._id === id);
    return cat?.name || 'Uncategorized';
  };

  const getMOQ = (product: Product): string => {
    if (
      product.type === 'Variant' &&
      product.variants &&
      product.variants.length > 0
    ) {
      let lowestMinQty = Infinity;
      product.variants.forEach((variant) => {
        if (variant.pricingTiers && variant.pricingTiers.length > 0) {
          variant.pricingTiers.forEach((tier) => {
            if (tier.minQty < lowestMinQty) lowestMinQty = tier.minQty;
          });
        }
      });
      if (lowestMinQty !== Infinity) return `${lowestMinQty} pcs`;
    }
    return product.moq ? String(product.moq) : '—';
  };

  // Local filtering for tabs and search
  const filteredProducts = products
    .filter((product) => {
      const status = product.status.toLowerCase();
      if (activeTab === 'all') return true;
      if (activeTab === 'active')
        return ['active', 'approved'].includes(status);
      if (activeTab === 'archived') return status === 'archived';
      return false;
    })
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
      case 'archived':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewProduct = (id: string) => {
    setDropdownOpen(null);
    router.push(`/store/products/${id}`);
  };

  const handleEditProduct = (productId: string) => {
    setDropdownOpen(null);
    router.push(`/store/products/${productId}/edit`);
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-64">
            <div className="max-w-7xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6"
              >
                My Products
              </motion.h1>

              {/* Tabs */}
              <div className="flex gap-6 sm:gap-8 border-b border-gray-200 mb-6 text-sm font-medium text-gray-600 overflow-x-auto whitespace-nowrap pb-1">
                {(['all', 'active', 'archived'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }}
                    className={`pb-3 border-b-2 transition-all whitespace-nowrap capitalize ${
                      activeTab === tab
                        ? 'border-blue-600 text-gray-900'
                        : 'border-transparent hover:text-gray-900'
                    }`}
                  >
                    {tab === 'all'
                      ? 'All Products'
                      : tab === 'active'
                        ? 'Active Products'
                        : 'Archived Products'}
                  </button>
                ))}
              </div>

              {/* Search + Add Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white transition-all"
                  />
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-slate-900 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl text-sm font-medium transition w-full sm:w-auto"
                >
                  Add Product
                </button>
              </div>

              {/* Products List */}
              {loading ? (
                <div className="text-center py-20 text-gray-500">
                  Loading products...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Image
                    src="/svgs/emptyState-wholesale-svg.svg"
                    alt="No products"
                    width={120}
                    height={120}
                    className="mx-auto mb-4 opacity-70"
                  />
                  <p className="text-gray-600">
                    You have no products yet. Add your first product to get
                    started.
                  </p>
                </div>
              ) : (
                <div ref={dropdownRef}>
                  {/* Mobile Cards */}
                  <div className="block lg:hidden space-y-4">
                    {paginatedProducts.map((product, idx) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="relative bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
                      >
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            {product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={80}
                                height={80}
                                className="rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="w-10 h-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {product.name}
                            </h3>
                            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-gray-500">Category</span>
                                <p className="font-medium truncate">
                                  {getCategoryName(product)}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">Type</span>
                                <p className="font-medium capitalize">
                                  {product.type || 'Simple'}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">MOQ</span>
                                <p className="font-medium">{getMOQ(product)}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Price</span>
                                <p className="font-medium text-gray-900">
                                  ₦{product.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span
                                className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(
                                  product.status
                                )}`}
                              >
                                {product.status.charAt(0).toUpperCase() +
                                  product.status.slice(1)}
                              </span>
                              <button
                                onClick={() => toggleDropdown(product._id)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                              >
                                <MoreVertical className="w-5 h-5 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {dropdownOpen === product._id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-4 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50"
                            >
                              <button
                                onClick={() => handleViewProduct(product._id)}
                                className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                View Product
                              </button>
                              <button
                                onClick={() => handleEditProduct(product._id)}
                                className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Edit Product
                              </button>
                              <button className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50">
                                Delete Product
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="hidden lg:block bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[800px]">
                        <thead>
                          <tr className="border-b border-gray-200 text-sm font-medium text-gray-600 bg-gray-50/50">
                            <th className="px-6 py-4 text-left">Name</th>
                            <th className="px-6 py-4 text-left">Category</th>
                            <th className="px-6 py-4 text-left">Type</th>
                            <th className="px-6 py-4 text-left">MOQ</th>
                            <th className="px-6 py-4 text-left">Price</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedProducts.map((product, idx) => (
                            <motion.tr
                              key={product._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                  {product.images[0] ? (
                                    <Image
                                      src={product.images[0]}
                                      alt={product.name}
                                      width={48}
                                      height={48}
                                      className="rounded-xl object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                                      <ShoppingBag className="w-7 h-7 text-gray-400" />
                                    </div>
                                  )}
                                  <span className="font-medium text-gray-900">
                                    {product.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-gray-600">
                                {getCategoryName(product)}
                              </td>
                              <td className="px-6 py-5 text-gray-600 capitalize">
                                {product.type || 'Simple'}
                              </td>
                              <td className="px-6 py-5 text-gray-600 font-medium">
                                {getMOQ(product)}
                              </td>
                              <td className="px-6 py-5 font-medium text-gray-900">
                                ₦{product.price.toLocaleString()}
                              </td>
                              <td className="px-6 py-5">
                                <span
                                  className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(
                                    product.status
                                  )}`}
                                >
                                  {product.status.charAt(0).toUpperCase() +
                                    product.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-5 relative">
                                <button
                                  onClick={() => toggleDropdown(product._id)}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                  <MoreVertical className="w-5 h-5 text-gray-500" />
                                </button>
                                <AnimatePresence>
                                  {dropdownOpen === product._id && (
                                    <motion.div
                                      initial={{
                                        opacity: 0,
                                        y: -10,
                                        scale: 0.95,
                                      }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute right-6 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50"
                                    >
                                      <button
                                        onClick={() =>
                                          handleViewProduct(product._id)
                                        }
                                        className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                      >
                                        View Product
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleEditProduct(product._id)
                                        }
                                        className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                      >
                                        Edit Product
                                      </button>
                                      <button className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50">
                                        Delete Product
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
                >
                  <p className="text-gray-600">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, filteredProducts.length)}{' '}
                    of {filteredProducts.length} products
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page =
                            totalPages <= 5
                              ? i + 1
                              : i + Math.max(1, currentPage - 2);
                          if (page > totalPages) return null;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 rounded-lg font-medium transition ${
                                currentPage === page
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-2 text-gray-500">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="px-4 py-2 rounded-lg hover:bg-gray-50"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
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
