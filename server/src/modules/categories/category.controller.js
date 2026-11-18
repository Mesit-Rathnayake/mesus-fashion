import {
    getCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
} from "./category.service.js";

import {
    createCategorySchema,
    updateCategorySchema,
    categoryIdSchema,
    categorySlugSchema
} from "./category.validation.js";

const sendError = (res, error) => {
    console.error("Category API error:", error);

    return res.status(error.statusCode || 500).json({
        status: "error",
        message: error.statusCode
            ? error.message
            : "Internal server error"
    });
};

export const getCategoriesController = async (req, res) => {
    try {
        const categories = await getCategories();

        return res.status(200).json({
            status: "success",
            data: categories
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const getCategoryBySlugController = async (req, res) => {
    try {
        const validation = categorySlugSchema.safeParse(req.params.slug);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid category slug"
            });
        }

        const category = await getCategoryBySlug(validation.data);

        return res.status(200).json({
            status: "success",
            data: category
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const createCategoryController = async (req, res) => {
    try {
        const validation = createCategorySchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid category data",
                errors: validation.error.issues
            });
        }

        const category = await createCategory(validation.data);

        return res.status(201).json({
            status: "success",
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const updateCategoryController = async (req, res) => {
    try {
        const idValidation = categoryIdSchema.safeParse(req.params.id);

        if (!idValidation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid category ID"
            });
        }

        const bodyValidation = updateCategorySchema.safeParse(req.body);

        if (!bodyValidation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid category data",
                errors: bodyValidation.error.issues
            });
        }

        const category = await updateCategory(
            idValidation.data,
            bodyValidation.data
        );

        return res.status(200).json({
            status: "success",
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const deleteCategoryController = async (req, res) => {
    try {
        const validation = categoryIdSchema.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid category ID"
            });
        }

        await deleteCategory(validation.data);

        return res.status(200).json({
            status: "success",
            message: "Category deleted successfully"
        });
    } catch (error) {
        return sendError(res, error);
    }
};
