import { Router } from "express";

import { uploadProductImage } from "../../middleware/upload.middleware.js";
import { uploadProductImageController } from "./upload.controller.js";

import {
    authenticate,
    authorize
} from "../auth/auth.middleware.js";

const router = Router();

router.post(
    "/product-image",
    authenticate,
    authorize("ADMIN"),
    uploadProductImage,
    uploadProductImageController
);

export default router;
