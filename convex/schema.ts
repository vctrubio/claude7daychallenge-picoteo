import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    role: v.union(v.literal("customer"), v.literal("owner")),
    createdAt: v.number(),
  }),
  owners: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    createdAt: v.number(),
  }),

  shops: defineTable({
    ownerId: v.id("owners"),
    name: v.string(),
    description: v.string(),
    address: v.string(),
    createdAt: v.number(),
  }),

  products: defineTable({
    shopId: v.id("shops"),
    name: v.string(),
    basePricePerUnit: v.number(),
    unit: v.string(),
    inStock: v.boolean(),
    createdAt: v.number(),
  }),

  customers: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    address: v.string(),
    createdAt: v.number(),
  }),

  baskets: defineTable({
    userId: v.id("users"),
    products: v.array(v.object({
      productId: v.id("products"),
      count: v.number(),
    })),
    finalPrice: v.number(),
  }),

  orders: defineTable({
    userId: v.id("users"),
    basketId: v.id("baskets"),
    shopId: v.id("shops"),
    status: v.union(v.literal("proceeding"), v.literal("complete")),
    totalPriceToPay: v.number(),
    createdAt: v.number(),
  }),
});