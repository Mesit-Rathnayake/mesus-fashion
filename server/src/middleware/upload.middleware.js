import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const fileFilter = (req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(
            new Error("Only JPEG, PNG and WebP images are allowed")
        );
    }

    callback(null, true);
};

export const uploadProductImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    }
}).single("image");

export const handleProductImageUpload = (req, res, next) => {
    uploadProductImage(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                status: "error",
                message: error.message || "Image upload failed"
            });
        }

        next();
    });
};
