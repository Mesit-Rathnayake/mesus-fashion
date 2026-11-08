
import crypto from "node:crypto";
import { prisma } from "../../config/prisma.js";

const SESSION_DURATION_DAYS = 7;

const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

export const createSession = async (userId) => {
    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = hashToken(token);

    const expiresAt = new Date(
        Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
    );

    await prisma.session.create({
        data: {
            tokenHash,
            userId,
            expiresAt
        }
    });

    return {
        token,
        expiresAt
    };
};

export const validateSession = async (token) => {
    if (!token) {
        return null;
    }

    const tokenHash = hashToken(token);

    const session = await prisma.session.findUnique({
        where: {
            tokenHash
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }
        }
    });

    if (!session) {
        return null;
    }

    if (session.expiresAt <= new Date()) {
        await prisma.session.delete({
            where: {
                id: session.id
            }
        });

        return null;
    }

    return {
        sessionId: session.id,
        user: session.user
    };
};

export const revokeSession = async (token) => {
    if (!token) {
        return;
    }

    const tokenHash = hashToken(token);

    await prisma.session.deleteMany({
        where: {
            tokenHash
        }
    });
};
