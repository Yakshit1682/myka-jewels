import { Eye, Mail, Search, X } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type ContactSubmission = {
  uuid: string;

  first_name: string;
  last_name?: string | null;

  email: string;
  phone?: string | null;

  subject?: string | null;
  message: string;

  status: "NEW" | "READ" | "RESPONDED" | "CLOSED";

  admin_notes?: string | null;

  created_at: string;
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);

  const [selectedContact, setSelectedContact] =
    useState<ContactSubmission | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadContacts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setContacts(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const updateStatus = async (
    uuid: string,
    status: ContactSubmission["status"],
  ) => {
    try {
      const response = await fetch(`${API_URL}/admin/contacts/${uuid}`, {
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
        alert(result.message || "Unable to update contact");

        return;
      }

      setContacts((current) =>
        current.map((contact) =>
          contact.uuid === uuid
            ? {
                ...contact,
                status,
              }
            : contact,
        ),
      );

      setSelectedContact((current) =>
        current?.uuid === uuid
          ? {
              ...current,
              status,
            }
          : current,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const updateNotes = async (uuid: string, admin_notes: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/contacts/${uuid}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          admin_notes,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message || "Unable to save notes");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const fullName = `${contact.first_name} ${
        contact.last_name || ""
      }`.toLowerCase();

      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.phone?.includes(query) ||
        contact.subject?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || contact.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, search, statusFilter]);

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CUSTOMER SUPPORT</span>

          <h2>Contact Messages</h2>

          <p>View and manage customer messages.</p>
        </div>

        <div className="admin-inquiry-summary">
          <strong>
            {contacts.filter((contact) => contact.status === "NEW").length}
          </strong>

          <span>Unread messages</span>
        </div>
      </div>

      <section className="admin-panel-card">
        <div className="admin-inquiries-toolbar">
          <div className="admin-products-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search messages..."
            />
          </div>

          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All Status</option>

            <option value="NEW">New</option>

            <option value="READ">Read</option>

            <option value="RESPONDED">Responded</option>

            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Subject</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.uuid}>
                  <td>
                    <strong>
                      {contact.first_name} {contact.last_name || ""}
                    </strong>

                    <span className="admin-table-subtext">{contact.email}</span>
                  </td>

                  <td>{contact.subject || "General Enquiry"}</td>

                  <td>{contact.phone || "—"}</td>

                  <td>
                    {new Date(contact.created_at).toLocaleDateString("en-IN")}
                  </td>

                  <td>
                    <select
                      className={`admin-inquiry-status status-${contact.status.toLowerCase()}`}
                      value={contact.status}
                      onChange={(event) =>
                        updateStatus(
                          contact.uuid,
                          event.target.value as ContactSubmission["status"],
                        )
                      }
                    >
                      <option value="NEW">New</option>

                      <option value="READ">Read</option>

                      <option value="RESPONDED">Responded</option>

                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="admin-icon-button"
                      onClick={() => setSelectedContact(contact)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty-state">
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedContact && (
        <div className="admin-modal-backdrop">
          <div className="admin-contact-modal">
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">MESSAGE DETAILS</span>

                <h2>Customer Message</h2>
              </div>

              <button
                className="admin-modal-close"
                onClick={() => setSelectedContact(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-contact-profile">
              <div className="admin-contact-avatar">
                {selectedContact.first_name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3>
                  {selectedContact.first_name} {selectedContact.last_name || ""}
                </h3>

                <span>{selectedContact.email}</span>

                {selectedContact.phone && <span>{selectedContact.phone}</span>}
              </div>
            </div>

            <div className="admin-contact-subject">
              <span>SUBJECT</span>

              <strong>{selectedContact.subject || "General Enquiry"}</strong>
            </div>

            <div className="admin-contact-message">
              <span>MESSAGE</span>

              <p>{selectedContact.message}</p>
            </div>

            <div className="admin-form-group">
              <label>Admin Notes</label>

              <textarea
                defaultValue={selectedContact.admin_notes || ""}
                rows={4}
                placeholder="Add internal notes..."
                onBlur={(event) =>
                  updateNotes(selectedContact.uuid, event.target.value)
                }
              />
            </div>

            <div className="admin-contact-actions">
              <a
                href={`mailto:${selectedContact.email}`}
                className="admin-secondary-button"
              >
                <Mail size={15} />
                Email
              </a>

              {selectedContact.phone && (
                <a
                  href={`https://wa.me/${selectedContact.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-whatsapp-button"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminContacts;
