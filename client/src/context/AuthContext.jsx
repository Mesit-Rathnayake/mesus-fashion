import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import api from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check whether an existing session is valid
    const refreshUser = useCallback(async () => {
        try {
            const response = await api.get("/auth/me");
            const authenticatedUser = response.data.data.user;

            setUser(authenticatedUser);

            return authenticatedUser;
        } catch (error) {
            setUser(null);
            return null;
        }
    }, []);

    // Log in
    const login = async (credentials) => {
        const response = await api.post("/auth/login", credentials);
        const authenticatedUser = response.data.data.user;

        setUser(authenticatedUser);

        return authenticatedUser;
    };

    // Register a new account
    const register = async (userData) => {
        const response = await api.post("/auth/register", userData);

        return response.data;
    };

    // Log out
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setUser(null);
        }
    };

    // Check authentication when the application starts
    useEffect(() => {
        const initializeAuth = async () => {
            await refreshUser();
            setLoading(false);
        };

        initializeAuth();
    }, [refreshUser]);

    const value = useMemo(() => ({
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refreshUser
    }), [user, loading, refreshUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for accessing authentication
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};

