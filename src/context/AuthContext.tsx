import { createContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ use default import, not destructuring

interface AuthContextType {
    token: string | null;
    user: any;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("jwtToken"));
    const [user, setUser] = useState<any>(token ? jwtDecode(token) : null);

    useEffect(() => {
        const savedToken = localStorage.getItem("jwtToken");
        if (savedToken) {
            try {
                const decoded = jwtDecode(savedToken);
                setUser(decoded);
                setToken(savedToken);
            } catch (err) {
                console.error("Invalid JWT token:", err);
                localStorage.removeItem("jwtToken");
            }
        }
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem("jwtToken", newToken);
        setToken(newToken);
        setUser(jwtDecode(newToken));
    };

    const logout = () => {
        localStorage.removeItem("jwtToken");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
