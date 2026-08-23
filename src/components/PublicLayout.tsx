import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import GlobalBanner from "./GlobalBanner";
import Footer from "./Footer";

const PublicLayout = () => {
  return (
    <>
      <Navbar />

      <GlobalBanner />

      <Outlet />

      <Footer />
    </>
  );
};

export default PublicLayout;
