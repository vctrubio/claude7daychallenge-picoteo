import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrder = mutation({
  args: {
    userId: v.id("users"),
    basketId: v.id("baskets"),
    shopId: v.id("shops"),
    totalPriceToPay: v.number(),
  },
  handler: async (ctx, args) => {
    const basket = await ctx.db.get(args.basketId);
    if (!basket) throw new Error("Basket not found");

    // Filter basket products by the specific shop
    const shopProducts = basket.products.filter(async (item) => {
      const product = await ctx.db.get(item.productId);
      return product?.shopId === args.shopId;
    });

    // Resolve the filter promises
    const filteredProducts = [];
    for (const item of basket.products) {
      const product = await ctx.db.get(item.productId);
      if (product?.shopId === args.shopId) {
        filteredProducts.push(item);
      }
    }

    const orderId = await ctx.db.insert("orders", {
      ...args,
      products: filteredProducts,
      status: "proceeding",
      createdAt: Date.now(),
    });

    return orderId;
  },
});

export const clearBasketAfterOrder = mutation({
  args: {
    basketId: v.id("baskets"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.basketId, {
      products: [],
      finalPrice: 0
    });
  },
});

export const getOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;

    const [user, shop] = await Promise.all([
      ctx.db.get(order.userId),
      ctx.db.get(order.shopId)
    ]);

    let basketProducts: any[] = [];
    
    // Handle new orders with products field
    if (order.products && order.products.length > 0) {
      basketProducts = await Promise.all(
        order.products.map(async (item) => {
          const product = await ctx.db.get(item.productId);
          return {
            ...item,
            product
          };
        })
      );
    }
    // Handle old orders - fallback to basket
    else if (order.basketId) {
      const basket = await ctx.db.get(order.basketId);
      if (basket && basket.products) {
        basketProducts = await Promise.all(
          basket.products.map(async (item) => {
            const product = await ctx.db.get(item.productId);
            return {
              ...item,
              product
            };
          })
        );
      }
    }

    return {
      ...order,
      user,
      shop,
      basketProducts
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

        let basketProducts: any[] = [];
        
        // Handle new orders with products field
        if (order.products && order.products.length > 0) {
          basketProducts = await Promise.all(
            order.products.map(async (item) => {
              const product = await ctx.db.get(item.productId);
              return {
                ...item,
                product
              };
            })
          );
        }
        // Handle old orders - fallback to basket
        else if (order.basketId) {
          const basket = await ctx.db.get(order.basketId);
          if (basket && basket.products) {
            basketProducts = await Promise.all(
              basket.products.map(async (item) => {
                const product = await ctx.db.get(item.productId);
                return {
                  ...item,
                  product
                };
              })
            );
          }
        }

        return {
          ...order,
          shop,
          basketProducts
        };
      })
    );

    return ordersWithDetails;
  },
});

export const createPickupOrder = mutation({
  args: {
    userId: v.id("users"),
    ownerId: v.id("owners"),
    shopId: v.id("shops"),
    products: v.array(v.object({
      productId: v.id("products"),
      count: v.number(),
    })),
    totalPriceToPay: v.number(),
    orderType: v.union(v.literal("pickup"), v.literal("delivery")),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      basketId: null as any, // We'll create a temporary basket reference
      shopId: args.shopId,
      products: args.products,
      status: "proceeding",
      totalPriceToPay: args.totalPriceToPay,
      createdAt: Date.now(),
    });

    return orderId;
  },
});