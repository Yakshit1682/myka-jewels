import { Clock3, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <main>
        <section className="contact-hero">
          <p className="home-eyebrow">CONTACT MYKA</p>

          <h1>We'd love to hear from you.</h1>

          <p>
            Whether you need help choosing the perfect piece or have a question
            about your order, our team is here to assist.
          </p>
        </section>

        <section className="contact-main">
          <div className="contact-information">
            <p className="home-eyebrow">GET IN TOUCH</p>

            <h2>How can we help?</h2>

            <p className="contact-intro">
              Our jewellery specialists are available to answer questions about
              products, sizing, orders, care and delivery.
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
                    <label htmlFor="firstName">First Name</label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Your first name"
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="lastName">Last Name</label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Your last name"
                      required
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

                    <option value="product">Product Enquiry</option>

                    <option value="order">Order Support</option>

                    <option value="size">Sizing Assistance</option>

                    <option value="custom">Bespoke Jewellery</option>

                    <option value="other">Other</option>
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

                <button type="submit" className="contact-submit-button">
                  Send Message
                  <Send size={15} />
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
            href="mailto:hello@mykajewels.com?subject=Private Appointment"
            className="primary-gold-button"
          >
            Request Appointment
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
