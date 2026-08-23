import { Heart, LogOut, MessageCircle, UserRound } from "lucide-react";

import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL;;

type UserProfile = {
  uuid: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  roles: string[];
  created_at?: string;
};

type Inquiry = {
  uuid: string;
  status: string;
  clicked_at: string;

  product: {
    uuid: string;
    name: string;
    slug: string;
    sku?: string;
    price?: string | number;
    material?: string;
    images?: {
      uuid: string;
      data_uri: string;
      alt_text?: string;
      is_primary: boolean;
    }[];
  };
};

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login?redirect=/profile");

      return;
    }

    const loadProfile = async () => {
      try {
        const [profileResponse, inquiryResponse] = await Promise.all([
          fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_URL}/inquiries/my`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const profileResult = await profileResponse.json();

        const inquiryResult = await inquiryResponse.json();

        if (profileResult.success) {
          setUser(profileResult.data);
        }

        if (inquiryResult.success) {
          setInquiries(inquiryResult.data?.inquiries || []);
        }

        if (profileResponse.status === 401) {
          localStorage.removeItem("token");

          localStorage.removeItem("user");

          navigate("/login");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } finally {
      localStorage.removeItem("token");

      localStorage.removeItem("user");

      navigate("/");
    }
  };

  if (loading) {
    return (
      <>
        {/* <Navbar /> */}

        <main className="profile-loading">Loading your account...</main>

        {/* <Footer /> */}
      </>
    );
  }

  return (
    <>
      {/* <Navbar /> */}

      <main className="profile-page">
        <section className="profile-header">
          <div className="profile-avatar">
            <UserRound size={27} />
          </div>

          <div>
            <p className="home-eyebrow">MY ACCOUNT</p>

            <h1>
              {user?.first_name} {user?.last_name || ""}
            </h1>

            <span>{user?.email}</span>
          </div>

          <button onClick={handleLogout} className="profile-logout-button">
            <LogOut size={15} />
            Logout
          </button>
        </section>

        <section className="profile-stats-grid">
          <div className="profile-stat-card">
            <MessageCircle size={22} />

            <strong>{inquiries.length}</strong>

            <span>Product Inquiries</span>
          </div>

          <div className="profile-stat-card">
            <Heart size={22} />

            <strong>—</strong>

            <span>Wishlist Items</span>
          </div>
        </section>

        <section className="profile-inquiries">
          <div className="profile-section-heading">
            <div>
              <p className="home-eyebrow">YOUR INTERESTS</p>

              <h2>Jewellery You've Enquired About</h2>
            </div>
          </div>

          {inquiries.length > 0 ? (
            <div className="profile-inquiry-grid">
              {inquiries.map((inquiry) => {
                const image =
                  inquiry.product?.images?.find((item) => item.is_primary) ||
                  inquiry.product?.images?.[0];

                return (
                  <article className="profile-inquiry-card" key={inquiry.uuid}>
                    <Link
                      to={`/products/${inquiry.product.slug}`}
                      className="profile-inquiry-image"
                    >
                      {image ? (
                        <img
                          src={image.data_uri}
                          alt={image.alt_text || inquiry.product.name}
                        />
                      ) : (
                        <div>No image</div>
                      )}
                    </Link>

                    <div className="profile-inquiry-content">
                      <span className="profile-inquiry-status">
                        {inquiry.status}
                      </span>

                      <Link to={`/products/${inquiry.product.slug}`}>
                        <h3>{inquiry.product.name}</h3>
                      </Link>

                      {inquiry.product.sku && (
                        <span>SKU: {inquiry.product.sku}</span>
                      )}

                      <strong>
                        {inquiry.product.price
                          ? `₹${Number(inquiry.product.price).toLocaleString(
                              "en-IN",
                            )}`
                          : "Price on request"}
                      </strong>

                      <small>
                        Enquired on{" "}
                        {new Date(inquiry.clicked_at).toLocaleDateString(
                          "en-IN",
                        )}
                      </small>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="profile-empty">
              <MessageCircle size={30} />

              <h3>No inquiries yet.</h3>

              <p>
                Discover our jewellery collection and enquire directly through
                WhatsApp.
              </p>

              <Link to="/products" className="primary-gold-button">
                Explore Jewellery
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* <Footer /> */}
    </>
  );
};

export default ProfilePage;
