import { Eye, MessageCircle, Search, X } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type Inquiry = {
  uuid: string;

  status: "NEW" | "CONTACTED" | "CLOSED" | "CANCELLED";

  message?: string | null;

  created_at: string;

  user?: {
    uuid: string;
    first_name: string;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
  };

  product?: {
    uuid: string;
    name: string;
    slug: string;
    sku?: string | null;
    price?: string | number | null;

    images?: {
      data_uri: string;
      is_primary: boolean;
    }[];
  };
};

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadInquiries = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/inquiries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setInquiries(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const updateStatus = async (uuid: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/inquiries/${uuid}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          status,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message || "Unable to update inquiry");

        return;
      }

      setInquiries((current) =>
        current.map((inquiry) =>
          inquiry.uuid === uuid
            ? {
                ...inquiry,
                status: status as Inquiry["status"],
              }
            : inquiry,
        ),
      );

      setSelectedInquiry((current) =>
        current?.uuid === uuid
          ? {
              ...current,
              status: status as Inquiry["status"],
            }
          : current,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const customerName = `${inquiry.user?.first_name || ""} ${
        inquiry.user?.last_name || ""
      }`.toLowerCase();

      const productName = inquiry.product?.name?.toLowerCase() || "";

      const query = search.toLowerCase();

      const matchesSearch =
        !query ||
        customerName.includes(query) ||
        productName.includes(query) ||
        inquiry.user?.email?.toLowerCase().includes(query) ||
        inquiry.user?.phone?.includes(query);

      const matchesStatus =
        statusFilter === "ALL" || inquiry.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inquiries, search, statusFilter]);

  const getPrimaryImage = (inquiry: Inquiry) => {
    return (
      inquiry.product?.images?.find((image) => image.is_primary)?.data_uri ||
      inquiry.product?.images?.[0]?.data_uri
    );
  };

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CUSTOMER LEADS</span>

          <h2>Inquiries</h2>

          <p>Manage customers interested in your jewellery.</p>
        </div>

        <div className="admin-inquiry-summary">
          <strong>
            {inquiries.filter((inquiry) => inquiry.status === "NEW").length}
          </strong>

          <span>New inquiries</span>
        </div>
      </div>

      <section className="admin-panel-card">
        <div className="admin-inquiries-toolbar">
          <div className="admin-products-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer or product..."
            />
          </div>

          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All Status</option>

            <option value="NEW">New</option>

            <option value="CONTACTED">Contacted</option>

            <option value="CLOSED">Closed</option>

            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {filteredInquiries.map((inquiry) => {
                const image = getPrimaryImage(inquiry);

                return (
                  <tr key={inquiry.uuid}>
                    <td>
                      <div className="admin-table-product">
                        <div className="admin-table-product-image">
                          {image ? (
                            <img src={image} alt={inquiry.product?.name} />
                          ) : (
                            <span>No image</span>
                          )}
                        </div>

                        <div>
                          <strong>
                            {inquiry.product?.name || "Unknown Product"}
                          </strong>

                          <span>{inquiry.product?.sku || "—"}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong>
                        {inquiry.user?.first_name || "—"}{" "}
                        {inquiry.user?.last_name || ""}
                      </strong>

                      <span className="admin-table-subtext">
                        {inquiry.user?.email || ""}
                      </span>
                    </td>

                    <td>{inquiry.user?.phone || "—"}</td>

                    <td>
                      {new Date(inquiry.created_at).toLocaleDateString("en-IN")}
                    </td>

                    <td>
                      <select
                        className={`admin-inquiry-status status-${inquiry.status.toLowerCase()}`}
                        value={inquiry.status}
                        onChange={(event) =>
                          updateStatus(inquiry.uuid, event.target.value)
                        }
                      >
                        <option value="NEW">New</option>

                        <option value="CONTACTED">Contacted</option>

                        <option value="CLOSED">Closed</option>

                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="admin-icon-button"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {!loading && filteredInquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty-state">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedInquiry && (
        <div className="admin-modal-backdrop">
          <div className="admin-inquiry-modal">
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">INQUIRY DETAILS</span>

                <h2>Customer Inquiry</h2>
              </div>

              <button
                className="admin-modal-close"
                onClick={() => setSelectedInquiry(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-inquiry-product">
              {getPrimaryImage(selectedInquiry) && (
                <img
                  src={getPrimaryImage(selectedInquiry)}
                  alt={selectedInquiry.product?.name}
                />
              )}

              <div>
                <span>PRODUCT</span>

                <h3>{selectedInquiry.product?.name}</h3>

                {selectedInquiry.product?.price && (
                  <strong>
                    ₹
                    {Number(selectedInquiry.product.price).toLocaleString(
                      "en-IN",
                    )}
                  </strong>
                )}
              </div>
            </div>

            <div className="admin-inquiry-details-grid">
              <div>
                <span>Customer</span>

                <strong>
                  {selectedInquiry.user?.first_name}{" "}
                  {selectedInquiry.user?.last_name || ""}
                </strong>
              </div>

              <div>
                <span>Phone</span>

                <strong>{selectedInquiry.user?.phone || "—"}</strong>
              </div>

              <div>
                <span>Email</span>

                <strong>{selectedInquiry.user?.email || "—"}</strong>
              </div>

              <div>
                <span>Status</span>

                <strong>{selectedInquiry.status}</strong>
              </div>
            </div>

            {selectedInquiry.message && (
              <div className="admin-inquiry-message">
                <span>CUSTOMER MESSAGE</span>

                <p>{selectedInquiry.message}</p>
              </div>
            )}

            {selectedInquiry.user?.phone && (
              <a
                href={`https://wa.me/${selectedInquiry.user.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="admin-whatsapp-button"
              >
                <MessageCircle size={17} />
                Contact on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminInquiries;
