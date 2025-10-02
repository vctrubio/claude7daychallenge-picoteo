import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    console.log("dev:convex:getUser - fetching user", { userId: args.userId });
    const user = await ctx.db.get(args.userId);
    console.log("dev:convex:getUser - result", { user: user ? { id: user._id, role: user.role } : null });
    return user;
  },
});

export const createSimpleUser = mutation({
  args: { role: v.union(v.literal("customer"), v.literal("owner")) },
  handler: async (ctx, args) => {
    console.log("dev:convex:createSimpleUser - creating user", { role: args.role });
    const userId = await ctx.db.insert("users", {
      role: args.role,
      createdAt: Date.now(),
    });
    console.log("dev:convex:createSimpleUser - user created", { userId });
    return userId;
  },
});

export const updateUserRole = mutation({
  args: { 
    userId: v.id("users"),
    role: v.union(v.literal("customer"), v.literal("owner")) 
  },
  handler: async (ctx, args) => {
    console.log("dev:convex:updateUserRole - updating role", { userId: args.userId, role: args.role });
    await ctx.db.patch(args.userId, { role: args.role });
    console.log("dev:convex:updateUserRole - role updated successfully");
    return { success: true };
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.email !== undefined) updates.email = args.email;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.address !== undefined) updates.address = args.address;
    
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.userId, updates);
    }
    
    return await ctx.db.get(args.userId);
  },
});