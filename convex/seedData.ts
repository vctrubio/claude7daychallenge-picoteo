import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Create users with owner role
    const user1 = await ctx.db.insert("users", {
      name: "John Smith",
      email: "john@example.com",
      phone: "+1234567890",
      role: "owner",
      createdAt: Date.now(),
    });

    const user2 = await ctx.db.insert("users", {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+1234567891",
      role: "owner",
      createdAt: Date.now(),
    });

    // Create owner records linked to users
    const owner1 = await ctx.db.insert("owners", {
      userId: user1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1234567890",
      createdAt: Date.now(),
    });

    const owner2 = await ctx.db.insert("owners", {
      userId: user2,
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+1234567891",
      createdAt: Date.now(),
    });

    const shop1 = await ctx.db.insert("shops", {
      ownerId: owner1,
      name: "Fresh Groceries",
      description: "Your local grocery store with fresh produce and essentials",
      address: "123 Main Street, Downtown",
      createdAt: Date.now(),
    });

    const shop2 = await ctx.db.insert("shops", {
      ownerId: owner2,
      name: "Tech Gadgets",
      description: "Latest technology and gadgets for modern life",
      address: "456 Tech Avenue, Silicon Valley",
      createdAt: Date.now(),
    });

    await ctx.db.insert("products", {
      shopId: shop1,
      name: "Fresh Apples",
      basePricePerUnit: 2.99,
      unit: "lb",
      inStock: true,
      createdAt: Date.now(),
    });

    await ctx.db.insert("products", {
      shopId: shop1,
      name: "Organic Bananas",
      basePricePerUnit: 1.49,
      unit: "bunch",
      inStock: true,
      createdAt: Date.now(),
    });

    await ctx.db.insert("products", {
      shopId: shop1,
      name: "Whole Milk",
      basePricePerUnit: 3.49,
      unit: "gallon",
      inStock: true,
      createdAt: Date.now(),
    });

    await ctx.db.insert("products", {
      shopId: shop2,
      name: "Wireless Headphones",
      basePricePerUnit: 99.99,
      unit: "each",
      inStock: true,
      createdAt: Date.now(),
    });

    await ctx.db.insert("products", {
      shopId: shop2,
      name: "Smartphone Case",
      basePricePerUnit: 19.99,
      unit: "each",
      inStock: true,
      createdAt: Date.now(),
    });

    await ctx.db.insert("products", {
      shopId: shop2,
      name: "USB-C Cable",
      basePricePerUnit: 12.99,
      unit: "each",
      inStock: false,
      createdAt: Date.now(),
    });

    return "Database seeded successfully!";
  },
});

export const clearDatabase = mutation({
  args: {
    tables: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const validTables = ["users", "owners", "shops", "products", "customers", "baskets", "orders"];
    const tablesToClear = args.tables.length === 0 ? validTables : args.tables.filter(table => validTables.includes(table));
    
    for (const tableName of tablesToClear) {
      const records = await ctx.db.query(tableName as any).collect();
      for (const record of records) {
        await ctx.db.delete(record._id);
      }
      console.log(`Cleared ${records.length} records from ${tableName} table`);
    }
    
    return `Database cleared: ${tablesToClear.join(", ")}`;
  },
});