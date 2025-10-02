import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createOrder = mutation({
  args: {
    customerId: v.id("customers"),
    basketId: v.id("baskets"),
    shopId: v.id("shops"),
    totalPriceToPay: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", {
      ...args,
      status: "proceeding",
      createdAt: Date.now(),
    });
  },
});