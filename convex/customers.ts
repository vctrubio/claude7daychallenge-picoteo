import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createCustomer = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    address: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("customers", {
      ...args,
      createdAt: Date.now(),
    });
  },
});