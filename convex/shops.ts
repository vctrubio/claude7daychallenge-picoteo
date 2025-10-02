import { query } from "./_generated/server";

export const getShops = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("shops").collect();
  },
});