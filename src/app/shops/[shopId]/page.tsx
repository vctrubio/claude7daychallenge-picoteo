"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "../../../hooks/useAuth";
import { useState, useEffect } from "react";
import CustomerForm from "../../../components/CustomerForm";

export default function ShopPage({ params }: { params: Promise<{ shopId: string }> }) {
  const [shopId, setShopId] = useState<Id<"shops"> | null>(null);
  
  useEffect(() => {
    params.then(resolvedParams => {
      setShopId(resolvedParams.shopId as Id<"shops">);
    });
  }, [params]);
  
  const products = useQuery(api.products.getProductsByShop, shopId ? { shopId } : "skip");
  const { user, signIn } = useAuth();
  const addToBasket = useMutation(api.baskets.addToBasket);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const handleAddToBasket = async (productId: Id<"products">) => {
    if (!user) {
      await signIn();
      return;
    }

    await addToBasket({
      userId: user._id,
      productId,
      count: 1
    });
  };

  if (products === undefined) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Link href="/shops" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Shops
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Available products in this shop</p>
        </header>

        <main>
          {products.length === 0 ? (
            <p className="text-gray-500">No products available in this shop.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h2>
                  <div className="mb-4">
                    <p className="text-lg font-bold text-green-600">
                      ${product.basePricePerUnit} per {product.unit}
                    </p>
                    <p className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                  {product.inStock && (
                    <button 
                      onClick={() => handleAddToBasket(product._id)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Add to Basket
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        {showCustomerForm && (
          <CustomerForm
            onClose={() => setShowCustomerForm(false)}
            onSuccess={() => {}}
          />
        )}
      </div>
    </div>
  );
}