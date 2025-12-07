'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/app/components/header/Header';
import DynamicHeader from '@/app/components/header/DynamicHeader';
import ProductCard from '@/app/components/product-card/ProductCard';
import StoreDetailsModal from '@/app/components/modals/StoreDetailsModal';
import { MapPin, Verified } from 'lucide-react';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { getCurrentSellerId } from '@/app/utils/auth';

type Tab = 'products' | 'stores';

interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  moq?: string;
  verified?: boolean;
  seller: {
    _id: string;
    fullName: string;
  };
}

interface Store {
  name: string;
  description?: string;
  location?: string;
  bannerUrl?: string;
  contactPhone?: string;
  whatsapp?: string;
}

interface Seller {
  _id: string;
  fullName: string;
  profilePicture?: { url: string };
  store: Store;
}

interface UnlockedStore {
  _id: string;
  sellerId: Seller;
}

// 🐛 FIX: Interface to match the structure of the data coming directly from the API 
// before it is mapped to WishlistProduct, replacing 'any[]'.
interface RawApiProduct {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  moq?: string;
  verified?: boolean;
  vendor?: { _id: string; fullName: string };
  seller?: { _id: string; fullName: string };
}

const DEFAULT_AVATAR = '/svgs/logo.svg';

export default function SavedProducts() {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [selectedStore, setSelectedStore] = useState<Seller | null>(null);
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [unlockedStores, setUnlockedStores] = useState<UnlockedStore[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);

  const userId = getCurrentSellerId();

  // Load Wishlist
  useEffect(() => {
    if (!userId || activeTab !== 'products') return;

    const loadWishlist = async () => {
      setLoadingProducts(true);
      try {
        // Updated type annotation: using RawApiProduct[] instead of any[]
        const data = await fetchWithToken<{ wishlist: { products: RawApiProduct[] } }>(
          '/v1/users/me/wishlist'
        );
        const formatted: WishlistProduct[] = data.wishlist.products.map(
          (p) => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            images: p.images || [],
            moq: p.moq,
            verified: p.verified || false,
            seller: {
              _id: p.vendor?._id || p.seller?._id || 'unknown',
              fullName:
                p.vendor?.fullName || p.seller?.fullName || 'Unknown Seller',
            },
          })
        );
        setProducts(formatted);
      } catch (err) {
        console.error('Failed to load wishlist:', err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadWishlist();
  }, [activeTab, userId]);

  // Load Unlocked Stores
  useEffect(() => {
    if (!userId || activeTab !== 'stores') return;

    const loadUnlockedStores = async () => {
      setLoadingStores(true);
      try {
        const data = await fetchWithToken<{ unlocked: UnlockedStore[] }>(
          `/v1/users/${userId}/unlocked`
        );
        setUnlockedStores(data.unlocked || []);
      } catch (err) {
        console.error('Failed to load unlocked stores:', err);
        setUnlockedStores([]);
      } finally {
        setLoadingStores(false);
      }
    };

    loadUnlockedStores();
  }, [activeTab, userId]);

  return (
    <>
      <Header />
      <DynamicHeader />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-8 text-sm font-medium border-b border-gray-200">
              <button
                onClick={() => setActiveTab('products')}
                className={`pb-4 hover:cursor-pointer transition ${activeTab === 'products' ? 'text-black border-b-2 border-black' : 'text-gray-600'}`}
              >
                Saved Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('stores')}
                className={`pb-4 hover:cursor-pointer transition ${activeTab === 'stores' ? 'text-black border-b-2 border-black' : 'text-gray-600'}`}
              >
                Unlocked Stores ({unlockedStores.length})
              </button>
            </div>
          </div>

          {/* Saved Products Tab */}
          {activeTab === 'products' && (
            <>
              <div className="mb-8">
                <h2 className="text-center text-lg font-medium text-gray-900 bg-gray-100 py-4 rounded-xl">
                  {loadingProducts
                    ? 'Loading saved products...'
                    : 'All Saved Products'}
                </h2>
              </div>

              {loadingProducts ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {[...Array(10)].map((_, i) => (
                    <ProductCard key={i} loading />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-lg">
                  No saved products yet
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Unlocked Stores Tab */}
          {activeTab === 'stores' && (
            <>
              <div className="mb-8">
                <h2 className="text-center text-lg font-medium text-gray-900 bg-gray-100 py-4 rounded-xl">
                  {loadingStores ? 'Loading stores...' : 'Unlocked Stores'}
                </h2>
              </div>

              {loadingStores ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-white rounded-3xl border border-gray-200 p-6">
                        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
                        <div className="h-5 bg-gray-200 rounded mx-auto w-32 mb-2" />
                        <div className="h-4 bg-gray-200 rounded mx-auto w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : unlockedStores.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-lg">
                  No unlocked stores yet
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {unlockedStores.map((item) => {
                    const seller = item.sellerId;
                    const store = seller.store;
                    const profilePic = seller.profilePicture?.url;

                    return (
                      <div
                        key={item._id}
                        onClick={() => setSelectedStore(seller)}
                        className="bg-white rounded-3xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition"
                      >
                        <div className="relative mb-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <Image
                              src={profilePic || DEFAULT_AVATAR}
                              alt={store.name || seller.fullName}
                              className="w-full h-full object-cover"
                              height={35}
                              width={35}
                              unoptimized
                              onError={(e) =>
                                (e.currentTarget.src = DEFAULT_AVATAR)
                              }
                            />
                          </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 flex gap-1">
                          {store.name}
                          <Verified className="w-4 h-4 fill-green-500 text-white" />
                        </h3>

                        <div className="flex gap-4 my-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{store.location || 'Nigeria'}</span>
                          </div>
                        </div>

                        <button className="mt-3 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition">
                          View Profile
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <StoreDetailsModal
        isOpen={!!selectedStore}
        onClose={() => setSelectedStore(null)}
        sellerId={selectedStore?._id || ''}
        sellerName={selectedStore?.fullName || 'Unknown Seller'}
        profilePicture={selectedStore?.profilePicture?.url || DEFAULT_AVATAR}
        store={
          selectedStore?.store || { name: '', description: '', location: '' }
        }
      />
    </>
  );
}