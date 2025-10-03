import { query } from "./_generated/server";
import { v } from "convex/values";

export const getShops = query({
  args: {},
  handler: async (ctx) => {
    const shops = await ctx.db.query("shops").collect();
    
    const shopsWithProductCount = await Promise.all(
      shops.map(async (shop) => {
        const productCount = await ctx.db
          .query("products")
          .filter((q) => q.eq(q.field("shopId"), shop._id))
          .collect()
          .then(products => products.length);
        
        return {
          ...shop,
          productCount
        };
      })
    );
    
    return shopsWithProductCount;
  },
});

export const getShop = query({
  args: { shopId: v.id("shops") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.shopId);
  },
});