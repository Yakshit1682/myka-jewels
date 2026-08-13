import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Unable to login");

        return;
      }

      const roles = result.data.user.roles || [];

      if (!roles.includes("ADMIN")) {
        setError("This account does not have admin access.");

        return;
      }

      localStorage.setItem("token", result.data.token);

      localStorage.setItem("user", JSON.stringify(result.data.user));

      navigate("/admin");
    } catch (error) {
      console.error(error);

      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <div>MK</div>

          <h1>MYKA</h1>

          <span>ADMIN PORTAL</span>
        </div>

        <div className="admin-login-heading">
          <span className="admin-eyebrow">WELCOME BACK</span>

          <h2>Admin Login</h2>

          <p>Sign in to manage the MYKA jewellery catalogue.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label>Email</label>

            <div>
              <Mail size={16} />

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label>Password</label>

            <div>
              <Lock size={16} />

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default AdminLogin;
