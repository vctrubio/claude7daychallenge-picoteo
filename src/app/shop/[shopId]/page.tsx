"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "../../../hooks/useAuth";
import { useState, useEffect } from "react";

export default function ShopPage({ params }: { params: Promise<{ shopId: string }> }) {
  console.log("dev:ShopPage:render - Shop page rendering");
  
  const [shopId, setShopId] = useState<Id<"shops"> | null>(null);
  
  useEffect(() => {
    params.then(resolvedParams => {
      setShopId(resolvedParams.shopId as Id<"shops">);
    });
  }, [params]);
  const products = useQuery(api.products.getProductsByShop, shopId ? { shopId } : "skip");
  const { user, signIn, isAuthenticated } = useAuth();
  const addToBasket = useMutation(api.baskets.addToBasket);
  const [addingToBasket, setAddingToBasket] = useState<string | null>(null);

  console.log("dev:ShopPage:state", { 
    shopId, 
    user: user?._id, 
    isAuthenticated, 
    productsCount: products?.length,
    addingToBasket 
  });

  const handleAddToBasket = async (productId: Id<"products">) => {
    console.log("dev:ShopPage:addToBasket - attempting to add product to basket", { 
      productId, 
      isAuthenticated, 
      userId: user?._id 
    });
    
    if (!isAuthenticated) {
      console.log("dev:ShopPage:addToBasket - user not authenticated, prompting sign in");
      signIn();
      return;
    }

    if (!user) {
      console.log("dev:ShopPage:addToBasket - user object not available");
      return;
    }

    setAddingToBasket(productId);
    try {
      console.log("dev:ShopPage:addToBasket - calling addToBasket mutation");
      await addToBasket({
        userId: user._id,
        productId,
        count: 1
      });
      console.log("dev:ShopPage:addToBasket - successfully added to basket");
    } catch (error) {
      console.error("dev:ShopPage:addToBasket - failed to add to basket:", error);
    } finally {
      setAddingToBasket(null);
    }
  };

  if (!isAuthenticated) {
    console.log("dev:ShopPage:render - showing sign in screen");
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sign in to view products
          </h1>
          <button
            onClick={() => {
              console.log("dev:ShopPage:signIn - sign in button clicked");
              signIn();
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Enter to Shop
          </button>
        </div>
      </div>
    );
  }

  if (products === undefined) {
    console.log("dev:ShopPage:render - products loading");
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
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
              {products.map((product) => {
                console.log("dev:ShopPage:productRender - rendering product:", product._id, product.name);
                return (
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
                        onClick={() => {
                          console.log("dev:ShopPage:addToBasketClick - add to basket button clicked", product._id);
                          handleAddToBasket(product._id);
                        }}
                        disabled={addingToBasket === product._id}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                      >
                        {addingToBasket === product._id ? "Adding..." : "Add to Basket"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}