import {
  Boxes,
  CircleUserRound,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircleMore,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/admin/login");
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-logo">MK</div>

        <div>
          <strong>MYKA</strong>
          <span>ADMIN</span>
        </div>
      </div>

      <nav className="admin-nav">
        <NavLink to="/admin" end>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/products">
          <Boxes size={18} />
          Products
        </NavLink>

        <NavLink to="/admin/categories">
          <FolderTree size={18} />
          Categories
        </NavLink>

        <NavLink to="/admin/inquiries">
          <MessageCircleMore size={18} />
          Inquiries
        </NavLink>

        <NavLink to="/admin/contacts">
          <Mail size={18} />
          Contacts
        </NavLink>

        <NavLink to="/admin/users">
          <CircleUserRound size={18} />
          Users
        </NavLink>
      </nav>

      <button className="admin-logout-button" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
