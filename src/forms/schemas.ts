import { z } from "zod";

export const createShopSchema = z.object({
  name: z
    .string()
    .min(1, "Shop name is required")
    .min(2, "Shop name must be at least 2 characters")
    .max(50, "Shop name must be less than 50 characters")
    .trim(),
  
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 200 characters")
    .trim(),
  
  address: z
    .string()
    .min(1, "Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be less than 100 characters")
    .trim(),
});

export type CreateShopFormData = z.infer<typeof createShopSchema>;