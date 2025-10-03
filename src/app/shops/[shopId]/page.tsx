"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "../../../hooks/useAuth";
import { useState, useEffect } from "react";
import ProductCard from "../../../components/ProductCard";
import { MapPin, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

const useShopPageLogic = (shopId: Id<"shops"> | null) => {
  const { user, signIn } = useAuth();
  const products = useQuery(api.products.getProductsByShop, shopId ? { shopId } : "skip");
  const shop = useQuery(api.shops.getShop, shopId ? { shopId } : "skip");
  const addToBasket = useMutation(api.baskets.addToBasket);

  const handleAddToBasket = async (productId: Id<"products">, quantity: number = 1) => {
    if (!user) {
      await signIn();
      return;
    }

    await addToBasket({
      userId: user._id,
      productId,
      count: quantity
    });
  };

  return {
    products,
    shop,
    handleAddToBasket,
    isLoading: products === undefined || shop === undefined
  };
};

const LoadingState = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <p className="text-black/60 text-sm">Loading</p>
    </div>
  </div>
);

const ShopHeader = ({ shop }: { shop: any }) => (
  <div className="pb-16">
    <Link 
      href="/shops" 
      className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors mb-8 group text-sm"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Marketplace
    </Link>
    
    <div className="max-w-2xl">
      <h1 className="text-5xl font-light text-black mb-4 tracking-tight">{shop.name}</h1>
      <div className="flex items-center text-black/60 mb-6 text-sm">
        <MapPin className="w-4 h-4 mr-2" />
        <span>{shop.address}</span>
      </div>
      <p className="text-black/80 text-lg leading-relaxed font-light">
        {shop.description}
      </p>
    </div>
  </div>
);

const EmptyProductsState = () => (
  <div className="text-center py-24">
    <h3 className="text-2xl font-light text-black mb-4">No products available</h3>
    <p className="text-black/60">This shop hasn't added any products yet.</p>
  </div>
);

export default function ShopPage({ params }: { params: Promise<{ shopId: string }> }) {
  const [shopId, setShopId] = useState<Id<"shops"> | null>(null);
  
  useEffect(() => {
    params.then(resolvedParams => {
      setShopId(resolvedParams.shopId as Id<"shops">);
    });
  }, [params]);
  
  const { products, shop, handleAddToBasket, isLoading } = useShopPageLogic(shopId);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {shop && <ShopHeader shop={shop} />}
        
        {products && products.length === 0 ? (
          <EmptyProductsState />
        ) : (
          <div className="space-y-1">
            {products?.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToBasket={handleAddToBasket}
                isLast={index === products.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}