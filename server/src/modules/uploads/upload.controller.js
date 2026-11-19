import { z } from "zod";
import {
    saveProductImage,
    attachProductImage,
    removeProductImage
} from "./upload.service.js";

const imageParamsSchema = z.object({
    id: z.string().uuid()
});

const deleteImageParamsSchema = z.object({
    productId: z.string().uuid(),
    imageId: z.string().uuid()
});

const imageMetadataSchema = z.object({
    altText: z.string().trim().max(255).optional(),
    sortOrder: z.coerce.number().int().min(0).default(0),
    isPrimary: z.enum(["true", "false"])
        .default("false")
});

export const uploadProductImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "Please select an image to upload"
            });
        }

        const image = await saveProductImage(req.file);

        const imageUrl = `/uploads/products/optimized/${image.optimizedFilename}`;

        return res.status(201).json({
            status: "success",
            message: "Image uploaded successfully",
            data: {
                imageId: image.imageId,
                imageUrl,
                width: image.width,
                height: image.height,
                mimeType: image.mimeType,
                fileSize: image.fileSize
            }
        });

    } catch (error) {
        console.error("Image upload error:", error);

        return res.status(400).json({
            status: "error",
            message: error.message || "Image upload failed"
        });
    }
};

export const attachProductImageController = async (req, res) => {
    try {
        const params = imageParamsSchema.safeParse(req.params);
        const metadata = imageMetadataSchema.safeParse(req.body);

        if (!params.success || !metadata.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid image data",
                errors: [
                    ...(params.success ? [] : params.error.issues),
                    ...(metadata.success ? [] : metadata.error.issues)
                ]
            });
        }

        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "Please select an image to upload"
            });
        }

        const image = await attachProductImage({
            productId: params.data.id,
            file: req.file,
            altText: metadata.data.altText,
            sortOrder: metadata.data.sortOrder,
            isPrimary: metadata.data.isPrimary === "true"
        });

        return res.status(201).json({
            status: "success",
            message: "Product image uploaded successfully",
            data: image
        });

    } catch (error) {
        console.error("Product image upload error:", error);

        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.statusCode
                ? error.message
                : "Image upload failed"
        });
    }
};

export const deleteProductImageController = async (req, res) => {
    try {
        const validation = deleteImageParamsSchema.safeParse({
            productId: req.params.productId,
            imageId: req.params.imageId
        });

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid product or image ID"
            });
        }

        await removeProductImage(
            validation.data.productId,
            validation.data.imageId
        );

        return res.status(200).json({
            status: "success",
            message: "Product image deleted successfully"
        });

    } catch (error) {
        console.error("Product image deletion error:", error);

        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.statusCode
                ? error.message
                : "Image deletion failed"
        });
    }
};
