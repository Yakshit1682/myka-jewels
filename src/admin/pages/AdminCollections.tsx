import { Edit3, ImagePlus, Plus, Trash2, X } from "lucide-react";

import { useEffect, useState } from "react";

import {
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
} from "../../api/adminCollections.api";

type Collection = {
  uuid: string;
  name: string;
  slug: string;
  description?: string | null;
  image_data_uri?: string | null;
  sort_order?: number;
  is_active: boolean;
};

type CollectionForm = {
  name: string;
  description: string;
  image_data_uri: string;
  sort_order: number;
  is_active: boolean;
};

const initialForm: CollectionForm = {
  name: "",
  description: "",
  image_data_uri: "",
  sort_order: 0,
  is_active: true,
};

const AdminCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null,
  );

  const [form, setForm] = useState<CollectionForm>(initialForm);

  const [loading, setLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD COLLECTIONS
  |--------------------------------------------------------------------------
  */

  const loadCollections = async () => {
    try {
      const response = await getCollections();

      if (response.success) {
        setCollections(response.data || []);
      }
    } catch (error) {
      console.error("Unable to load collections:", error);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CREATE
  |--------------------------------------------------------------------------
  */

  const openCreate = () => {
    setEditingCollection(null);

    setForm(initialForm);

    setModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT
  |--------------------------------------------------------------------------
  */

  const openEdit = (collection: Collection) => {
    setEditingCollection(collection);

    setForm({
      name: collection.name || "",

      description: collection.description || "",

      image_data_uri: collection.image_data_uri || "",

      sort_order: collection.sort_order || 0,

      is_active: Boolean(collection.is_active),
    });

    setModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | INPUT CHANGE
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
  | IMAGE -> DATA URI
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
  | IMAGE CHANGE
  |--------------------------------------------------------------------------
  */

  const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const dataUri = await fileToDataUri(file);

      setForm((current) => ({
        ...current,

        image_data_uri: dataUri,
      }));
    } catch (error) {
      console.error("Unable to read image:", error);

      alert("Unable to read image");
    }

    event.target.value = "";
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE IMAGE
  |--------------------------------------------------------------------------
  */

  const removeImage = () => {
    setForm((current) => ({
      ...current,

      image_data_uri: "",
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE / UPDATE
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Collection name is required");

      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),

        description: form.description.trim() || null,

        image_data_uri: form.image_data_uri || null,

        sort_order: Number(form.sort_order || 0),

        is_active: form.is_active,
      };

      const response = editingCollection
        ? await updateCollection(editingCollection.uuid, payload)
        : await createCollection(payload);

      if (!response.success) {
        alert(response.message || "Unable to save collection");

        return;
      }

      setModalOpen(false);

      setEditingCollection(null);

      setForm(initialForm);

      await loadCollections();
    } catch (error) {
      console.error("Save collection error:", error);

      alert("Unable to save collection");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (collection: Collection) => {
    const confirmed = window.confirm(`Delete "${collection.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteCollection(collection.uuid);

      if (!response.success) {
        alert(response.message || "Unable to delete collection");

        return;
      }

      await loadCollections();
    } catch (error) {
      console.error("Delete collection error:", error);
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
          <span className="admin-eyebrow">CATALOGUE</span>

          <h2>Collections</h2>

          <p>
            Manage jewellery collections such as Anti-Tarnish, Oxidised and New
            Arrivals.
          </p>
        </div>

        <button className="admin-primary-button" onClick={openCreate}>
          <Plus size={15} />
          Add Collection
        </button>
      </div>

      <section className="admin-panel-card">
        <div className="admin-panel-heading">
          <div>
            <span>COLLECTIONS</span>

            <h3>Jewellery Collections</h3>
          </div>

          <strong>{collections.length} collections</strong>
        </div>

        <div className="admin-collection-list">
          {collections.map((collection) => (
            <div key={collection.uuid} className="admin-collection-row">
              <div className="admin-collection-row-main">
                <div className="admin-collection-thumbnail">
                  {collection.image_data_uri ? (
                    <img
                      src={collection.image_data_uri}
                      alt={collection.name}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </div>

                <div className="admin-collection-row-info">
                  <strong>{collection.name}</strong>

                  <span>/{collection.slug}</span>

                  {collection.description && <p>{collection.description}</p>}
                </div>
              </div>

              <div className="admin-collection-row-meta">
                <span>Order {collection.sort_order ?? 0}</span>

                <span
                  className={`admin-status ${
                    collection.is_active
                      ? "status-contacted"
                      : "status-disabled"
                  }`}
                >
                  {collection.is_active ? "Active" : "Disabled"}
                </span>

                <div className="admin-category-row-actions">
                  <button
                    onClick={() => openEdit(collection)}
                    aria-label="Edit"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(collection)}
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {collections.length === 0 && (
            <div className="admin-empty-category">No collections found.</div>
          )}
        </div>
      </section>

      {modalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-category-modal">
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">COLLECTION</span>

                <h2>
                  {editingCollection ? "Edit Collection" : "Add Collection"}
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

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Collection Name *</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Anti-Tarnish"
                  autoFocus
                />
              </div>

              <div className="admin-form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe this collection..."
                />
              </div>

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

              <div className="admin-form-group">
                <label>Collection Image</label>

                {form.image_data_uri ? (
                  <div className="admin-collection-image-preview">
                    <img
                      src={form.image_data_uri}
                      alt={form.name || "Collection"}
                    />

                    <button type="button" onClick={removeImage}>
                      <X size={14} />
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="admin-collection-image-upload">
                    <ImagePlus size={22} />

                    <span>Add Collection Image</span>

                    <small>PNG, JPG or WEBP</small>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImage}
                      hidden
                    />
                  </label>
                )}
              </div>

              <div className="admin-form-group">
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
                  Active collection
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
                    : editingCollection
                      ? "Update Collection"
                      : "Create Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCollections;
