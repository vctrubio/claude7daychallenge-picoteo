# 🫏 Picoteo - E-commerce MVP

<div align="center">
  <img src="public/donkey.png" alt="Donkey Drills" width="100" height="100">
  <img src="public/claude.png" alt="Claude AI" width="100" height="100">
</div>

## 🥘 What is Picoteo?

**Picoteo** is inspired by the Spanish tradition of "tapas" - a little bit of everything! Just like how Spaniards enjoy small plates of diverse delicious foods, Picoteo aims to be an e-commerce platform targeting local produce and seasonal items. Picoteo will aim to bring community awareness between users and businesses, creating connections that strengthen local economies and foster meaningful relationships between customers and the passionate entrepreneurs in their neighborhoods.

## 👨‍💻 About the Developer

- 🌐 Visit my website: [donkeydrills.com/claude7daychallenge](https://donkeydrills.com/claude7daychallenge)
- 🐦 Follow me on X for documentating my journey: [@donkeydrills](https://x.com/donkeydrills)

## 🤖 Claude 7-Day Challenge

This project is part of the incredible [Claude 7-Day Challenge](https://x.com/alexalbert__/status/1973071320025014306/photo/1) by [@alexalbert\_\_](https://x.com/alexalbert__) - an amazing initiative to explore what's possible when humans and AI collaborate to build real applications in just 7 days!

## ✨ Features

- 🏪 **Multi-Shop Marketplace** - Browse different shops and their products
- 🛒 **Basket Management** - Add products from multiple shops with price calculation
- 👤 **Customer Registration** - Simple onboarding for new customers - via google auth
- 📦 **Order Processing** - Complete checkout flow with order tracking
- 📱 **Responsive Design** - Works perfectly on desktop and mobile - mobile first for customers
- 🎨 **Clean UI** - Built with Tailwind CSS for a modern look

## 🗂 Database Schema

Our application follows this comprehensive schema design (v2):

```mermaid
erDiagram
    USERS {
        string id PK
        string name
        string email
        string phone
        string address
        string role
        number createdAt
    }

    OWNERS {
        string id PK
        string userId FK
        string name
        string email
        string phone
        number createdAt
    }

    SHOPS {
        string id PK
        string ownerId FK
        string name
        string description
        string address
        number createdAt
    }

    PRODUCTS {
        string id PK
        string shopId FK
        string name
        number basePricePerUnit
        string unit
        boolean inStock
        number createdAt
    }

    BASKETS {
        string id PK
        string userId FK
        array products
        number finalPrice
    }

    ORDERS {
        string id PK
        string userId FK
        string basketId FK
        string shopId FK
        string status
        number totalPriceToPay
        number createdAt
    }

    USERS ||--o{ OWNERS : becomes
    OWNERS ||--o{ SHOPS : owns
    SHOPS ||--o{ PRODUCTS : contains
    USERS ||--o{ BASKETS : has
    USERS ||--o{ ORDERS : places
    BASKETS ||--o{ ORDERS : becomes
    SHOPS ||--o{ ORDERS : receives
```

## 🚀 Tech Stack

<div align="center">

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend

![Convex](https://img.shields.io/badge/Convex-FF6B6B?style=for-the-badge&logo=convex&logoColor=white)

### Development

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

</div>

**Why Convex?** 🌟

- **Real-time by default** - Live updates across all connected clients
- **Type-safe** - Full TypeScript support from database to frontend
- **Zero config** - No need to set up complex database infrastructure
- **Optimistic updates** - Instant UI feedback with automatic rollback
- **Built-in auth** - Simple yet powerful authentication system

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── basket/         # Shopping basket
│   │   ├── checkout/       # Order processing
│   │   ├── shops/          # Shop listings & products
│   │   └── order-success/  # Confirmation page
│   ├── components/         # Reusable UI components
│   └── hooks/             # Custom React hooks
├── convex/                # Backend functions & schema
│   ├── schema.ts          # Database schema
│   ├── shops.ts           # Shop queries
│   ├── products.ts        # Product queries
│   ├── baskets.ts         # Basket management
│   ├── orders.ts          # Order processing
│   └── seedData.ts        # Sample data
└── public/               # Static assets
```

## 🌟 Future Enhancements

- 🔍 Product in stock
- 💳 Payment integration (Stripe)
- 📊 Shop owner dashboard
- 🚚 Delivery tracking

## 🤝 Contributing

This project was built as part of a learning challenge, i'll be happy to talk more via a calendy booking on my portfolio donkeydrills - software development for all.

---

<div align="center">
  <p>Built  by <a href="https://donkeydrills.com">DonkeyDrills</a> and Claude AI</p>
  <p>Part of the <a href="https://x.com/alexalbert__/status/1973071320025014306/photo/1">Claude 7-Day Challenge</a></p>
</div>
