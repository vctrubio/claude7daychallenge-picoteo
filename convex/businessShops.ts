import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createShop = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    description: v.string(),
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || user.role !== "owner") {
      throw new Error("Only business owners can create shops");
    }
    
    // Find or create the owner record for this user
    let owner = await ctx.db
      .query("owners")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    
    if (!owner) {
      // Create owner record if it doesn't exist
      const ownerId = await ctx.db.insert("owners", {
        userId: args.userId,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        createdAt: Date.now(),
      });
      owner = await ctx.db.get(ownerId);
    }
    
    return await ctx.db.insert("shops", {
      ownerId: owner!._id,
      name: args.name,
      description: args.description,
      address: args.address,
      createdAt: Date.now(),
    });
  },
});

export const getMyShops = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Find the owner record for this user
    const owner = await ctx.db
      .query("owners")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    
    if (!owner) {
      return [];
    }
    
    return await ctx.db
      .query("shops")
      .filter((q) => q.eq(q.field("ownerId"), owner._id))
      .collect();
  },
});