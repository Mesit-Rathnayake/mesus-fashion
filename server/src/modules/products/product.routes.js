import { Router } from "express";

import {
    getProductsController,
    getProductBySlugController,
    createProductController,
    updateProductController,
    deleteProductController
} from "./product.controller.js";

import {
    attachProductImageController,
    deleteProductImageController
} from "../uploads/upload.controller.js";

import {
    handleProductImageUpload
} from "../../middleware/upload.middleware.js";

import {
    authenticate,
    authorize
} from "../auth/auth.middleware.js";

const router = Router();

// Public storefront routes
router.get("/", getProductsController);
router.get("/:slug", getProductBySlugController);

// Admin-only product management routes
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createProductController
);

router.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    updateProductController
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteProductController
);

router.post(
    "/:id/images",
    authenticate,
    authorize("ADMIN"),
    handleProductImageUpload,
    attachProductImageController
);

router.delete(
    "/:productId/images/:imageId",
    authenticate,
    authorize("ADMIN"),
    deleteProductImageController
);

export default router;
