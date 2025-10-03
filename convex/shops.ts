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

export const getAllShopsWithOwners = query({
  args: {},
  handler: async (ctx) => {
    const shops = await ctx.db.query("shops").collect();
    
    return Promise.all(shops.map(async (shop) => {
      const owner = await ctx.db.get(shop.ownerId);
      
      return {
        shop,
        owner
      };
    }));
  },
});

export const getShop = query({
  args: { shopId: v.id("shops") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.shopId);
  },
});

export const getShopByOwnerId = query({
  args: { ownerId: v.id("owners") },
  handler: async (ctx, args) => {
    const shop = await ctx.db
      .query("shops")
      .filter((q) => q.eq(q.field("ownerId"), args.ownerId))
      .first();
    
    return shop;
  },
});