import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "http://localhost:5003/api/v1";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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

      localStorage.setItem("token", result.data.token);

      localStorage.setItem("user", JSON.stringify(result.data.user));

      const params = new URLSearchParams(location.search);

      const redirect = params.get("redirect");

      navigate(redirect || "/profile");
    } catch (error) {
      console.error(error);

      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="customer-auth-page">
        <section className="customer-auth-card">
          <div className="customer-auth-heading">
            <p className="home-eyebrow">WELCOME BACK</p>

            <h1>Sign In</h1>

            <p>Sign in to manage your wishlist and jewellery inquiries.</p>
          </div>

          <form onSubmit={handleSubmit} className="customer-auth-form">
            <div className="customer-auth-field">
              <label>Email</label>

              <div>
                <Mail size={16} />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="customer-auth-field">
              <label>Password</label>

              <div>
                <Lock size={16} />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="customer-auth-options">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            {error && <div className="customer-auth-error">{error}</div>}

            <button
              type="submit"
              className="customer-auth-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="customer-auth-footer">
            New to MYKA? <Link to="/register">Create an account</Link>
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default LoginPage;
