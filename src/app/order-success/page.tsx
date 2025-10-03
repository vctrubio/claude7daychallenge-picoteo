"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Id } from "../../../convex/_generated/dataModel";
import { Suspense } from "react";

const useOrderSuccessLogic = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') as Id<"orders"> | null;
  
  const order = useQuery(api.orders.getOrder, orderId ? { orderId } : "skip");
  
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  const totalItems = order?.basketProducts?.reduce((sum, item) => sum + item.count, 0) || 0;

  return {
    order,
    orderId,
    orderDate,
    totalItems
  };
};

const SuccessAnimation = () => (
  <div className="relative">
    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <div className="absolute inset-0 w-24 h-24 bg-emerald-300 rounded-full mx-auto animate-ping opacity-25"></div>
  </div>
);

const OrderSummaryCard = ({ order, totalItems }: { order: any; totalItems: number }) => (
  <div className="bg-gradient-to-br from-white to-neutral-50 rounded-2xl p-8 shadow-xl border border-neutral-100 mb-8">
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
      <div>
        <h3 className="text-xl font-bold text-neutral-900">Order Summary</h3>
        <p className="text-neutral-600">Order #{order._id.slice(-8).toUpperCase()}</p>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-emerald-600">€{order.totalPriceToPay.toFixed(2)}</div>
        <div className="text-sm text-neutral-500">{totalItems} items</div>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div>
        <h4 className="font-semibold text-neutral-900 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Shop Details
        </h4>
        <div className="bg-neutral-50 rounded-lg p-4">
          <div className="font-medium text-neutral-900">{order.shop?.name}</div>
          <div className="text-sm text-neutral-600">{order.shop?.address}</div>
          <div className="text-xs text-neutral-500 mt-1">{order.shop?.description}</div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-neutral-900 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Customer
        </h4>
        <div className="bg-neutral-50 rounded-lg p-4">
          <div className="font-medium text-neutral-900">{order.user?.name || 'Customer'}</div>
          <div className="text-sm text-neutral-600">{order.user?.email}</div>
          <div className="text-xs text-neutral-500 mt-1">ID: {order.user?._id.slice(-8)}</div>
        </div>
      </div>
    </div>

    <div>
      <h4 className="font-semibold text-neutral-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        Items Ordered
      </h4>
      <div className="space-y-3">
        {order.basketProducts?.map((item: any) => (
          <div key={item.productId} className="flex items-center justify-between bg-neutral-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-neutral-900">{item.product?.name}</div>
                <div className="text-sm text-neutral-600">€{item.product?.basePricePerUnit} per {item.product?.unit}</div>
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
  </div>
);

const StatusBadge = ({ status }: { status: string }) => (
  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
    status === 'proceeding' 
      ? 'bg-yellow-100 text-yellow-800' 
      : 'bg-emerald-100 text-emerald-800'
  }`}>
    <div className={`w-2 h-2 rounded-full mr-2 ${
      status === 'proceeding' ? 'bg-yellow-500' : 'bg-emerald-500'
    }`}></div>
    {status === 'proceeding' ? 'Processing' : 'Complete'}
  </div>
);

const ActionButtons = () => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center">
    <Link 
      href="/shops" 
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
);

function OrderSuccessContent() {
  const { order, orderId, orderDate, totalItems } = useOrderSuccessLogic();

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-emerald-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">No Order Found</h1>
          <p className="text-neutral-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link href="/shops" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <SuccessAnimation />
          
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-neutral-600 mb-6">
            Thank you for choosing Picoteo. Your order has been successfully placed and is being processed.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <StatusBadge status={order.status} />
            <div className="text-neutral-500">
              Placed on {orderDate}
            </div>
          </div>
        </div>

        <OrderSummaryCard order={order} totalItems={totalItems} />

        <div className="bg-gradient-to-r from-emerald-600 to-neutral-700 rounded-2xl p-8 text-white text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">What happens next?</h3>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-1">Order Processing</h4>
              <p className="text-emerald-100 text-sm">We're preparing your items</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-1">Shop Notification</h4>
              <p className="text-emerald-100 text-sm">Local shop gets your order</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-1">Delivery</h4>
              <p className="text-emerald-100 text-sm">Fresh products to your door</p>
            </div>
          </div>
        </div>

        <ActionButtons />
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}