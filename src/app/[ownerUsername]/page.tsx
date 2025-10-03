"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const useOwnerShopLogic = (ownerUsername: string) => {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const router = useRouter();
  
  // Get owner by username
  const owner = useQuery(api.owners.getOwnerByUsername, { username: ownerUsername });
  
  // Get shop by owner
  const shop = useQuery(api.shops.getShopByOwnerId, owner ? { ownerId: owner._id } : "skip");
  
  // Get products for this shop
  const products = useQuery(api.products.getProductsByShop, shop ? { shopId: shop._id } : "skip");
  
  const addToCart = (product: any, quantity: number = 1) => {
    const existingIndex = selectedProducts.findIndex(p => p._id === product._id);
    
    if (existingIndex >= 0) {
      const updated = [...selectedProducts];
      updated[existingIndex].quantity += quantity;
      setSelectedProducts(updated);
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity }]);
    }
  };
  
  const getTotalPrice = () => {
    return selectedProducts.reduce((sum, product) => 
      sum + (product.basePricePerUnit * product.quantity), 0
    );
  };
  
  const goToCheckout = () => {
    const productsParam = encodeURIComponent(JSON.stringify(selectedProducts));
    const total = getTotalPrice().toFixed(2);
    
    router.push(`/checkout?owner=${ownerUsername}&products=${productsParam}&total=${total}`);
  };
  
  return {
    owner,
    shop,
    products,
    selectedProducts,
    addToCart,
    getTotalPrice,
    goToCheckout,
    isLoading: owner === undefined || shop === undefined || products === undefined
  };
};

export default function OwnerShopPage({ params }: { params: Promise<{ ownerUsername: string }> }) {
  const [ownerUsername, setOwnerUsername] = useState<string>("");
  
  // Handle async params
  params.then(resolvedParams => {
    if (resolvedParams.ownerUsername !== ownerUsername) {
      setOwnerUsername(resolvedParams.ownerUsername);
    }
  });
  
  const {
    owner,
    shop,
    products,
    selectedProducts,
    addToCart,
    getTotalPrice,
    goToCheckout,
    isLoading
  } = useOwnerShopLogic(ownerUsername);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading shop...</p>
        </div>
      </div>
    );
  }
  
  if (!owner || !shop) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Shop not found</h1>
          <Link href="/" className="text-emerald-600 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Shop Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{shop.name}</h1>
          <p className="text-gray-600 mb-2">{shop.description}</p>
          <p className="text-sm text-gray-500">{shop.address}</p>
          <p className="text-sm text-gray-500">Owner: @{owner.username}</p>
        </div>
        
        {/* Products */}
        <div className="grid gap-6 mb-8">
          <h2 className="text-2xl font-semibold">Products</h2>
          
          {products && products.length === 0 ? (
            <p className="text-gray-500">No products available</p>
          ) : (
            <div className="space-y-4">
              {products?.map(product => (
                <div key={product._id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600">€{product.basePricePerUnit} per {product.unit}</p>
                    <p className="text-sm text-gray-500">
                      {product.inStock ? 'In stock' : 'Out of stock'}
                    </p>
                  </div>
                  
                  {product.inStock && (
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Cart Summary */}
        {selectedProducts.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Cart Summary</h3>
            
            <div className="space-y-2 mb-4">
              {selectedProducts.map(product => (
                <div key={product._id} className="flex justify-between">
                  <span>{product.name} x{product.quantity}</span>
                  <span>€{(product.basePricePerUnit * product.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-xl font-bold">Total: €{getTotalPrice().toFixed(2)}</span>
              
              <button
                onClick={goToCheckout}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}