import { Lock, Mail, Phone, User } from "lucide-react";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "http://localhost:5003/api/v1";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);

    const password = String(form.get("password") || "");

    const confirmPassword = String(form.get("confirm_password") || "");

    if (password !== confirmPassword) {
      setError("Passwords do not match");

      setLoading(false);
      return;
    }

    const payload = {
      first_name: form.get("first_name"),

      last_name: form.get("last_name"),

      email: form.get("email"),

      phone: form.get("phone"),

      password,
    };

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Unable to register");

        return;
      }

      navigate("/login");
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
        <section className="customer-auth-card customer-register-card">
          <div className="customer-auth-heading">
            <p className="home-eyebrow">JOIN MYKA</p>

            <h1>Create Account</h1>

            <p>Save your favourite jewellery and manage your inquiries.</p>
          </div>

          <form className="customer-auth-form" onSubmit={handleSubmit}>
            <div className="customer-auth-row">
              <div className="customer-auth-field">
                <label>First Name</label>

                <div>
                  <User size={16} />

                  <input name="first_name" placeholder="First name" required />
                </div>
              </div>

              <div className="customer-auth-field">
                <label>Last Name</label>

                <div>
                  <User size={16} />

                  <input name="last_name" placeholder="Last name" />
                </div>
              </div>
            </div>

            <div className="customer-auth-field">
              <label>Email</label>

              <div>
                <Mail size={16} />

                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="customer-auth-field">
              <label>Phone Number</label>

              <div>
                <Phone size={16} />

                <input name="phone" type="tel" placeholder="+91" />
              </div>
            </div>

            <div className="customer-auth-row">
              <div className="customer-auth-field">
                <label>Password</label>

                <div>
                  <Lock size={16} />

                  <input
                    name="password"
                    type="password"
                    minLength={8}
                    required
                  />
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
            </div>

            {error && <div className="customer-auth-error">{error}</div>}

            <button
              type="submit"
              className="customer-auth-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="customer-auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default RegisterPage;
