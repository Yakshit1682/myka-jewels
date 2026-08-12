import { Bell, Search } from "lucide-react";

const AdminHeader = () => {
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const initials = user?.first_name?.charAt(0).toUpperCase() || "A";

  return (
    <header className="admin-header">
      <div>
        <p>Welcome back</p>

        <h1>
          {user?.first_name
            ? `${user.first_name} ${user.last_name || ""}`
            : "MYKA Admin"}
        </h1>
      </div>

      <div className="admin-header-actions">
        <div className="admin-search">
          <Search size={16} />

          <input placeholder="Search..." />
        </div>

        <button className="admin-icon-button">
          <Bell size={18} />
        </button>

        <div className="admin-user-avatar">{initials}</div>
      </div>
    </header>
  );
};

export default AdminHeader;
