import { Router } from "express";
import {
    registerController,
    loginController,
    logoutController,
    getMeController
} from "./auth.controller.js";

import {
    authenticate
} from "./auth.middleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);

router.get("/me", authenticate, getMeController);

export default router;