import { Clock3, Mail, MapPin, Phone, Send } from "lucide-react";

import { useState } from "react";

// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL;

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);

    const payload = {
      first_name: form.get("first_name"),
      last_name: form.get("last_name"),
      email: form.get("email"),
      phone: form.get("phone"),
      subject: form.get("subject"),
      message: form.get("message"),
    };

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Unable to send message");

        return;
      }

      setSubmitted(true);

      event.currentTarget.reset();
    } catch (error) {
      console.error("Contact form error:", error);

      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
    
      <main>
        <section className="contact-hero">
          <p className="home-eyebrow">CONTACT MYKA</p>

          <h1>We'd love to hear from you.</h1>

          <p>
            Whether you need help choosing the perfect piece or have a question
            about our jewellery, our team is here to assist.
          </p>
        </section>

        <section className="contact-main">
          <div className="contact-information">
            <p className="home-eyebrow">GET IN TOUCH</p>

            <h2>How can we help?</h2>

            <p className="contact-intro">
              Our jewellery specialists are available to answer questions about
              products, materials, availability, care and private consultations.
            </p>

            <div className="contact-detail-list">
              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <Mail size={19} strokeWidth={1.4} />
                </div>

                <div>
                  <span>Email</span>

                  <a href="mailto:hello@mykajewels.com">hello@mykajewels.com</a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <Phone size={19} strokeWidth={1.4} />
                </div>

                <div>
                  <span>Phone</span>

                  <a href="tel:+919876543210">+91 98765 43210</a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <MapPin size={19} strokeWidth={1.4} />
                </div>

                <div>
                  <span>Boutique</span>

                  <p>
                    Ahmedabad,
                    <br />
                    Gujarat, India
                  </p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <Clock3 size={19} strokeWidth={1.4} />
                </div>

                <div>
                  <span>Opening Hours</span>

                  <p>
                    Monday – Saturday
                    <br />
                    10:00 AM – 7:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <p className="home-eyebrow">SEND A MESSAGE</p>

            <h2>Contact Us</h2>

            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <Send size={24} />
                </div>

                <h3>Thank you.</h3>

                <p>
                  Your message has been received. Our team will get back to you
                  shortly.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="outline-luxury-button"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="first_name">First Name</label>

                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="Your first name"
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="last_name">Last Name</label>

                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="email">Email Address</label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="phone">Phone Number</label>

                  <input id="phone" name="phone" type="tel" placeholder="+91" />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="subject">How can we help?</label>

                  <select id="subject" name="subject" defaultValue="" required>
                    <option value="" disabled>
                      Select an enquiry
                    </option>

                    <option value="Product Enquiry">Product Enquiry</option>

                    <option value="Jewellery Availability">
                      Jewellery Availability
                    </option>

                    <option value="Material & Care">Material & Care</option>

                    <option value="Private Appointment">
                      Private Appointment
                    </option>

                    <option value="Custom Jewellery">Custom Jewellery</option>

                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="message">Message</label>

                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help..."
                    rows={6}
                    required
                  />
                </div>

                {error && <div className="contact-form-error">{error}</div>}

                <button
                  type="submit"
                  className="contact-submit-button"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}

                  {!loading && <Send size={15} />}
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="contact-appointment">
          <div>
            <p className="home-eyebrow">PRIVATE APPOINTMENTS</p>

            <h2>Experience MYKA personally.</h2>

            <p>
              Visit our boutique for a private jewellery consultation where our
              team can help you discover pieces suited to your style and
              occasion.
            </p>
          </div>

          <a
            href="https://wa.me/919876543210?text=Hello%20MYKA%2C%20I%20would%20like%20to%20request%20a%20private%20jewellery%20appointment."
            target="_blank"
            rel="noreferrer"
            className="primary-gold-button"
          >
            Request Appointment
          </a>
        </section>
      </main>

      {/* <Footer /> */}
    </>
  );
};

export default ContactPage;
