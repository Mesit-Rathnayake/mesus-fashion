import { useAuth } from "../context/AuthContext";

const AccountPage = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <main>
            <h1>My Account</h1>

            <p>Welcome, {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>

            <button onClick={handleLogout}>
                Logout
            </button>
        </main>
    );
};

export default AccountPage;

