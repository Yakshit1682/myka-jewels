import { Boxes, CircleUserRound, Mail, MessageCircleMore } from "lucide-react";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

const API_URL = "http://localhost:5003/api/v1";

type DashboardData = {
  stats: {
    total_products: number;
    total_inquiries: number;
    new_inquiries: number;
    total_contacts: number;
    new_contacts: number;
    total_users: number;
  };

  recent_inquiries: any[];

  recent_products: any[];
};

const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  const stats = data?.stats;

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">OVERVIEW</span>

          <h2>Dashboard</h2>

          <p>Manage your jewellery catalogue and customer enquiries.</p>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Boxes size={21} />
          </div>

          <div>
            <span>Total Products</span>

            <strong>{stats?.total_products || 0}</strong>
          </div>

          <small>Active catalogue items</small>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <MessageCircleMore size={21} />
          </div>

          <div>
            <span>Product Inquiries</span>

            <strong>{stats?.total_inquiries || 0}</strong>
          </div>

          <small>{stats?.new_inquiries || 0} waiting for attention</small>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Mail size={21} />
          </div>

          <div>
            <span>Contact Messages</span>

            <strong>{stats?.total_contacts || 0}</strong>
          </div>

          <small>{stats?.new_contacts || 0} unread messages</small>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <CircleUserRound size={21} />
          </div>

          <div>
            <span>Registered Users</span>

            <strong>{stats?.total_users || 0}</strong>
          </div>

          <small>Customer accounts</small>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-panel-card">
          <div className="admin-panel-heading">
            <div>
              <span>RECENT</span>

              <h3>Product Inquiries</h3>
            </div>

            <Link to="/admin/inquiries">View All</Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>

                  <th>Product</th>

                  <th>Status</th>

                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {data?.recent_inquiries?.map((inquiry) => (
                  <tr key={inquiry.uuid}>
                    <td>
                      <strong>
                        {inquiry.user?.first_name || "—"}{" "}
                        {inquiry.user?.last_name || ""}
                      </strong>

                      <span>{inquiry.user?.email || ""}</span>
                    </td>

                    <td>{inquiry.product?.name || "—"}</td>

                    <td>
                      <span
                        className={`admin-status status-${inquiry.status.toLowerCase()}`}
                      >
                        {inquiry.status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        inquiry.clicked_at || inquiry.created_at,
                      ).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}

                {!data?.recent_inquiries?.length && (
                  <tr>
                    <td colSpan={4} className="admin-empty-state">
                      No inquiries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-panel-card">
          <div className="admin-panel-heading">
            <div>
              <span>CATALOGUE</span>

              <h3>Latest Products</h3>
            </div>

            <Link to="/admin/products">Manage</Link>
          </div>

          <div className="admin-product-list">
            {data?.recent_products?.map((product) => (
              <div className="admin-product-row" key={product.uuid}>
                <div className="admin-product-thumb">MK</div>

                <div>
                  <strong>{product.name}</strong>

                  <span>
                    {product.price
                      ? `₹${Number(product.price).toLocaleString("en-IN")}`
                      : "Price on request"}
                  </span>
                </div>

                <span className="admin-product-active">
                  {product.stock_status === "IN_STOCK"
                    ? "In Stock"
                    : product.stock_status === "OUT_OF_STOCK"
                      ? "Out"
                      : "Request"}
                </span>
              </div>
            ))}

            {!data?.recent_products?.length && (
              <div className="admin-empty-state">No products yet.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
