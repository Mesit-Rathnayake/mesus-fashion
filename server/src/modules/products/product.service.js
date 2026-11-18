
import { prisma } from "../../config/prisma.js";

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const handleDatabaseError = (error) => {
    if (error.code === "P2002") {
        throw createError(
            "A product with this slug or SKU already exists",
            409
        );
    }

    if (error.code === "P2025") {
        throw createError("Product or related record not found", 404);
    }

    if (error.code === "P2003") {
        throw createError("One or more category IDs are invalid", 400);
    }

    throw error;
};

const productDetails = {
    categories: {
        include: {
            category: true
        }
    },
    variants: true,
    images: {
        orderBy: {
            sortOrder: "asc"
        }
    }
};

export const getPublishedProducts = async ({
    page,
    limit,
    search,
    category
}) => {
    const where = {
        status: "PUBLISHED"
    };

    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
                description: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        ];
    }

    if (category) {
        where.categories = {
            some: {
                category: {
                    slug: category
                }
            }
        };
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: productDetails,
            orderBy: {
                createdAt: "desc"
            },
            skip: (page - 1) * limit,
            take: limit
        }),

        prisma.product.count({ where })
    ]);

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getPublishedProductBySlug = async (slug) => {
    const product = await prisma.product.findFirst({
        where: {
            slug,
            status: "PUBLISHED"
        },
        include: productDetails
    });

    if (!product) {
        throw createError("Product not found", 404);
    }

    return product;
};

export const createProduct = async (data) => {
    try {
        const { categoryIds, variants, images, ...productData } = data;

        return await prisma.product.create({
            data: {
                ...productData,
                categories: {
                    create: categoryIds.map((categoryId) => ({
                        category: {
                            connect: { id: categoryId }
                        }
                    }))
                },
                variants: {
                    create: variants
                },
                images: {
                    create: images
                },
                publishedAt:
                    productData.status === "PUBLISHED"
                        ? new Date()
                        : null
            },
            include: productDetails
        });
    } catch (error) {
        handleDatabaseError(error);
    }
};

export const updateProduct = async (id, data) => {
    try {
        const { categoryIds, status, ...otherData } = data;

        const updateData = {
            ...otherData
        };

        if (status !== undefined) {
            updateData.status = status;
            updateData.publishedAt =
                status === "PUBLISHED" ? new Date() : null;
        }

        if (categoryIds !== undefined) {
            updateData.categories = {
                deleteMany: {},
                create: categoryIds.map((categoryId) => ({
                    category: {
                        connect: { id: categoryId }
                    }
                }))
            };
        }

        return await prisma.product.update({
            where: { id },
            data: updateData,
            include: productDetails
        });
    } catch (error) {
        handleDatabaseError(error);
    }
};

export const deleteProduct = async (id) => {
    try {
        return await prisma.product.delete({
            where: { id }
        });
    } catch (error) {
        handleDatabaseError(error);
    }
};

