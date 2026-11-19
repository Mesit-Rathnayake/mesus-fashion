import fs from "node:fs/promises";
import path from "node:path";

const uploadRoot = path.resolve(process.cwd(), "uploads");

export const productImageDirectories = {
    original: path.join(uploadRoot, "products", "original"),
    optimized: path.join(uploadRoot, "products", "optimized")
};

export const ensureUploadDirectories = async () => {
    await Promise.all(
        Object.values(productImageDirectories).map((directory) =>
            fs.mkdir(directory, { recursive: true })
        )
    );
};

export const deleteLocalFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }
};
