import { validateSession } from "./session.service.js";
import { SESSION_COOKIE_NAME } from "./auth.constants.js";

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.[SESSION_COOKIE_NAME];

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
        }

        const session = await validateSession(token);

        if (!session) {
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired session"
            });
        }

        req.user = session.user;
        req.sessionId = session.sessionId;

        next();

    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
};

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: "error",
                message: "You do not have permission to access this resource"
            });
        }

        next();
    };
};

