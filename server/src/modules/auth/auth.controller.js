import { registerSchema } from "./auth.validation.js";
import { registerUser } from "./auth.service.js";

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