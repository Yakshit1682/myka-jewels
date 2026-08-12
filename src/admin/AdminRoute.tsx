import { Navigate, Outlet } from "react-router-dom";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/v1";

type AuthState = "loading" | "authorized" | "unauthorized";

const AdminRoute = () => {
  const [authState, setAuthState] = useState<AuthState>("loading");

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthState("unauthorized");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setAuthState("unauthorized");
          return;
        }

        const user = result.data;

        const roles = user.roles || [];

        if (!roles.includes("ADMIN")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setAuthState("unauthorized");
          return;
        }

        /*
         * Refresh local user information
         * from backend.
         */
        localStorage.setItem("user", JSON.stringify(user));

        setAuthState("authorized");
      } catch (error) {
        console.error("Admin verification error:", error);

        setAuthState("unauthorized");
      }
    };

    verifyAdmin();
  }, []);

  if (authState === "loading") {
    return <div className="admin-route-loading">Verifying admin access...</div>;
  }

  if (authState === "unauthorized") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
