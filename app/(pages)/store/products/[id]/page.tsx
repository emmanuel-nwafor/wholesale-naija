'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import { Trash2, Edit, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { getCurrentSellerId } from '@/app/utils/auth';
import DeleteModal from '@/app/components/modals/DeleteModal';
import OkaySuccessModal from '@/app/components/modals/OkaySuccessModal';

interface PricingTier {
  minQty: number;
  maxQty?: number;
  price: number;
}
interface Variant {
  _id: string;
  name: string;
  price: number;
  MOQ: number;
  stock: number;
  pricingTiers: PricingTier[];
}
interface Product {
  _id: string;
  name: string;
  images: string[];
  price: number;
  status: string;
  description?: string;
  variants?: Variant[];
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ← New state

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetchWithToken<{ product: Product }>(
          `/v1/products/${id}`
        );
        setProduct(res.product);
        if (res.product.variants?.length) {
          setSelectedVariant(res.product.variants[0]);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    const sellerId = getCurrentSellerId();
    if (!sellerId) {
      alert('You must be logged in as a seller to delete products.');
      return;
    }

    setDeleting(true);
    try {
      await fetchWithToken(`/v1/seller/products/${id}`, {
        method: 'DELETE',
      });

      // Show success modal instead of alert
      setShowDeleteModal(false);
      setShowSuccessModal(true);

      // Redirect after a short delay
      setTimeout(() => {}, 2000);
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert(err.message || 'Failed to delete product. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 lg:p-8 md:ml-64 flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 lg:p-8 md:ml-64 flex items-center justify-center">
            <p className="text-gray-600">Product not found.</p>
          </main>
        </div>
      </div>
    );
  }

  const images =
    product.images.length > 0 ? product.images : ['/placeholder.svg'];
  const variant = selectedVariant;
  const hasVariants = product.variants && product.variants.length > 0;

  const sortedTiers = variant?.pricingTiers
    ? [...variant.pricingTiers].sort((a, b) => a.minQty - b.minQty)
    : [];

  return (
    <>
      <div className="flex min-h-screen">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 lg:p-8 md:ml-64">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 text-sm font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Products
              </button>

              <div className="overflow-hidden">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-10">
                    Product Details
                  </h1>
                  <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left: Image */}
                    <div className="space-y-6">
                      <div className="relative aspect-[3/3] rounded-3xl overflow-hidden bg-gray-100">
                        <Image
                          src={images[currentImageIndex]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      {images.length > 1 && (
                        <div className="flex justify-center gap-2 -mt-12 pb-4">
                          {images.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentImageIndex(i)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                i === currentImageIndex
                                  ? 'bg-gray-800 w-10'
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                          {product.name}
                        </h2>
                        <div className="flex items-center gap-3 mt-4">
                          <span className="text-sm text-gray-600">Status</span>
                          <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Active
                          </span>
                        </div>
                      </div>

                      {/* Pricing Section */}
                      <div className="space-y-6">
                        <div className="bg-gray-100 rounded-2xl p-6">
                          {hasVariants && sortedTiers.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                              {sortedTiers.map((tier, i) => (
                                <div key={i} className="space-y-2 text-center">
                                  <div className="text-[20px] font-bold text-gray-900">
                                    ₦{tier.price.toLocaleString('en-NG')}
                                  </div>
                                  <p className="text-[9.5px] text-gray-600">
                                    MOQ:{' '}
                                    {tier.maxQty
                                      ? `${tier.minQty}–${tier.maxQty}`
                                      : `≥${tier.minQty}`}{' '}
                                    pieces
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <>
                              <div className="text-4xl font-bold text-gray-900">
                                ₦
                                {(
                                  variant?.price || product.price
                                ).toLocaleString('en-NG')}
                              </div>
                              <p className="text-gray-600 text-base mt-3">
                                MOQ: {variant?.MOQ || 20} pieces
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Variant Selector */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="space-y-4">
                          <div className="text-sm text-gray-700">
                            Variations:{' '}
                            <span className="font-medium">
                              {product.variants.length} Variants
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {product.variants.map((v) => (
                              <button
                                key={v._id}
                                onClick={() => setSelectedVariant(v)}
                                className={`px-5 py-2 rounded-xl text-sm font-medium border transition-all ${
                                  selectedVariant?._id === v._id
                                    ? 'bg-gray-200 text-gray-600 border-gray-300'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                                }`}
                              >
                                {v.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          disabled={deleting}
                          className="flex items-center hover:cursor-pointer justify-center gap-2 px-6 py-5 border border-red-300 text-red-600 rounded-2xl hover:bg-red-50 disabled:opacity-70 disabled:cursor-not-allowed transition text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Product
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/store/products/${id}/edit`)
                          }
                          className="flex items-center hover:cursor-pointer justify-center gap-2 px-6 py-5 bg-[#1e293b] text-white rounded-2xl hover:bg-[#0f172a] transition text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Product
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-16 pt-10 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Product Description
                    </h3>
                    <div className="text-gray-700 leading-relaxed text-base space-y-3">
                      {product.description ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: product.description.replace(
                              /\n/g,
                              '<br />'
                            ),
                          }}
                        />
                      ) : (
                        <p className="text-gray-500">
                          No description available for this product.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete this product?"
        itemName={product.name}
        message="This will permanently remove the product and all its variants from your store."
        loading={deleting}
      />

      {/* Success Modal after deletion */}
      <OkaySuccessModal
        show={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push('/store/products');
        }}
        title="Product deleted successfully"
      />
    </>
  );
}
