"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ShopCard from "../../components/ShopCard";

const useShopsPageLogic = () => {
  const shops = useQuery(api.shops.getShops);
  
  return {
    shops,
    isLoading: shops === undefined
  };
};

const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-emerald-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-neutral-600 font-medium">Loading amazing local shops...</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20">
    <div className="w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
      <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    </div>
    <h3 className="text-2xl font-bold text-neutral-900 mb-2">No shops available yet</h3>
    <p className="text-neutral-600">Check back soon for amazing local businesses!</p>
  </div>
);

export default function ShopsPage() {
  const { shops, isLoading } = useShopsPageLogic();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Local <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-700">Marketplace</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Discover fresh, seasonal products from passionate local businesses in your community
          </p>
        </div>

        {shops && shops.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {shops?.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}