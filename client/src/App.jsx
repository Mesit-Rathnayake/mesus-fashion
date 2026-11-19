import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import AdminRoute from "./components/AdminRoute";

import AdminLayout from "./admin/layouts/AdminLayout";
import DashboardPage from "./admin/pages/DashboardPage";
import ProductsPage from "./admin/pages/ProductsPage";
import CreateProductPage from "./admin/pages/CreateProductPage";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public routes */}
                <Route path="/" element={<HomePage />} />

                {/* Guest-only routes */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/account" element={<AccountPage />} />
                </Route>

                {/* Admin routes */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="products/new" element={<CreateProductPage />} />
                    </Route>
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<NotFoundPage />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
