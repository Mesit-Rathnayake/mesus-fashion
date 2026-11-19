import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import "./ProductsPage.css";

const ProductsPage = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/products", {
                params: {
                    page,
                    limit: 10,
                    search: search || undefined
                }
            });

            setProducts(response.data.data.products);
            setPagination(response.data.data.pagination);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load products"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    const handleDelete = async (product) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/products/${product.id}`);

            if (products.length === 1 && page > 1) {
                setPage((current) => current - 1);
            } else {
                fetchProducts();
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };

    return (
        <div className="admin-products">
            <div className="products-heading">
                <div>
                    <span>STORE MANAGEMENT</span>
                    <h1>Products</h1>
                    <p>Manage your store's product catalogue.</p>
                </div>

                <button
                    className="add-product-button"
                    onClick={() => navigate("/admin/products/new")}
                >
                    + Add Product
                </button>
            </div>

            <div className="products-toolbar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                />
            </div>

            {error && (
                <div className="products-error">
                    {error}
                </div>
            )}

            <div className="products-table-wrapper">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Slug</th>
                            <th>Status</th>
                            <th>Variants</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5">Loading products...</td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan="5">No products found.</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="product-name-cell">
                                            {product.images?.[0] && (
                                                <img
                                                    src={`http://localhost:5000${product.images[0].imageUrl}`}
                                                    alt={product.images[0].altText || product.name}
                                                />
                                            )}
                                            <span>{product.name}</span>
                                        </div>
                                    </td>

                                    <td>{product.slug}</td>

                                    <td>
                                        <span className={`product-status ${product.status.toLowerCase()}`}>
                                            {product.status}
                                        </span>
                                    </td>

                                    <td>{product.variants.length}</td>

                                    <td>
                                        <button
                                            className="delete-product-button"
                                            onClick={() => handleDelete(product)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="products-pagination">
                    <span>
                        Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <div>
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((current) => current - 1)}
                        >
                            Previous
                        </button>

                        <button
                            disabled={page >= pagination.totalPages}
                            onClick={() => setPage((current) => current + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
