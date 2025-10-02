import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addToBasket = mutation({
  args: { 
    userId: v.id("users"),
    productId: v.id("products"),
    count: v.number()
  },
  handler: async (ctx, args) => {
    const existingBasket = await ctx.db
      .query("baskets")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingBasket) {
      const existingProductIndex = existingBasket.products.findIndex(
        (p) => p.productId === args.productId
      );

      if (existingProductIndex !== -1) {
        const updatedProducts = [...existingBasket.products];
        updatedProducts[existingProductIndex].count += args.count;
        
        await ctx.db.patch(existingBasket._id, {
          products: updatedProducts
        });
      } else {
        await ctx.db.patch(existingBasket._id, {
          products: [...existingBasket.products, { productId: args.productId, count: args.count }]
        });
      }
    } else {
      await ctx.db.insert("baskets", {
        userId: args.userId,
        products: [{ productId: args.productId, count: args.count }],
        finalPrice: 0
      });
    }
  },
});

export const getBasket = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const basket = await ctx.db
      .query("baskets")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!basket) return null;

    const basketWithProducts = await Promise.all(
      basket.products.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product
        };
      })
    );

    return {
      ...basket,
      products: basketWithProducts
    };
  },
});