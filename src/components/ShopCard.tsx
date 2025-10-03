"use client";

import Link from "next/link";
import { MapPin, Sparkles } from "lucide-react";

interface ShopCardProps {
  shop: {
    _id: string;
    name: string;
    description: string;
    address: string;
    productCount: number;
  };
}

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link
      href={`/shops/${shop._id}`}
      className="group block bg-white rounded-xl p-6 shadow-sm border border-neutral-100 hover:shadow-lg hover:border-neutral-200 transition-all duration-300 max-w-2xl mx-auto"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-lg text-neutral-900 group-hover:text-neutral-700 transition-colors truncate">
          {shop.name}
        </h3>
        <div className="ml-3 px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-xs font-medium text-purple-700 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {shop.productCount}
        </div>
      </div>
      
      <div className="flex items-center text-sm text-neutral-500 mb-2">
        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
        <span className="truncate">{shop.address}</span>
      </div>
      
      <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2">
        {shop.description}
      </p>
    </Link>
  );
}