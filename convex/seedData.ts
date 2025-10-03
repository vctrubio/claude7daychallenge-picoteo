import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { faker } from "@faker-js/faker";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Create owner users
    const ownerUsers = [];
    for (let i = 0; i < 4; i++) {
      const ownerUser = await ctx.db.insert("users", {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number("+1##########"),
        address: faker.location.streetAddress({ useFullAddress: true }),
        role: "owner",
        createdAt: Date.now() - faker.number.int({ min: 1000000, max: 10000000 }),
      });
      ownerUsers.push(ownerUser);
    }

    // Create customer users  
    const customerUsers = [];
    for (let i = 0; i < 8; i++) {
      const customerUser = await ctx.db.insert("users", {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number("+1##########"),
        address: faker.location.streetAddress({ useFullAddress: true }),
        role: "customer",
        createdAt: Date.now() - faker.number.int({ min: 1000000, max: 10000000 }),
      });
      customerUsers.push(customerUser);
    }

    // Create owner records
    const owners = [];
    for (const ownerUser of ownerUsers) {
      const owner = await ctx.db.insert("owners", {
        userId: ownerUser,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number("+1##########"),
        createdAt: Date.now() - faker.number.int({ min: 1000000, max: 10000000 }),
      });
      owners.push(owner);
    }

    // Shop categories and products
    const shopData = [
      {
        name: "Fresh Farm Market",
        description: "Organic seasonal produce directly from local farms",
        products: [
          { name: "Organic Apples", price: 4.99, unit: "lb" },
          { name: "Fresh Bananas", price: 2.49, unit: "bunch" },
          { name: "Baby Spinach", price: 3.99, unit: "bag" },
          { name: "Cherry Tomatoes", price: 5.99, unit: "pint" },
          { name: "Sweet Potatoes", price: 2.99, unit: "lb" },
        ]
      },
      {
        name: "Artisan Bakery",
        description: "Handcrafted breads and pastries made fresh daily",
        products: [
          { name: "Sourdough Bread", price: 6.50, unit: "loaf" },
          { name: "Croissants", price: 3.25, unit: "each" },
          { name: "Blueberry Muffins", price: 2.75, unit: "each" },
          { name: "Whole Wheat Bagels", price: 1.50, unit: "each" },
        ]
      },
      {
        name: "Garden Herbs & Spices",
        description: "Fresh herbs and premium spices for your culinary adventures",
        products: [
          { name: "Fresh Basil", price: 2.99, unit: "bunch" },
          { name: "Organic Rosemary", price: 3.49, unit: "bunch" },
          { name: "Himalayan Salt", price: 8.99, unit: "jar" },
          { name: "Black Pepper", price: 12.99, unit: "jar" },
        ]
      },
      {
        name: "Local Dairy Co-op",
        description: "Fresh dairy products from pasture-raised cows",
        products: [
          { name: "Whole Milk", price: 4.99, unit: "gallon" },
          { name: "Greek Yogurt", price: 6.49, unit: "container" },
          { name: "Aged Cheddar", price: 12.99, unit: "block" },
          { name: "Farm Fresh Eggs", price: 5.99, unit: "dozen" },
        ]
      }
    ];

    // Create shops and products
    const shops = [];
    const allProducts = [];
    
    for (let i = 0; i < shopData.length; i++) {
      const data = shopData[i];
      const shop = await ctx.db.insert("shops", {
        ownerId: owners[i],
        name: data.name,
        description: data.description,
        address: faker.location.streetAddress({ useFullAddress: true }),
        createdAt: Date.now() - faker.number.int({ min: 500000, max: 5000000 }),
      });
      shops.push(shop);

      // Create products for this shop
      for (const productData of data.products) {
        const product = await ctx.db.insert("products", {
          shopId: shop,
          name: productData.name,
          basePricePerUnit: productData.price,
          unit: productData.unit,
          inStock: faker.datatype.boolean(0.9), // 90% chance in stock
          createdAt: Date.now() - faker.number.int({ min: 100000, max: 2000000 }),
        });
        allProducts.push(product);
      }
    }

    // Create baskets for customers with products
    const baskets = [];
    for (let i = 0; i < 5; i++) { // Create 5 customers with baskets
      const customerUser = customerUsers[i];
      
      // Select 2-4 random products for basket
      const basketProductCount = faker.number.int({ min: 2, max: 4 });
      const selectedProducts = faker.helpers.arrayElements(allProducts, basketProductCount);
      
      const basketProducts = selectedProducts.map(product => ({
        productId: product,
        count: faker.number.int({ min: 1, max: 3 })
      }));

      const totalPrice = basketProducts.reduce((sum, item) => {
        // We'll calculate this approximately since we don't have product details here
        return sum + (faker.number.float({ min: 5, max: 50 }) * item.count);
      }, 0);

      const basket = await ctx.db.insert("baskets", {
        userId: customerUser,
        products: basketProducts,
        finalPrice: totalPrice,
      });
      baskets.push(basket);
    }

    // Create sample orders to test the checkout flow
    for (let i = 0; i < 3; i++) {
      const customerUser = customerUsers[i + 5]; // Use different customers for orders
      const randomShop = faker.helpers.arrayElement(shops);
      
      // Get products from this shop
      const shopProducts = allProducts.filter(async (product) => {
        // This is approximate since we can't easily filter in seed
        return faker.datatype.boolean(0.3); // 30% chance this product is from our shop
      });
      
      // Create order products
      const orderProducts = [];
      for (let j = 0; j < faker.number.int({ min: 1, max: 3 }); j++) {
        const randomProduct = faker.helpers.arrayElement(allProducts);
        orderProducts.push({
          productId: randomProduct,
          count: faker.number.int({ min: 1, max: 2 })
        });
      }

      const totalPrice = faker.number.float({ min: 15, max: 120, fractionDigits: 2 });

      await ctx.db.insert("orders", {
        userId: customerUser,
        basketId: baskets[0], // Reference a basket (even if cleared)
        shopId: randomShop,
        status: faker.helpers.arrayElement(["proceeding", "complete"]),
        totalPriceToPay: totalPrice,
        products: orderProducts,
        createdAt: Date.now() - faker.number.int({ min: 86400000, max: 604800000 }), // 1-7 days ago
      });
    }

    return `Database seeded successfully! Created:
    - ${ownerUsers.length} owner users
    - ${customerUsers.length} customer users  
    - ${owners.length} owners
    - ${shops.length} shops
    - ${allProducts.length} products
    - ${baskets.length} baskets
    - 3 sample orders`;
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