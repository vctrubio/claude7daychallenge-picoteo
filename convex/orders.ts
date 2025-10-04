import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const getOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;

    const [user, shop] = await Promise.all([
      ctx.db.get(order.userId),
      ctx.db.get(order.shopId)
    ]);

    let orderProducts: any[] = [];
    
    if (order.products && order.products.length > 0) {
      orderProducts = await Promise.all(
        order.products.map(async (item) => {
          const product = await ctx.db.get(item.productId);
          return {
            ...item,
            product
          };
        })
      );
    }

    return {
      ...order,
      user,
      shop,
      basketProducts: orderProducts // Keep the same name for compatibility with frontend
    };
  },
});

export const getUserOrders = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const shop = await ctx.db.get(order.shopId);

        let orderProducts: any[] = [];
        
        if (order.products && order.products.length > 0) {
          orderProducts = await Promise.all(
            order.products.map(async (item) => {
              const product = await ctx.db.get(item.productId);
              return {
                ...item,
                product
              };
            })
          );
        }

        return {
          ...order,
          shop,
          basketProducts: orderProducts // Keep the same name for compatibility
        };
      })
    );

    return ordersWithDetails;
  },
});

export const createPickupOrder = mutation({
  args: {
    userId: v.id("users"),
    shopId: v.id("shops"),
    products: v.array(v.object({
      productId: v.id("products"),
      count: v.number(),
    })),
    totalPriceToPay: v.number(),
    orderType: v.union(v.literal("pickup"), v.literal("stripe")),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      shopId: args.shopId,
      products: args.products,
      status: "proceeding",
      totalPriceToPay: args.totalPriceToPay,
      orderType: args.orderType,
      createdAt: Date.now(),
    });

    return orderId;
  },
});