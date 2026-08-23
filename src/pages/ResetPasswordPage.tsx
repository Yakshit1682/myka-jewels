import { Lock } from "lucide-react";

import { useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL;;

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError("Invalid reset link.");

      return;
    }

    const form = new FormData(event.currentTarget);

    const password = String(form.get("password"));

    const confirmPassword = String(form.get("confirm_password"));

    if (password !== confirmPassword) {
      setError("Passwords do not match.");

      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          token,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message);

        return;
      }

      navigate("/login");
    } catch {
      setError("Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}

      <main className="customer-auth-page">
        <section className="customer-auth-card">
          <div className="customer-auth-heading">
            <p className="home-eyebrow">SECURITY</p>

            <h1>Reset Password</h1>

            <p>Choose a new password for your MYKA account.</p>
          </div>

          <form onSubmit={handleSubmit} className="customer-auth-form">
            <div className="customer-auth-field">
              <label>New Password</label>

              <div>
                <Lock size={16} />

                <input name="password" type="password" minLength={8} required />
              </div>
            </div>

            <div className="customer-auth-field">
              <label>Confirm Password</label>

              <div>
                <Lock size={16} />

                <input
                  name="confirm_password"
                  type="password"
                  minLength={8}
                  required
                />
              </div>
            </div>

            {error && <div className="customer-auth-error">{error}</div>}

            <button className="customer-auth-submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>
      </main>

      {/* <Footer /> */}
    </>
  );
};

export default ResetPasswordPage;
