
import {
    createProduct,
    getPublishedProducts,
    getPublishedProductBySlug,
    updateProduct,
    deleteProduct
} from "./product.service.js";

import {
    createProductSchema,
    updateProductSchema,
    productIdSchema,
    productSlugSchema,
    productQuerySchema
} from "./product.validation.js";

const sendError = (res, error) => {
    console.error("Product API error:", error);

    return res.status(error.statusCode || 500).json({
        status: "error",
        message:
            error.statusCode
                ? error.message
                : "Internal server error"
    });
};

export const getProductsController = async (req, res) => {
    try {
        const validation = productQuerySchema.safeParse(req.query);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid query parameters",
                errors: validation.error.issues
            });
        }

        const result = await getPublishedProducts(validation.data);

        return res.status(200).json({
            status: "success",
            data: result
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const getProductBySlugController = async (req, res) => {
    try {
        const validation = productSlugSchema.safeParse(req.params.slug);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid product slug"
            });
        }

        const product = await getPublishedProductBySlug(validation.data);

        return res.status(200).json({
            status: "success",
            data: { product }
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const createProductController = async (req, res) => {
    try {
        const validation = createProductSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid product data",
                errors: validation.error.issues
            });
        }

        const product = await createProduct(validation.data);

        return res.status(201).json({
            status: "success",
            message: "Product created successfully",
            data: { product }
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const updateProductController = async (req, res) => {
    try {
        const idValidation = productIdSchema.safeParse(req.params.id);

        if (!idValidation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid product ID"
            });
        }

        const bodyValidation = updateProductSchema.safeParse(req.body);

        if (!bodyValidation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid product data",
                errors: bodyValidation.error.issues
            });
        }

        const product = await updateProduct(
            idValidation.data,
            bodyValidation.data
        );

        return res.status(200).json({
            status: "success",
            message: "Product updated successfully",
            data: { product }
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const deleteProductController = async (req, res) => {
    try {
        const validation = productIdSchema.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid product ID"
            });
        }

        await deleteProduct(validation.data);

        return res.status(200).json({
            status: "success",
            message: "Product deleted successfully"
        });
    } catch (error) {
        return sendError(res, error);
    }
};

