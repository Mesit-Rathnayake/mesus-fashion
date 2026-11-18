import { prisma } from "../../config/prisma.js";

const categoryDetails = {
    _count: {
        select: {
            products: true
        }
    }
};

const handleDatabaseError = (error) => {
    if (error.code === "P2002") {
        const conflictError = new Error(
            "A category with this name or slug already exists"
        );
        conflictError.statusCode = 409;
        throw conflictError;
    }

    if (error.code === "P2025") {
        const notFoundError = new Error("Category not found");
        notFoundError.statusCode = 404;
        throw notFoundError;
    }

    throw error;
};

export const getCategories = async () => {
    return prisma.category.findMany({
        orderBy: {
            name: "asc"
        },
        include: categoryDetails
    });
};

export const getCategoryBySlug = async (slug) => {
    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            ...categoryDetails,
            products: {
                where: {
                    product: {
                        status: "PUBLISHED"
                    }
                },
                include: {
                    product: {
                        include: {
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
                        }
                    }
                }
            }
        }
    });

    if (!category) {
        const error = new Error("Category not found");
        error.statusCode = 404;
        throw error;
    }

    return {
        ...category,
        products: category.products.map((item) => item.product)
    };
};

export const createCategory = async (categoryData) => {
    try {
        return await prisma.category.create({
            data: categoryData,
            include: categoryDetails
        });
    } catch (error) {
        handleDatabaseError(error);
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        return await prisma.category.update({
            where: { id },
            data: categoryData,
            include: categoryDetails
        });
    } catch (error) {
        handleDatabaseError(error);
    }
};

export const deleteCategory = async (id) => {
    try {
        return await prisma.category.delete({
            where: { id }
        });
    } catch (error) {
        handleDatabaseError(error);
    }
};
