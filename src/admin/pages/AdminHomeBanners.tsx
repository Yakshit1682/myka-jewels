import { Edit3, ImagePlus, Images, Plus, Trash2, X } from "lucide-react";

import { useEffect, useState } from "react";

import {
  createHomeBanner,
  deleteHomeBanner,
  getAdminHomeBanners,
  updateHomeBanner,
} from "../../api/adminHomeBanners.api";

type BannerType = "BANNER" | "CAROUSEL";

type BannerImage = {
  uuid?: string;

  image_data_uri: string;

  alt_text?: string | null;

  sort_order?: number;

  link_url?: string | null;
};

type HomeBanner = {
  uuid: string;

  title?: string | null;

  subtitle?: string | null;

  description?: string | null;

  type: BannerType;

  button_text?: string | null;

  button_url?: string | null;

  sort_order: number;

  is_active: boolean;

  starts_at?: string | null;

  ends_at?: string | null;

  images?: BannerImage[];
};

type HomeBannerForm = {
  title: string;

  subtitle: string;

  description: string;

  type: BannerType;

  button_text: string;

  button_url: string;

  sort_order: number;

  is_active: boolean;

  starts_at: string;

  ends_at: string;

  images: BannerImage[];
};

const initialForm: HomeBannerForm = {
  title: "",

  subtitle: "",

  description: "",

  type: "BANNER",

  button_text: "",

  button_url: "",

  sort_order: 0,

  is_active: true,

  starts_at: "",

  ends_at: "",

  images: [],
};

const AdminHomeBanners = () => {
  const [banners, setBanners] = useState<HomeBanner[]>([]);

  const [form, setForm] = useState<HomeBannerForm>(initialForm);

  const [editingBanner, setEditingBanner] = useState<HomeBanner | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD
  |--------------------------------------------------------------------------
  */

  const loadBanners = async () => {
    try {
      const response = await getAdminHomeBanners();

      if (response.success) {
        setBanners(response.data || []);
      }
    } catch (error) {
      console.error("Load banners error:", error);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CREATE
  |--------------------------------------------------------------------------
  */

  const openCreate = () => {
    setEditingBanner(null);

    setForm(initialForm);

    setModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT
  |--------------------------------------------------------------------------
  */

  const openEdit = (banner: HomeBanner) => {
    setEditingBanner(banner);

    setForm({
      title: banner.title || "",

      subtitle: banner.subtitle || "",

      description: banner.description || "",

      type: banner.type,

      button_text: banner.button_text || "",

      button_url: banner.button_url || "",

      sort_order: banner.sort_order || 0,

      is_active: Boolean(banner.is_active),

      starts_at: banner.starts_at ? banner.starts_at.slice(0, 16) : "",

      ends_at: banner.ends_at ? banner.ends_at.slice(0, 16) : "",

      images:
        banner.images?.map((image, index) => ({
          ...image,

          sort_order: image.sort_order ?? index + 1,

          link_url: image.link_url || "",

          alt_text: image.alt_text || "",
        })) || [],
    });

    setModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | BASIC INPUT
  |--------------------------------------------------------------------------
  */

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,

      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | TYPE
  |--------------------------------------------------------------------------
  */

  const handleTypeChange = (type: BannerType) => {
    setForm((current) => ({
      ...current,

      type,

      /*
       * Banner supports one image.
       * If switching from carousel,
       * keep only first image.
       */
      images: type === "BANNER" ? current.images.slice(0, 1) : current.images,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | FILE -> DATA URI
  |--------------------------------------------------------------------------
  */

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  /*
  |--------------------------------------------------------------------------
  | ADD IMAGES
  |--------------------------------------------------------------------------
  */

  const handleImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const maxImages = form.type === "BANNER" ? 1 : 5;

    const remaining = maxImages - form.images.length;

    if (remaining <= 0) {
      alert(
        form.type === "BANNER"
          ? "Banner can contain only 1 image"
          : "Carousel can contain maximum 5 images",
      );

      event.target.value = "";

      return;
    }

    const selectedFiles = files.slice(0, remaining);

    try {
      const dataUris = await Promise.all(selectedFiles.map(fileToDataUri));

      setForm((current) => {
        const newImages = dataUris.map((dataUri, index) => ({
          image_data_uri: dataUri,

          alt_text: current.title || "",

          link_url: current.button_url || "",

          sort_order: current.images.length + index + 1,
        }));

        return {
          ...current,

          images: [...current.images, ...newImages],
        };
      });
    } catch (error) {
      console.error(error);

      alert("Unable to read image");
    }

    event.target.value = "";
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE IMAGE
  |--------------------------------------------------------------------------
  */

  const removeImage = (index: number) => {
    setForm((current) => {
      const images = current.images.filter(
        (_, imageIndex) => imageIndex !== index,
      );

      return {
        ...current,

        images: images.map((image, imageIndex) => ({
          ...image,

          sort_order: imageIndex + 1,
        })),
      };
    });
  };

  /*
  |--------------------------------------------------------------------------
  | IMAGE FIELD CHANGE
  |--------------------------------------------------------------------------
  */

  const updateImageField = (
    index: number,
    field: "alt_text" | "link_url",
    value: string,
  ) => {
    setForm((current) => ({
      ...current,

      images: current.images.map((image, imageIndex) =>
        imageIndex === index
          ? {
              ...image,

              [field]: value,
            }
          : image,
      ),
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (form.type === "BANNER" && form.images.length !== 1) {
      alert("Banner requires exactly 1 image");

      return;
    }

    if (
      form.type === "CAROUSEL" &&
      (form.images.length < 2 || form.images.length > 5)
    ) {
      alert("Carousel requires between 2 and 5 images");

      return;
    }

    if (
      form.starts_at &&
      form.ends_at &&
      new Date(form.starts_at) > new Date(form.ends_at)
    ) {
      alert("Start date cannot be after end date");

      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: form.title.trim() || null,

        subtitle: form.subtitle.trim() || null,

        description: form.description.trim() || null,

        type: form.type,

        button_text: form.button_text.trim() || null,

        button_url: form.button_url.trim() || null,

        sort_order: Number(form.sort_order || 0),

        is_active: form.is_active,

        starts_at: form.starts_at || null,

        ends_at: form.ends_at || null,

        images: form.images.map((image, index) => ({
          image_data_uri: image.image_data_uri,

          alt_text: image.alt_text?.trim() || form.title.trim() || null,

          link_url: image.link_url?.trim() || null,

          sort_order: index + 1,
        })),
      };

      const response = editingBanner
        ? await updateHomeBanner(editingBanner.uuid, payload)
        : await createHomeBanner(payload);

      if (!response.success) {
        alert(response.message || "Unable to save home banner");

        return;
      }

      setModalOpen(false);

      setEditingBanner(null);

      setForm(initialForm);

      await loadBanners();
    } catch (error) {
      console.error("Save banner error:", error);

      alert("Unable to save home banner");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (banner: HomeBanner) => {
    const confirmed = window.confirm(
      `Disable "${banner.title || banner.type}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteHomeBanner(banner.uuid);

      if (!response.success) {
        alert(response.message || "Unable to disable banner");

        return;
      }

      await loadBanners();
    } catch (error) {
      console.error(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | JSX
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">HOMEPAGE</span>

          <h2>Banners & Carousels</h2>

          <p>
            Manage promotional banners and image carousels displayed on your
            home page.
          </p>
        </div>

        <button className="admin-primary-button" onClick={openCreate}>
          <Plus size={15} />
          Add Banner
        </button>
      </div>

      <section className="admin-panel-card">
        <div className="admin-panel-heading">
          <div>
            <span>HOMEPAGE CONTENT</span>

            <h3>Promotional Media</h3>
          </div>

          <strong>{banners.length} items</strong>
        </div>

        <div className="admin-banner-list">
          {banners.map((banner) => {
            const preview = banner.images?.[0];

            return (
              <div className="admin-banner-row" key={banner.uuid}>
                <div className="admin-banner-preview">
                  {preview ? (
                    <img
                      src={preview.image_data_uri}
                      alt={banner.title || "Banner"}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </div>

                <div className="admin-banner-info">
                  <div className="admin-banner-title-row">
                    <strong>{banner.title || "Untitled Banner"}</strong>

                    <span
                      className={`admin-banner-type ${
                        banner.type === "CAROUSEL" ? "carousel" : ""
                      }`}
                    >
                      {banner.type}
                    </span>
                  </div>

                  {banner.subtitle && (
                    <span className="admin-banner-subtitle">
                      {banner.subtitle}
                    </span>
                  )}

                  <div className="admin-banner-meta">
                    <span>
                      <Images size={13} />
                      {banner.images?.length || 0} image
                      {(banner.images?.length || 0) !== 1 ? "s" : ""}
                    </span>

                    <span>Order {banner.sort_order}</span>

                    <span
                      className={`admin-status ${
                        banner.is_active
                          ? "status-contacted"
                          : "status-disabled"
                      }`}
                    >
                      {banner.is_active ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>

                <div className="admin-category-row-actions">
                  <button onClick={() => openEdit(banner)}>
                    <Edit3 size={14} />
                  </button>

                  <button onClick={() => handleDelete(banner)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          {banners.length === 0 && (
            <div className="admin-empty-category">
              No banners or carousels found.
            </div>
          )}
        </div>
      </section>

      {/* ===================================================
          MODAL
      =================================================== */}

      {modalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-product-modal">
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">HOMEPAGE</span>

                <h2>
                  {editingBanner
                    ? "Edit Banner / Carousel"
                    : "Create Banner / Carousel"}
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-product-form">
              {/* TYPE */}

              <div className="admin-form-group">
                <label>Display Type *</label>

                <div className="admin-banner-type-selector">
                  <button
                    type="button"
                    className={form.type === "BANNER" ? "selected" : ""}
                    onClick={() => handleTypeChange("BANNER")}
                  >
                    Banner
                    <small>Single image</small>
                  </button>

                  <button
                    type="button"
                    className={form.type === "CAROUSEL" ? "selected" : ""}
                    onClick={() => handleTypeChange("CAROUSEL")}
                  >
                    Carousel
                    <small>2–5 images</small>
                  </button>
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Title</label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="The Festive Edit"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Subtitle</label>

                  <input
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    placeholder="NEW SEASON"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Button Text</label>

                  <input
                    name="button_text"
                    value={form.button_text}
                    onChange={handleChange}
                    placeholder="Shop Now"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Button URL</label>

                  <input
                    name="button_url"
                    value={form.button_url}
                    onChange={handleChange}
                    placeholder="/products?collection=traditional"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Discover jewellery crafted for every celebration."
                />
              </div>

              {/* DATES */}

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Start Date</label>

                  <input
                    type="datetime-local"
                    name="starts_at"
                    value={form.starts_at}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>End Date</label>

                  <input
                    type="datetime-local"
                    name="ends_at"
                    value={form.ends_at}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* IMAGES */}

              <div className="admin-form-group">
                <div className="admin-image-heading">
                  <label>
                    {form.type === "BANNER"
                      ? "Banner Image"
                      : "Carousel Images"}
                  </label>

                  <span>
                    {form.images.length}/{form.type === "BANNER" ? 1 : 5}
                  </span>
                </div>

                <div className="admin-banner-image-grid">
                  {form.images.map((image, index) => (
                    <div key={index} className="admin-banner-image-item">
                      <div className="admin-banner-image-preview">
                        <img
                          src={image.image_data_uri}
                          alt={`Banner ${index + 1}`}
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="admin-banner-image-fields">
                        <input
                          value={image.alt_text || ""}
                          onChange={(event) =>
                            updateImageField(
                              index,

                              "alt_text",

                              event.target.value,
                            )
                          }
                          placeholder="Image alt text"
                        />

                        <input
                          value={image.link_url || ""}
                          onChange={(event) =>
                            updateImageField(
                              index,

                              "link_url",

                              event.target.value,
                            )
                          }
                          placeholder="/products?collection=anti-tarnish"
                        />
                      </div>
                    </div>
                  ))}

                  {form.images.length < (form.type === "BANNER" ? 1 : 5) && (
                    <label className="admin-banner-image-upload">
                      <ImagePlus size={26} />

                      <strong>Add Image</strong>

                      <span>
                        {form.type === "BANNER"
                          ? "1 image required"
                          : "2–5 images"}
                      </span>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple={form.type === "CAROUSEL"}
                        onChange={handleImages}
                        hidden
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* SORT + ACTIVE */}

              <div className="admin-form-bottom">
                <div className="admin-banner-bottom-options">
                  <div className="admin-form-group">
                    <label>Sort Order</label>

                    <input
                      type="number"
                      name="sort_order"
                      min="0"
                      value={form.sort_order}
                      onChange={handleChange}
                    />
                  </div>

                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,

                          is_active: event.target.checked,
                        }))
                      }
                    />
                    Active
                  </label>
                </div>

                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="admin-primary-button"
                  >
                    {loading
                      ? "Saving..."
                      : editingBanner
                        ? "Update"
                        : "Create"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHomeBanners;
