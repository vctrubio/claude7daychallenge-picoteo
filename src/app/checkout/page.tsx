"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { useCustomer } from "../../hooks/useCustomer";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { customerId } = useCustomer();
  const router = useRouter();
  const basket = useQuery(
    api.baskets.getBasket,
    customerId ? { customerId } : "skip"
  );
  const createOrder = useMutation(api.orders.createOrder);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!customerId) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-gray-600">
            Please add items to your basket first.
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
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

  const shopId = basket.products[0]?.product?.shopId;

  const handleCheckout = async () => {
    if (!shopId) return;
    
    setIsProcessing(true);
    try {
      await createOrder({
        customerId,
        basketId: basket._id,
        shopId,
        totalPriceToPay: totalPrice,
      });
      
      router.push("/order-success");
    } catch (error) {
      console.error("Checkout failed:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link href="/basket" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Basket
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {basket.products.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.product?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ${item.product?.basePricePerUnit} × {item.count}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.product?.basePricePerUnit || 0) * item.count}
                  </p>
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

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Complete Your Order</h2>
            <p className="text-gray-600 mb-6">
              Review your order details and click the button below to place your order.
            </p>
            
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : `Place Order - $${totalPrice}`}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              By placing this order, you agree to our terms and conditions.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}