"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { handleOrderReceipt, sendWhatsAppMessage } from "../../lib/handleOrderReceipt";
import { CreditCard, MessageCircle, Package, MapPin, User, ArrowLeft, X, Eye } from "lucide-react";
import Link from "next/link";

const useCheckoutLogic = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'pickup' | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<{
    receipt: string;
    whatsappUrl: string;
    orderId: string;
  } | null>(null);
  
  // Parse URL params
  const ownerUsername = searchParams.get('owner');
  const productsParam = searchParams.get('products');
  const total = parseFloat(searchParams.get('total') || '0');
  
  // Parse products
  const products = productsParam ? JSON.parse(decodeURIComponent(productsParam)) : [];
  
  // Get owner and shop data
  const owner = useQuery(api.owners.getOwnerByUsername, 
    ownerUsername ? { username: ownerUsername } : "skip"
  );
  const shop = useQuery(api.shops.getShopByOwnerId, 
    owner ? { ownerId: owner._id } : "skip"
  );
  
  const createPickupOrder = useMutation(api.orders.createPickupOrder);

  const handlePickupOrder = async () => {
    if (!user || !owner || !shop) return;
    
    setIsProcessing(true);
    
    try {
      // Store data before clearing URL to prevent data loss
      const orderData = {
        userId: user._id,
        shopId: shop._id,
        products: products.map((p: any) => ({
          productId: p._id,
          count: p.quantity
        })),
        totalPriceToPay: total,
        orderType: "pickup" as const
      };

      const receiptData = {
        products,
        total,
        owner: {
          username: owner.username,
          whatsappApiTlf: owner.whatsappApiTlf
        },
        customer: {
          name: user.name || 'Customer',
          phone: user.phone || 'No phone'
        },
        orderType: 'pickup' as const
      };
      
      // Create order in database
      const orderId = await createPickupOrder(orderData);
      
      // Generate WhatsApp receipt preview
      const receiptResult = await handleOrderReceipt(receiptData);
      
      if (receiptResult.success && receiptResult.receipt && receiptResult.whatsappUrl) {
        // Show receipt preview
        console.log('Setting receipt preview:', { orderId, hasReceipt: !!receiptResult.receipt });
        setReceiptPreview({
          receipt: receiptResult.receipt,
          whatsappUrl: receiptResult.whatsappUrl,
          orderId
        });
      } else {
        console.error('Receipt generation failed:', receiptResult);
        throw new Error(receiptResult.error || 'Failed to generate receipt');
      }
      
    } catch (error) {
      console.error('Failed to create pickup order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmOrderOnly = () => {
    if (receiptPreview) {
      // Clear URL params to prevent back button issues
      router.replace('/checkout');
      // Complete order without sending WhatsApp
      router.push(`/order-success?orderId=${receiptPreview.orderId}`);
    }
  };

  const confirmWithWhatsApp = () => {
    if (receiptPreview) {
      // Clear URL params to prevent back button issues
      router.replace('/checkout');
      sendWhatsAppMessage(receiptPreview.whatsappUrl);
      router.push(`/order-success?orderId=${receiptPreview.orderId}`);
    }
  };

  const handleStripePayment = async () => {
    if (!user || !owner || !shop) return;
    
    setIsProcessing(true);
    
    try {
      // Create order in database
      const orderId = await createPickupOrder({
        userId: user._id,
        shopId: shop._id,
        products: products.map((p: any) => ({
          productId: p._id,
          count: p.quantity
        })),
        totalPriceToPay: total,
        orderType: "stripe"
      });
      
      // Handle Stripe payment transaction
      const { handleOrderTransaction } = await import('../../lib/handleOrderTransaction');
      
      const result = await handleOrderTransaction({
        orderId,
        products,
        total,
        owner: {
          username: owner.username,
          whatsappApiTlf: owner.whatsappApiTlf
        },
        customer: {
          name: user.name || 'Customer',
          phone: user.phone || 'No phone'
        }
      });
      
      if (result.success) {
        // Redirect to success page
        router.push(`/order-success?orderId=${orderId}`);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
      
    } catch (error) {
      console.error('Failed to process Stripe payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    user,
    owner,
    shop,
    products,
    total,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    handlePickupOrder,
    handleStripePayment,
    ownerUsername,
    receiptPreview,
    confirmOrderOnly,
    confirmWithWhatsApp,
    setReceiptPreview
  };
};

const OrderSummary = ({ products, total }: { products: any[]; total: number }) => (
  <div className="bg-gradient-to-br from-white to-neutral-50 rounded-2xl p-8 shadow-lg border border-neutral-100">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
        <Package className="w-6 h-6 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-neutral-900">Order Summary</h2>
    </div>
    
    <div className="space-y-4 mb-6">
      {products.map((product, index) => (
        <div key={index} className="flex justify-between items-center py-3 border-b border-neutral-100 last:border-b-0">
          <div>
            <h3 className="font-semibold text-neutral-900">{product.name}</h3>
            <p className="text-sm text-neutral-600">
              €{product.basePricePerUnit} per {product.unit} × {product.quantity}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-neutral-900">
              €{(product.basePricePerUnit * product.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
    
    <div className="border-t border-neutral-200 pt-6">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-neutral-900">Total</span>
        <span className="text-3xl font-bold text-emerald-600">€{total.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

const PaymentMethods = ({ 
  paymentMethod, 
  setPaymentMethod, 
  onStripePayment, 
  onPickupOrder, 
  isProcessing,
  total 
}: {
  paymentMethod: string | null;
  setPaymentMethod: (method: 'stripe' | 'pickup') => void;
  onStripePayment: () => void;
  onPickupOrder: () => void;
  isProcessing: boolean;
  total: number;
}) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-100">
    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Choose Payment Method</h2>
    
    <div className="space-y-4 mb-8">
      {/* Stripe Payment Option */}
      <button
        onClick={() => setPaymentMethod('stripe')}
        className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
          paymentMethod === 'stripe'
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-neutral-200 hover:border-neutral-300'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            paymentMethod === 'stripe' ? 'bg-emerald-600' : 'bg-neutral-100'
          }`}>
            <CreditCard className={`w-6 h-6 ${
              paymentMethod === 'stripe' ? 'text-white' : 'text-neutral-600'
            }`} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-neutral-900">Pay with Stripe</h3>
            <p className="text-neutral-600">Secure online payment with card</p>
          </div>
        </div>
      </button>

      {/* Pickup Payment Option */}
      <button
        onClick={() => setPaymentMethod('pickup')}
        className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
          paymentMethod === 'pickup'
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-neutral-200 hover:border-neutral-300'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            paymentMethod === 'pickup' ? 'bg-emerald-600' : 'bg-neutral-100'
          }`}>
            <MessageCircle className={`w-6 h-6 ${
              paymentMethod === 'pickup' ? 'text-white' : 'text-neutral-600'
            }`} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-neutral-900">Pickup & Pay in Person</h3>
            <p className="text-neutral-600">Order via WhatsApp, pay when you collect</p>
          </div>
        </div>
      </button>
    </div>
    
    {/* Action Button */}
    {paymentMethod && (
      <button
        onClick={paymentMethod === 'stripe' ? onStripePayment : onPickupOrder}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </>
        ) : paymentMethod === 'stripe' ? (
          <>
            <CreditCard className="w-5 h-5" />
            Pay €{total.toFixed(2)} with Stripe
          </>
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            Send Order via WhatsApp
          </>
        )}
      </button>
    )}
  </div>
);

const ReceiptPreview = ({ 
  receiptPreview, 
  onConfirmOnly,
  onConfirmWithWhatsApp,
  onCancel 
}: {
  receiptPreview: {
    receipt: string;
    whatsappUrl: string;
    orderId: string;
  };
  onConfirmOnly: () => void;
  onConfirmWithWhatsApp: () => void;
  onCancel: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Order Created - Receipt Preview</h2>
        </div>
        <button
          onClick={onCancel}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6 overflow-y-auto flex-1">
        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
          {receiptPreview.receipt}
        </pre>
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-gray-600 text-center">
          Your order has been created successfully. Choose how to proceed:
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          
          <button
            onClick={onConfirmOnly}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            ✅ Complete Order
          </button>
          
          <button
            onClick={onConfirmWithWhatsApp}
            className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Send WhatsApp
          </button>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>• <strong>Complete Order:</strong> Finish without sending WhatsApp notification</p>
          <p>• <strong>Send WhatsApp:</strong> Open WhatsApp with pre-filled message to shop owner</p>
        </div>
      </div>
    </div>
  </div>
);

function CheckoutPageContent() {
  const {
    user,
    owner,
    shop,
    products,
    total,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    handlePickupOrder,
    handleStripePayment,
    ownerUsername,
    receiptPreview,
    confirmOrderOnly,
    confirmWithWhatsApp,
    setReceiptPreview
  } = useCheckoutLogic();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-emerald-50 flex items-center justify-center p-8">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <User className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Sign In Required</h1>
          <p className="text-neutral-600 mb-6">Please sign in to complete your order</p>
          <Link 
            href="/" 
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-emerald-50 flex items-center justify-center p-8">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">No Items to Checkout</h1>
          <p className="text-neutral-600 mb-6">Your cart appears to be empty</p>
          <Link 
            href="/" 
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href={ownerUsername ? `/${ownerUsername}` : '/'}
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Complete Your Order
            </h1>
            <p className="text-xl text-neutral-600">
              Choose your preferred payment method
            </p>
          </div>
        </div>

        {/* Shop Info */}
        {shop && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{shop.name}</h2>
                <p className="text-neutral-600">{shop.address}</p>
                <p className="text-sm text-emerald-600">@{ownerUsername}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <OrderSummary products={products} total={total} />
          </div>
          
          <div>
            <PaymentMethods
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onStripePayment={handleStripePayment}
              onPickupOrder={handlePickupOrder}
              isProcessing={isProcessing}
              total={total}
            />
          </div>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      {receiptPreview && (
        <>
          {console.log('Rendering receipt preview modal:', receiptPreview)}
          <ReceiptPreview
            receiptPreview={receiptPreview}
            onConfirmOnly={confirmOrderOnly}
            onConfirmWithWhatsApp={confirmWithWhatsApp}
            onCancel={() => setReceiptPreview(null)}
          />
        </>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-emerald-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}