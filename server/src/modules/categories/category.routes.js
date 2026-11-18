import { Router } from "express";

import {
    getCategoriesController,
    getCategoryBySlugController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController
} from "./category.controller.js";

import {
    authenticate,
    authorize
} from "../auth/auth.middleware.js";

const router = Router();

router.get("/", getCategoriesController);
router.get("/:slug", getCategoryBySlugController);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createCategoryController
);

router.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    updateCategoryController
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteCategoryController
);

export default router;
