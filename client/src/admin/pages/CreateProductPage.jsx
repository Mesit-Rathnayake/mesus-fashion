import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import "./CreateProductPage.css";

const emptyVariant = () => ({
    sku: "",
    size: "",
    color: "",
    price: "",
    compareAtPrice: "",
    stockQuantity: "0"
});

const CreateProductPage = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        status: "DRAFT",
        categoryIds: []
    });

    const [variants, setVariants] = useState([emptyVariant()]);
    const [images, setImages] = useState([]);
    const [primaryImage, setPrimaryImage] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");
                setCategories(response.data.data);
            } catch {
                setError("Failed to load categories.");
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const updateField = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));
    };

    const generateSlug = (value) => {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const updateVariant = (index, field, value) => {
        setVariants((current) =>
            current.map((variant, i) =>
                i === index
                    ? { ...variant, [field]: value }
                    : variant
            )
        );
    };

    const addVariant = () => {
        setVariants((current) => [...current, emptyVariant()]);
    };

    const removeVariant = (index) => {
        setVariants((current) =>
            current.filter((_, i) => i !== index)
        );
    };

    const toggleCategory = (categoryId) => {
        setForm((current) => ({
            ...current,
            categoryIds: current.categoryIds.includes(categoryId)
                ? current.categoryIds.filter((id) => id !== categoryId)
                : [...current.categoryIds, categoryId]
        }));
    };

    const handleImageChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []);

        setImages((current) => [
            ...current,
            ...selectedFiles
        ]);

        event.target.value = "";
    };

    const removeImage = (index) => {
        setImages((current) =>
            current.filter((_, i) => i !== index)
        );

        setPrimaryImage((current) => {
            if (index === current) return 0;
            if (index < current) return current - 1;
            return current;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (variants.length === 0) {
            setError("Add at least one product variant.");
            return;
        }

        if (images.length === 0) {
            setError("Add at least one product image.");
            return;
        }

        if (variants.some((variant) =>
            !variant.sku.trim() ||
            !variant.price ||
            Number(variant.price) <= 0 ||
            !Number.isInteger(Number(variant.stockQuantity)) ||
            Number(variant.stockQuantity) < 0 ||
            (variant.compareAtPrice &&
                Number(variant.compareAtPrice) <= 0)
        )) {
            setError("Check your variant SKU, price and stock values.");
            return;
        }

        try {
            setSubmitting(true);

            const productResponse = await api.post("/products", {
                ...form,
                variants: variants.map((variant) => ({
                    sku: variant.sku.trim(),
                    size: variant.size.trim() || undefined,
                    color: variant.color.trim() || undefined,
                    price: Number(variant.price),
                    compareAtPrice: variant.compareAtPrice
                        ? Number(variant.compareAtPrice)
                        : undefined,
                    stockQuantity: Number(variant.stockQuantity)
                }))
            });

            const productId =
                productResponse.data.data?.id ||
                productResponse.data.data?.product?.id;

            for (let index = 0; index < images.length; index++) {
                const imageData = new FormData();

                imageData.append("image", images[index]);
                imageData.append("altText", images[index].name);
                imageData.append("sortOrder", String(index));
                imageData.append(
                    "isPrimary",
                    String(index === primaryImage)
                );

                await api.post(
                    `/products/${productId}/images`,
                    imageData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            navigate("/admin/products");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create product. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="create-product-page">
            <div className="create-product-heading">
                <span>STORE MANAGEMENT</span>
                <h1>Add New Product</h1>
                <p>Create a new product for your MeSUS Fashion store.</p>
            </div>

            {error && (
                <div className="create-product-error">
                    {error}
                </div>
            )}

            <form className="product-form" onSubmit={handleSubmit}>
                <section className="form-section">
                    <h2>Basic Information</h2>

                    <label>
                        Product Name *
                        <input
                            name="name"
                            value={form.name}
                            onChange={(event) => {
                                updateField(event);
                                setForm((current) => ({
                                    ...current,
                                    slug: generateSlug(event.target.value)
                                }));
                            }}
                            required
                            minLength={2}
                            maxLength={150}
                        />
                    </label>

                    <label>
                        URL Slug *
                        <input
                            name="slug"
                            value={form.slug}
                            onChange={updateField}
                            required
                            pattern="[a-z0-9]+(-[a-z0-9]+)*"
                        />
                    </label>

                    <label>
                        Description
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={updateField}
                            rows="5"
                            maxLength={5000}
                        />
                    </label>

                    <label>
                        Product Status
                        <select
                            name="status"
                            value={form.status}
                            onChange={updateField}
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </label>
                </section>

                <section className="form-section">
                    <h2>Categories</h2>

                    {loadingCategories ? (
                        <p>Loading categories...</p>
                    ) : categories.length === 0 ? (
                        <p>No categories available.</p>
                    ) : (
                        <div className="category-options">
                            {categories.map((category) => (
                                <label key={category.id}>
                                    <input
                                        type="checkbox"
                                        checked={form.categoryIds.includes(category.id)}
                                        onChange={() => toggleCategory(category.id)}
                                    />
                                    {category.name}
                                </label>
                            ))}
                        </div>
                    )}
                </section>

                <section className="form-section">
                    <div className="section-heading-row">
                        <h2>Product Variants</h2>
                        <button type="button" onClick={addVariant}>
                            + Add Variant
                        </button>
                    </div>

                    {variants.map((variant, index) => (
                        <div className="variant-card" key={index}>
                            <div className="variant-heading">
                                <h3>Variant {index + 1}</h3>

                                {variants.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="variant-grid">
                                <label>
                                    SKU *
                                    <input
                                        value={variant.sku}
                                        onChange={(event) =>
                                            updateVariant(index, "sku", event.target.value)
                                        }
                                        required
                                    />
                                </label>

                                <label>
                                    Size
                                    <input
                                        value={variant.size}
                                        onChange={(event) =>
                                            updateVariant(index, "size", event.target.value)
                                        }
                                    />
                                </label>

                                <label>
                                    Color
                                    <input
                                        value={variant.color}
                                        onChange={(event) =>
                                            updateVariant(index, "color", event.target.value)
                                        }
                                    />
                                </label>

                                <label>
                                    Price *
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={variant.price}
                                        onChange={(event) =>
                                            updateVariant(index, "price", event.target.value)
                                        }
                                        required
                                    />
                                </label>

                                <label>
                                    Compare-at Price
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={variant.compareAtPrice}
                                        onChange={(event) =>
                                            updateVariant(index, "compareAtPrice", event.target.value)
                                        }
                                    />
                                </label>

                                <label>
                                    Stock Quantity *
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={variant.stockQuantity}
                                        onChange={(event) =>
                                            updateVariant(index, "stockQuantity", event.target.value)
                                        }
                                        required
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="form-section">
                    <h2>Product Images</h2>

                    <label className="image-upload-label">
                        Select Product Images
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleImageChange}
                        />
                    </label>

                    <p className="image-help">
                        JPEG, PNG or WebP. Maximum 5 MB per image.
                    </p>

                    <div className="image-preview-grid">
                        {images.map((image, index) => (
                            <div className="image-preview" key={`${image.name}-${index}`}>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={image.name}
                                />

                                <span>{image.name}</span>

                                <label>
                                    <input
                                        type="radio"
                                        name="primaryImage"
                                        checked={primaryImage === index}
                                        onChange={() => setPrimaryImage(index)}
                                    />
                                    Primary
                                </label>

                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="product-form-actions">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                    >
                        Cancel
                    </button>

                    <button type="submit" disabled={submitting}>
                        {submitting ? "Creating Product..." : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProductPage;
