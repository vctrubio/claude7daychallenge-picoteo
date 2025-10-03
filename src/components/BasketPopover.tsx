"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../hooks/useAuth";
import FormModal from "../forms/FormModal";
import { Id } from "../../convex/_generated/dataModel";
import { ShoppingCart, Plus, Minus, Trash2, Package, X } from "lucide-react";

const useBasketLogic = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const basket = useQuery(api.baskets.getBasket, user ? { userId: user._id } : "skip");
  const updateBasketItem = useMutation(api.baskets.updateBasketItem);
  const removeFromBasket = useMutation(api.baskets.removeFromBasket);
  const clearBasket = useMutation(api.baskets.clearBasket);

  const uniqueItems = basket?.products?.length || 0;
  const totalPrice = basket?.products?.reduce((sum, item) => {
    return sum + (item.product?.basePricePerUnit || 0) * item.count;
  }, 0) || 0;

  const handleUpdateQuantity = async (productId: Id<"products">, newCount: number) => {
    if (!user || newCount <= 0) return;
    await updateBasketItem({ userId: user._id, productId, count: newCount });
  };

  const handleRemoveItem = async (productId: Id<"products">) => {
    if (!user) return;
    await removeFromBasket({ userId: user._id, productId });
  };

  const handleClearBasket = async () => {
    if (!user) return;
    await clearBasket({ userId: user._id });
  };

  const handleCheckout = () => {
    if (!user || !basket || basket.products.length === 0) return;
    window.location.href = '/order-confirmation';
  };

  return {
    isOpen,
    setIsOpen,
    basket,
    uniqueItems,
    totalPrice,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearBasket,
    handleCheckout,
    user
  };
};

const BasketIcon = ({ itemCount, onClick }: { itemCount: number; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors group"
    aria-label={`Shopping basket with ${itemCount} items`}
  >
    <ShoppingCart className="w-6 h-6" />
    {itemCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
        {itemCount > 99 ? '99+' : itemCount}
      </span>
    )}
  </button>
);

const BasketItem = ({ item, onUpdateQuantity, onRemove }: {
  item: any;
  onUpdateQuantity: (productId: Id<"products">, count: number) => void;
  onRemove: (productId: Id<"products">) => void;
}) => {
  const product = item.product;
  const itemTotal = (product?.basePricePerUnit || 0) * item.count;

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-all">
      <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center">
        <Package className="w-7 h-7 text-emerald-600" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-neutral-900 truncate text-base">{product?.name}</h4>
        <p className="text-sm text-neutral-500 mt-0.5">€{product?.basePricePerUnit} per {product?.unit}</p>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className="font-bold text-emerald-600 text-lg">€{itemTotal.toFixed(2)}</div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdateQuantity(item.productId, item.count - 1)}
            className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            disabled={item.count <= 1}
          >
            <Minus className="w-3.5 h-3.5 text-neutral-700" />
          </button>
          
          <span className="w-8 text-center font-semibold text-neutral-900 text-sm">{item.count}</span>
          
          <button
            onClick={() => onUpdateQuantity(item.productId, item.count + 1)}
            className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-700" />
          </button>
          
          <button
            onClick={() => onRemove(item.productId)}
            className="ml-1 p-1 text-red-400 hover:text-red-600 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const BasketModal = ({ isOpen, onClose, basket, onUpdateQuantity, onRemove, onClearBasket, onCheckout, totalPrice }: {
  isOpen: boolean;
  onClose: () => void;
  basket: any;
  onUpdateQuantity: (productId: Id<"products">, count: number) => void;
  onRemove: (productId: Id<"products">) => void;
  onClearBasket: () => void;
  onCheckout: () => void;
  totalPrice: number;
}) => {
  if (!isOpen) return null;

  return (
    <FormModal onClose={onClose} title="Shopping Basket" isSubmitting={false}>
      <div className="max-h-[32rem]">
        {!basket || basket.products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Your basket is empty</h3>
            <p className="text-neutral-500">Add some delicious products to get started!</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 overflow-y-auto max-h-80 pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
              {basket.products.map((item: any) => (
                <BasketItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
              ))}
            </div>
            
            <div className="border-t border-neutral-200 pt-6 mt-6 bg-gradient-to-r from-neutral-50 to-white rounded-lg -mx-6 px-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-neutral-900">Total:</span>
                <span className="text-3xl font-bold text-emerald-600">€{totalPrice.toFixed(2)}</span>
              </div>
              
              <button
                onClick={onClearBasket}
                className="w-full mb-3 bg-neutral-50 border border-neutral-200 text-neutral-600 py-2.5 px-4 rounded-xl font-medium hover:bg-neutral-100 hover:border-neutral-300 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <X className="w-4 h-4" />
                Clear Basket
              </button>
              
              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={basket.products.length === 0}
              >
                Proceed to Checkout
              </button>
              
              <p className="text-xs text-neutral-400 text-center mt-3">
                🔒 Fast & secure checkout
              </p>
            </div>
          </>
        )}
      </div>
    </FormModal>
  );
};

export default function BasketPopover() {
  const {
    isOpen,
    setIsOpen,
    basket,
    uniqueItems,
    totalPrice,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearBasket,
    handleCheckout,
    user
  } = useBasketLogic();

  if (!user) return null;

  return (
    <>
      <BasketIcon itemCount={uniqueItems} onClick={() => setIsOpen(true)} />
      <BasketModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        basket={basket}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveItem}
        onClearBasket={handleClearBasket}
        onCheckout={handleCheckout}
        totalPrice={totalPrice}
      />
    </>
  );
}