/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as baskets from "../baskets.js";
import type * as customers from "../customers.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as seedData from "../seedData.js";
import type * as shops from "../shops.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  baskets: typeof baskets;
  customers: typeof customers;
  orders: typeof orders;
  products: typeof products;
  seedData: typeof seedData;
  shops: typeof shops;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
