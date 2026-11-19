import crypto from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import { prisma } from "../../config/prisma.js";

import {
    productImageDirectories,
    ensureUploadDirectories,
    deleteLocalFile
} from "../../utils/file.utils.js";

export const saveProductImage = async (file) => {
    await ensureUploadDirectories();

    const imageId = crypto.randomUUID();

    const originalFilename = `${imageId}.webp`;
    const optimizedFilename = `${imageId}.webp`;

    const originalPath = path.join(
        productImageDirectories.original,
        originalFilename
    );

    const optimizedPath = path.join(
        productImageDirectories.optimized,
        optimizedFilename
    );

    try {
        const metadata = await sharp(file.buffer).metadata();

        if (!metadata.width || !metadata.height) {
            throw new Error("Invalid image dimensions");
        }

        if (metadata.width > 10000 || metadata.height > 10000) {
            throw new Error("Image dimensions are too large");
        }

        const originalBuffer = await sharp(file.buffer)
            .rotate()
            .webp({ quality: 100, lossless: true })
            .toBuffer();

        const optimizedBuffer = await sharp(file.buffer)
            .rotate()
            .resize({
                width: 1200,
                height: 1600,
                fit: "inside",
                withoutEnlargement: true
            })
            .webp({ quality: 82 })
            .toBuffer();

        await Promise.all([
            import("node:fs/promises").then(({ writeFile }) =>
                writeFile(originalPath, originalBuffer, { flag: "wx" })
            ),
            import("node:fs/promises").then(({ writeFile }) =>
                writeFile(optimizedPath, optimizedBuffer, { flag: "wx" })
            )
        ]);

        return {
            imageId,
            originalFilename,
            optimizedFilename,
            originalPath,
            optimizedPath,
            width: metadata.width,
            height: metadata.height,
            mimeType: "image/webp",
            fileSize: optimizedBuffer.length
        };

    } catch (error) {
        await Promise.all([
            deleteLocalFile(originalPath),
            deleteLocalFile(optimizedPath)
        ]);

        throw error;
    }
};

export const attachProductImage = async ({
    productId,
    file,
    altText,
    sortOrder,
    isPrimary
}) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true }
    });

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    const savedImage = await saveProductImage(file);

    const imageUrl = `/uploads/products/optimized/${savedImage.optimizedFilename}`;

    try {
        const image = await prisma.$transaction(async (tx) => {
            if (isPrimary) {
                await tx.productImage.updateMany({
                    where: { productId },
                    data: { isPrimary: false }
                });
            }

            return tx.productImage.create({
                data: {
                    productId,
                    imageUrl,
                    altText,
                    sortOrder,
                    isPrimary
                }
            });
        });

        return {
            ...image,
            width: savedImage.width,
            height: savedImage.height,
            fileSize: savedImage.fileSize,
            mimeType: savedImage.mimeType
        };

    } catch (error) {
        await Promise.all([
            deleteLocalFile(savedImage.originalPath),
            deleteLocalFile(savedImage.optimizedPath)
        ]);

        throw error;
    }
};

export const removeProductImage = async (productId, imageId) => {
    const image = await prisma.productImage.findFirst({
        where: {
            id: imageId,
            productId
        }
    });

    if (!image) {
        const error = new Error("Product image not found");
        error.statusCode = 404;
        throw error;
    }

    await prisma.$transaction(async (tx) => {
        await tx.productImage.delete({
            where: { id: imageId }
        });

        if (image.isPrimary) {
            const nextImage = await tx.productImage.findFirst({
                where: { productId },
                orderBy: [
                    { sortOrder: "asc" },
                    { createdAt: "asc" }
                ]
            });

            if (nextImage) {
                await tx.productImage.update({
                    where: { id: nextImage.id },
                    data: { isPrimary: true }
                });
            }
        }
    });

    const filename = path.basename(image.imageUrl);

    if (/^[0-9a-f-]{36}\.webp$/i.test(filename)) {
        await Promise.all([
            deleteLocalFile(
                path.join(productImageDirectories.original, filename)
            ),
            deleteLocalFile(
                path.join(productImageDirectories.optimized, filename)
            )
        ]);
    }

    return image;
};
