"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { ArrowLeft, Package, MapPin, User, CreditCard, CheckCircle } from "lucide-react";
import Link from "next/link";

const useConfirmationLogic = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const basket = useQuery(api.baskets.getBasket, user ? { userId: user._id } : "skip");
  const createOrder = useMutation(api.orders.createOrder);
  const clearBasketAfterOrder = useMutation(api.orders.clearBasketAfterOrder);

  const groupedByShop = basket?.products?.reduce((groups: any, item: any) => {
    const shopId = item.product?.shopId;
    if (!shopId) return groups;
    
    if (!groups[shopId]) {
      groups[shopId] = {
        shop: item.product?.shop,
        items: [],
        total: 0
      };
    }
    
    groups[shopId].items.push(item);
    groups[shopId].total += (item.product?.basePricePerUnit || 0) * item.count;
    
    return groups;
  }, {}) || {};

  const totalPrice = Object.values(groupedByShop).reduce((sum: number, group: any) => sum + group.total, 0);

  const handleConfirmOrder = async () => {
    if (!user || !basket || Object.keys(groupedByShop).length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const shopIds = Object.keys(groupedByShop);
      let lastOrderId = null;
      
      // Create orders for each shop
      for (const shopId of shopIds) {
        const group = groupedByShop[shopId];
        
        const orderId = await createOrder({
          userId: user._id,
          basketId: basket._id,
          shopId: shopId as Id<"shops">,
          totalPriceToPay: group.total,
        });
        
        if (orderId) {
          lastOrderId = orderId;
        }
      }
      
      // Clear the basket after all orders are created
      if (lastOrderId) {
        await clearBasketAfterOrder({ basketId: basket._id });
        router.push(`/order-success?orderId=${lastOrderId}`);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    user,
    basket,
    groupedByShop,
    totalPrice,
    handleConfirmOrder,
    isProcessing,
  };
};

const ShopOrderSection = ({ shopId, group }: { shopId: string; group: any }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-100">
      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
        <MapPin className="w-6 h-6 text-emerald-600" />
      </div>
      <div>
        <h3 className="font-bold text-lg text-neutral-900">{group.shop?.name || 'Shop'}</h3>
        <p className="text-sm text-neutral-600">{group.shop?.address || 'Address not available'}</p>
      </div>
    </div>

    <div className="space-y-3 mb-4">
      {group.items.map((item: any, index: number) => (
        <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-neutral-400" />
            <div>
              <div className="font-medium text-neutral-900">{item.product?.name}</div>
              <div className="text-sm text-neutral-500">
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

    <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
      <span className="font-semibold text-neutral-700">Shop Total:</span>
      <span className="text-xl font-bold text-emerald-600">€{group.total.toFixed(2)}</span>
    </div>
  </div>
);

const CustomerDetails = ({ user }: { user: any }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
        <User className="w-6 h-6 text-neutral-600" />
      </div>
      <h3 className="font-bold text-lg text-neutral-900">Customer Details</h3>
    </div>

    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-neutral-600">Full Name</label>
        <div className="text-neutral-900 font-medium">{user?.name || 'Not provided'}</div>
      </div>
      
      <div>
        <label className="text-sm font-medium text-neutral-600">Email</label>
        <div className="text-neutral-900">{user?.email || 'Not provided'}</div>
      </div>
      
      <div>
        <label className="text-sm font-medium text-neutral-600">Phone</label>
        <div className="text-neutral-900">{user?.phone || 'Not provided'}</div>
      </div>
      
      <div>
        <label className="text-sm font-medium text-neutral-600">Address</label>
        <div className="text-neutral-900">{user?.address || 'Not provided'}</div>
      </div>
    </div>
  </div>
);

const OrderSummary = ({ totalPrice, itemCount }: { totalPrice: number; itemCount: number }) => (
  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
        <CreditCard className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold text-lg text-neutral-900">Order Summary</h3>
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-neutral-700">
        <span>Items ({itemCount})</span>
        <span>€{totalPrice.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-neutral-700">
        <span>Delivery</span>
        <span className="text-emerald-600 font-medium">Free</span>
      </div>
    </div>

    <div className="border-t border-emerald-200 pt-4">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-neutral-900">Total</span>
        <span className="text-3xl font-bold text-emerald-600">€{totalPrice.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

export default function OrderConfirmationPage() {
  const { user, basket, groupedByShop, totalPrice, handleConfirmOrder, isProcessing } = useConfirmationLogic();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please sign in to continue.</p>
          <Link href="/" className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!basket || Object.keys(groupedByShop).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Items to Confirm</h1>
          <p className="text-gray-600 mb-6">Your basket is empty. Add some items before checkout.</p>
          <Link href="/shops" className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const totalItems = Object.values(groupedByShop).reduce((sum: number, group: any) => sum + group.items.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/shops" 
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shopping
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Confirm Your Order</h1>
            <p className="text-gray-600">Review your order details before confirming</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CustomerDetails user={user} />
            
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Order Details by Shop</h2>
              <div className="space-y-4">
                {Object.entries(groupedByShop).map(([shopId, group]) => (
                  <ShopOrderSection key={shopId} shopId={shopId} group={group} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <OrderSummary totalPrice={totalPrice} itemCount={totalItems} />
            
            <button
              onClick={handleConfirmOrder}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Order
                </>
              )}
            </button>
            
            <p className="text-xs text-neutral-500 text-center">
              🔒 By confirming, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}