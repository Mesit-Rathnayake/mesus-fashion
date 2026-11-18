import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().trim().min(2).max(100),
    slug: z.string().trim().min(2).max(120)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().trim().max(1000).optional()
}).strict();

export const updateCategorySchema = z.object({
    name: z.string().trim().min(2).max(100).optional(),
    slug: z.string().trim().min(2).max(120)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    description: z.string().trim().max(1000).nullable().optional()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
);

export const categoryIdSchema = z.string().uuid();

export const categorySlugSchema = z.string()
    .trim()
    .min(1);
