
import { z } from "zod";

const productStatusSchema = z.enum([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED"
]);

const variantSchema = z.object({
    sku: z.string().trim().min(1).max(100),
    size: z.string().trim().max(50).optional(),
    color: z.string().trim().max(50).optional(),
    price: z.number().positive(),
    compareAtPrice: z.number().positive().nullable().optional(),
    stockQuantity: z.number().int().min(0).default(0)
}).strict();

const imageSchema = z.object({
    imageUrl: z.string().url(),
    altText: z.string().trim().max(255).optional(),
    sortOrder: z.number().int().min(0).default(0),
    isPrimary: z.boolean().default(false)
}).strict();

export const createProductSchema = z.object({
    name: z.string().trim().min(2).max(150),
    slug: z.string().trim().min(2).max(180)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().trim().max(5000).optional(),
    status: productStatusSchema.optional(),
    categoryIds: z.array(z.string().uuid()).default([]),
    variants: z.array(variantSchema).default([]),
    images: z.array(imageSchema).default([])
}).strict();

export const updateProductSchema = z.object({
    name: z.string().trim().min(2).max(150).optional(),
    slug: z.string().trim().min(2).max(180)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    description: z.string().trim().max(5000).nullable().optional(),
    status: productStatusSchema.optional(),
    categoryIds: z.array(z.string().uuid()).optional()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
);

export const productIdSchema = z.string().uuid();

export const productSlugSchema = z.string().min(1);

export const productQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
    search: z.string().trim().optional(),
    category: z.string().trim().optional()
});
