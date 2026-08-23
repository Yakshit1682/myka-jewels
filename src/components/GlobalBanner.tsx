import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { getHomeBanners } from "../api/homeBanners.api";

type BannerImage = {
  uuid: string;
  image_data_uri: string;
  alt_text?: string | null;
  link_url?: string | null;
};

type HomeBanner = {
  uuid: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  type: "BANNER" | "CAROUSEL";
  button_text?: string | null;
  button_url?: string | null;
  images?: BannerImage[];
};

const GlobalBanner = () => {
  const [banner, setBanner] = useState<HomeBanner | null>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const response = await getHomeBanners();

        if (!response.success) {
          return;
        }

        const activeBanner = (response.data || []).find(
          (item: HomeBanner) => item.type === "BANNER",
        );

        if (activeBanner) {
          setBanner(activeBanner);

          /*
           * Show popup after banner is loaded.
           */
          setVisible(true);
        }
      } catch (error) {
        console.error("Global banner error:", error);
      }
    };

    loadBanner();
  }, []);

  /*
   * ESC key closes modal.
   */
  useEffect(() => {
    if (!visible) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    /*
     * Prevent background page scroll.
     */
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!banner || !visible || !banner.images?.length) {
    return null;
  }

  const image = banner.images[0];

  const targetUrl = image.link_url || banner.button_url || "";

  return (
    <div
      className="banner-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        /*
         * Clicking backdrop closes modal,
         * clicking modal itself does not.
         */
        if (event.target === event.currentTarget) {
          setVisible(false);
        }
      }}
    >
      <div
        className="banner-modal"
        role="dialog"
        aria-modal="true"
        aria-label={banner.title || "MYKA promotion"}
      >
        {/* CLOSE */}

        <button
          type="button"
          className="banner-modal-close"
          onClick={() => setVisible(false)}
          aria-label="Close promotion"
        >
          <X size={18} />
        </button>

        {/* IMAGE */}

        <div className="banner-modal-image">
          <img
            src={image.image_data_uri}
            alt={image.alt_text || banner.title || "MYKA promotion"}
          />
        </div>

        {/* CONTENT */}

        <div className="banner-modal-content">
          {banner.subtitle && (
            <span className="banner-modal-eyebrow">{banner.subtitle}</span>
          )}

          {banner.title && <h2>{banner.title}</h2>}

          {banner.description && <p>{banner.description}</p>}

          {targetUrl && (
            <Link
              to={targetUrl}
              className="banner-modal-link"
              onClick={() => setVisible(false)}
            >
              {banner.button_text || "Discover"}

              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalBanner;
