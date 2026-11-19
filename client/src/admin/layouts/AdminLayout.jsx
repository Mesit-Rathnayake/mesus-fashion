import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <h2>MeSUS</h2>
                    <span>ADMIN PANEL</span>
                </div>

                <nav className="admin-navigation">
                    <NavLink to="/admin" end>
                        Dashboard
                    </NavLink>

                    <NavLink to="/admin/products">
                        Products
                    </NavLink>

                    <NavLink to="/admin/categories">
                        Categories
                    </NavLink>
                </nav>

                <div className="admin-sidebar-footer">
                    <span>{user?.name}</span>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
