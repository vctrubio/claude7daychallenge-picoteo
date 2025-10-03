"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { CheckCircle, Package, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Id } from "../../../convex/_generated/dataModel";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') as Id<"orders"> | null;
  
  const order = useQuery(api.orders.getOrder, orderId ? { orderId } : "skip");
  
  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-emerald-50 flex items-center justify-center p-8">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Order Not Found</h1>
          <Link href="/" className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-emerald-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-emerald-50">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-emerald-300 rounded-full mx-auto animate-ping opacity-25"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-neutral-600 mb-6">
            Thank you for your order. We&apos;ve sent the details to the business owner.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-100 mb-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Order Details</h3>
              <p className="text-neutral-600">Order #{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-600">€{order.totalPriceToPay.toFixed(2)}</div>
              <div className="text-sm text-neutral-500">
                {order.basketProducts?.length || 0} items
              </div>
            </div>
          </div>

          {/* Shop Info */}
          {order.shop && (
            <div className="mb-6">
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">{order.shop.name}</h4>
                  <p className="text-neutral-600">{order.shop.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          {order.basketProducts && order.basketProducts.length > 0 && (
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Items Ordered</h4>
              <div className="space-y-3">
                {order.basketProducts.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-neutral-400" />
                      <div>
                        <div className="font-medium text-neutral-900">{item.product?.name}</div>
                        <div className="text-sm text-neutral-600">
                          €{(item.product?.basePricePerUnit || 0).toFixed(2)} per {item.product?.unit}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-neutral-900">Qty: {item.count}</div>
                      <div className="text-sm text-emerald-600 font-medium">
                        €{((item.product?.basePricePerUnit || 0) * item.count).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">What happens next?</h3>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">WhatsApp Sent</h4>
              <p className="text-emerald-100 text-sm">Business owner receives your order details</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Order Preparation</h4>
              <p className="text-emerald-100 text-sm">Your items are being prepared</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Pickup & Pay</h4>
              <p className="text-emerald-100 text-sm">Collect your order and pay in person</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            Continue Shopping
          </Link>
          <Link 
            href="/" 
            className="bg-white text-neutral-700 border-2 border-neutral-200 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-50 transition-all text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-emerald-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}