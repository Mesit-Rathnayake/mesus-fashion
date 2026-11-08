import { registerSchema, loginSchema } from "./auth.validation.js";
import { registerUser, loginUser } from "./auth.service.js";
import {
    SESSION_COOKIE_NAME,
    SESSION_COOKIE_OPTIONS
} from "./auth.constants.js";
import { revokeSession } from "./session.service.js";

export const registerController = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: validation.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            });
        }

        const user = await registerUser(validation.data);

        return res.status(201).json({
            status: "success",
            message: "Account created successfully",
            data: user
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.statusCode
                ? error.message
                : "Internal server error"
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: validation.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            });
        }

        const { user, session } = await loginUser(validation.data);

        res.cookie(
            SESSION_COOKIE_NAME,
            session.token,
            SESSION_COOKIE_OPTIONS
        );

        return res.status(200).json({
            status: "success",
            message: "Login successful",
            data: { user }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.statusCode
                ? error.message
                : "Internal server error"
        });
    }
};

export const logoutController = async (req, res) => {
    try {
        const token = req.cookies[SESSION_COOKIE_NAME];

        if (token) {
            await revokeSession(token);
        }

        res.clearCookie(SESSION_COOKIE_NAME, {
            httpOnly: SESSION_COOKIE_OPTIONS.httpOnly,
            secure: SESSION_COOKIE_OPTIONS.secure,
            sameSite: SESSION_COOKIE_OPTIONS.sameSite,
            path: SESSION_COOKIE_OPTIONS.path
        });

        return res.status(200).json({
            status: "success",
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
};

export const getMeController = (req, res) => {
    return res.status(200).json({
        status: "success",
        data: {
            user: req.user
        }
    });
};