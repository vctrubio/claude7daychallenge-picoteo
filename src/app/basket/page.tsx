"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { useCustomer } from "../../hooks/useCustomer";

export default function BasketPage() {
  const { customerId } = useCustomer();
  const basket = useQuery(
    api.baskets.getBasket,
    customerId ? { customerId } : "skip"
  );

  if (!customerId) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Basket</h1>
          <p className="text-gray-600">
            Please add items to your basket first by visiting a shop.
          </p>
          <Link 
            href="/shops" 
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Shops
          </Link>
        </div>
      </div>
    );
  }

  if (basket === undefined) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  if (!basket || basket.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Basket</h1>
          <p className="text-gray-600 mb-4">Your basket is empty.</p>
          <Link 
            href="/shops" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Shops
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = basket.products.reduce((total, item) => {
    return total + (item.product?.basePricePerUnit || 0) * item.count;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link href="/shops" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Basket</h1>
        </header>

        <main>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4">
              {basket.products.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-4 border-b last:border-b-0">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.product?.name}
                    </h3>
                    <p className="text-gray-600">
                      ${item.product?.basePricePerUnit} per {item.product?.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Quantity: {item.count}</p>
                    <p className="text-lg font-bold text-green-600">
                      ${(item.product?.basePricePerUnit || 0) * item.count}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">${totalPrice}</span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors text-center block"
          >
            Proceed to Checkout
          </Link>
        </main>
      </div>
    </div>
  );
}