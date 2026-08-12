import { ArrowRight, Mail } from "lucide-react";

import { useState } from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "http://localhost:5003/api/v1";

const ForgotPasswordPage = () => {
  const [message, setMessage] = useState("");

  const [resetUrl, setResetUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: form.get("email"),
        }),
      });

      const result = await response.json();

      setMessage(result.message || "Password reset request received.");

      if (result.reset_url) {
        setResetUrl(result.reset_url);
      }
    } catch {
      setMessage("Unable to process request.");
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
            <p className="home-eyebrow">ACCOUNT RECOVERY</p>

            <h1>Forgot Password?</h1>

            <p>Enter your registered email address to reset your password.</p>
          </div>

          <form onSubmit={handleSubmit} className="customer-auth-form">
            <div className="customer-auth-field">
              <label>Email</label>

              <div>
                <Mail size={16} />

                <input name="email" type="email" required />
              </div>
            </div>

            <button className="customer-auth-submit" disabled={loading}>
              {loading ? "Processing..." : "Request Reset"}
            </button>
          </form>

          {message && <div className="customer-auth-message">{message}</div>}

          {resetUrl && (
            <a href={resetUrl} className="customer-development-reset">
              Continue to Reset Password
              <ArrowRight size={14} />
            </a>
          )}

          <p className="customer-auth-footer">
            <Link to="/login">Back to login</Link>
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ForgotPasswordPage;
