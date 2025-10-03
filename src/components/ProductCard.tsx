"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

interface ProductCardProps {
  product: {
    _id: Id<"products">;
    name: string;
    basePricePerUnit: number;
    unit: string;
    inStock: boolean;
  };
  onAddToBasket: (productId: Id<"products">, quantity: number) => void;
  isLast?: boolean;
}

export default function ProductCard({ product, onAddToBasket, isLast }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const totalPrice = product.basePricePerUnit * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToBasket = async () => {
    if (!product.inStock) return;
    
    setIsAdding(true);
    await onAddToBasket(product._id, quantity);
    
    setQuantity(1);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  return (
    <div className={`py-8 ${!isLast ? 'border-b border-black/10' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-light text-black mb-2 tracking-tight">
            {product.name}
          </h3>
          <div className="text-black/60 text-lg font-light">
            €{product.basePricePerUnit} per {product.unit}
          </div>
        </div>

        {product.inStock ? (
          <div className="flex items-center gap-8">
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <Minus className="w-4 h-4 text-black" />
              </button>
              
              <div className="mx-6 text-center min-w-[60px]">
                <div className="text-2xl font-light text-black">{quantity}</div>
                <div className="text-xs text-black/60 uppercase tracking-wider mt-1">
                  {quantity === 1 ? product.unit : `${product.unit}s`}
                </div>
              </div>
              
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 99}
                className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <Plus className="w-4 h-4 text-black" />
              </button>
            </div>

            <div className="text-right min-w-[100px]">
              <div className="text-3xl font-light text-black">€{totalPrice.toFixed(2)}</div>
            </div>

            <button
              onClick={handleAddToBasket}
              disabled={isAdding}
              className={`
                px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center gap-3
                ${isAdding 
                  ? 'bg-black text-white scale-95' 
                  : 'bg-black text-white hover:bg-black/90 hover:scale-105 active:scale-95'
                }
              `}
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-black/40 font-light">
            Unavailable
          </div>
        )}
      </div>
    </div>
  );
}