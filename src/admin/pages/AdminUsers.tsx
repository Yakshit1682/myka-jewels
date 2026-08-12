import { Eye, Search, UserCheck, UserX, X } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5003/api/v1";

type Role = {
  id: number;
  name: string;
};

type User = {
  uuid: string;

  first_name: string;
  last_name?: string | null;

  email: string;
  phone?: string | null;

  is_active: boolean;

  last_login_at?: string | null;

  created_at: string;

  roles: Role[];
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/users?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setUsers(result.data || []);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateStatus = async (user: User, isActive: boolean) => {
    const message = isActive
      ? `Activate ${user.first_name}?`
      : `Disable ${user.first_name}?`;

    if (!window.confirm(message)) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/admin/users/${user.uuid}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            is_active: isActive,
          }),
        },
      );

      const result = await response.json();

      if (!result.success) {
        alert(result.message || "Unable to update user");

        return;
      }

      setUsers((current) =>
        current.map((item) =>
          item.uuid === user.uuid
            ? {
                ...item,
                is_active: isActive,
              }
            : item,
        ),
      );

      setSelectedUser((current) =>
        current?.uuid === user.uuid
          ? {
              ...current,
              is_active: isActive,
            }
          : current,
      );
    } catch (error) {
      console.error(error);

      alert("Unable to update user");
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const fullName = `${user.first_name} ${
        user.last_name || ""
      }`.toLowerCase();

      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone?.includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.is_active) ||
        (statusFilter === "INACTIVE" && !user.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const getInitials = (user: User) => {
    const first = user.first_name?.charAt(0).toUpperCase() || "";

    const last = user.last_name?.charAt(0).toUpperCase() || "";

    return first + last;
  };

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">ACCOUNTS</span>

          <h2>Users</h2>

          <p>View and manage registered website users.</p>
        </div>

        <div className="admin-inquiry-summary">
          <strong>{users.filter((user) => user.is_active).length}</strong>

          <span>Active users</span>
        </div>
      </div>

      <section className="admin-panel-card">
        <div className="admin-inquiries-toolbar">
          <div className="admin-products-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users..."
            />
          </div>

          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All Users</option>

            <option value="ACTIVE">Active</option>

            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Last Login</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.uuid}>
                  <td>
                    <div className="admin-user-table-profile">
                      <div className="admin-user-table-avatar">
                        {getInitials(user)}
                      </div>

                      <div>
                        <strong>
                          {user.first_name} {user.last_name || ""}
                        </strong>

                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>

                  <td>{user.phone || "—"}</td>

                  <td>
                    <div className="admin-role-tags">
                      {user.roles?.map((role) => (
                        <span key={role.id}>{role.name}</span>
                      ))}
                    </div>
                  </td>

                  <td>
                    {new Date(user.created_at).toLocaleDateString("en-IN")}
                  </td>

                  <td>
                    {user.last_login_at
                      ? new Date(user.last_login_at).toLocaleDateString("en-IN")
                      : "Never"}
                  </td>

                  <td>
                    <span
                      className={`admin-status ${
                        user.is_active ? "status-contacted" : "status-disabled"
                      }`}
                    >
                      {user.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td>
                    <div className="admin-table-actions">
                      <button
                        onClick={() => setSelectedUser(user)}
                        title="View user"
                      >
                        <Eye size={15} />
                      </button>

                      {user.is_active ? (
                        <button
                          onClick={() => updateStatus(user, false)}
                          title="Disable user"
                        >
                          <UserX size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(user, true)}
                          title="Activate user"
                        >
                          <UserCheck size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty-state">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedUser && (
        <div className="admin-modal-backdrop">
          <div className="admin-user-modal">
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">USER DETAILS</span>

                <h2>Customer Profile</h2>
              </div>

              <button
                className="admin-modal-close"
                onClick={() => setSelectedUser(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-user-profile-header">
              <div className="admin-user-profile-avatar">
                {getInitials(selectedUser)}
              </div>

              <div>
                <h3>
                  {selectedUser.first_name} {selectedUser.last_name || ""}
                </h3>

                <span>{selectedUser.email}</span>
              </div>
            </div>

            <div className="admin-inquiry-details-grid">
              <div>
                <span>Phone</span>

                <strong>{selectedUser.phone || "Not provided"}</strong>
              </div>

              <div>
                <span>Status</span>

                <strong>
                  {selectedUser.is_active ? "Active" : "Disabled"}
                </strong>
              </div>

              <div>
                <span>Roles</span>

                <strong>
                  {selectedUser.roles?.map((role) => role.name).join(", ") ||
                    "USER"}
                </strong>
              </div>

              <div>
                <span>Joined</span>

                <strong>
                  {new Date(selectedUser.created_at).toLocaleDateString(
                    "en-IN",
                  )}
                </strong>
              </div>

              <div>
                <span>Last Login</span>

                <strong>
                  {selectedUser.last_login_at
                    ? new Date(selectedUser.last_login_at).toLocaleString(
                        "en-IN",
                      )
                    : "Never"}
                </strong>
              </div>
            </div>

            <div className="admin-user-modal-actions">
              {selectedUser.is_active ? (
                <button
                  className="admin-danger-button"
                  onClick={() => updateStatus(selectedUser, false)}
                >
                  <UserX size={15} />
                  Disable User
                </button>
              ) : (
                <button
                  className="admin-primary-button"
                  onClick={() => updateStatus(selectedUser, true)}
                >
                  <UserCheck size={15} />
                  Activate User
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
