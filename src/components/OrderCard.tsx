"use client";

import { useState } from "react";
import { Package, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface OrderCardProps {
  order: {
    _id: string;
    status: string;
    totalPriceToPay: number;
    createdAt: number;
    shop?: {
      name: string;
      address: string;
    };
    basketProducts?: Array<{
      count: number;
      product?: {
        name: string;
        basePricePerUnit: number;
        unit: string;
      };
    }>;
  };
}

export default function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const totalItems = order.basketProducts?.reduce((sum, item) => sum + item.count, 0) || 0;
  const hasItems = order.basketProducts && order.basketProducts.length > 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-neutral-900">
            Order #{order._id.slice(-8).toUpperCase()}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-600">{orderDate}</span>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          order.status === 'complete' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {order.status === 'complete' ? 'Completed' : 'Processing'}
        </div>
      </div>

      {order.shop && (
        <div className="mb-4 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-500" />
            <div>
              <div className="font-medium text-neutral-900">{order.shop.name}</div>
              <div className="text-sm text-neutral-600">{order.shop.address}</div>
            </div>
          </div>
        </div>
      )}

      {hasItems && (
        <div className="mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between py-2 text-left text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            <span>
              {totalItems} item{totalItems !== 1 ? 's' : ''} • View details
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          {isExpanded && (
            <div className="space-y-3 mt-3 p-4 bg-neutral-50 rounded-lg">
              {order.basketProducts?.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Package className="w-3 h-3 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-900">
                        {item.product?.name || 'Unknown Product'}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 ml-5">
                      €{(item.product?.basePricePerUnit || 0).toFixed(2)} per {item.product?.unit || 'unit'} × {item.count}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-neutral-900">
                    €{((item.product?.basePricePerUnit || 0) * item.count).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
        <div className="text-sm text-neutral-600">
          {hasItems ? `${totalItems} item${totalItems !== 1 ? 's' : ''}` : 'No items'}
        </div>
        <div className="text-xl font-bold text-neutral-900">
          €{order.totalPriceToPay.toFixed(2)}
        </div>
      </div>
    </div>
  );
}