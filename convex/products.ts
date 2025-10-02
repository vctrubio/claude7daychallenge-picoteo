import { query } from "./_generated/server";
import { v } from "convex/values";

export const getProductsByShop = query({
  args: { shopId: v.id("shops") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("shopId"), args.shopId))
      .collect();
  },
});