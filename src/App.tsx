import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import WishlistPage from "./pages/WishlistPage";

import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminInquiries from "./admin/pages/AdminInquiries";
import AdminContacts from "./admin/pages/AdminContacts";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminRoute from "./admin/AdminRoute";
import NotFoundPage from "./pages/NotFoundPage";
import BackToTop from "./components/BackToTop";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="products" element={<AdminProducts />} />

            <Route path="categories" element={<AdminCategories />} />

            <Route path="inquiries" element={<AdminInquiries />} />

            <Route path="contacts" element={<AdminContacts />} />

            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <BackToTop />
    </BrowserRouter>
  );
}

export default App;
