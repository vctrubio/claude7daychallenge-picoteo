import { query } from "./_generated/server";
import { v } from "convex/values";

export const getOwnerByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const owner = await ctx.db
      .query("owners")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    
    return owner;
  },
});