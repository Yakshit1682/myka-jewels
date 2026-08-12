import { ChevronRight, Edit3, FolderTree, Plus, Trash2, X } from "lucide-react";

import { useEffect, useState } from "react";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../api/adminCategories.api";

type Category = {
  uuid: string;
  name: string;
  slug: string;
  is_active: boolean;
  children?: Category[];
};

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");

  const [parentUuid, setParentUuid] = useState("");

  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const response = await getCategories();

      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setName("");
    setParentUuid("");
    setModalOpen(true);
  };

  const openSubcategory = (category: Category) => {
    setEditingCategory(null);
    setName("");
    setParentUuid(category.uuid);
    setModalOpen(true);
  };

  const openEdit = (category: Category, parent?: Category) => {
    setEditingCategory(category);

    setName(category.name);

    setParentUuid(parent?.uuid || "");

    setModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),

        parent_uuid: parentUuid || null,
      };

      const response = editingCategory
        ? await updateCategory(editingCategory.uuid, payload)
        : await createCategory(payload);

      if (!response.success) {
        alert(response.message || "Unable to save category");

        return;
      }

      setModalOpen(false);

      await loadCategories();
    } catch (error) {
      console.error(error);

      alert("Unable to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(`Disable "${category.name}"?`);

    if (!confirmed) return;

    try {
      const response = await deleteCategory(category.uuid);

      if (!response.success) {
        alert(response.message);
        return;
      }

      await loadCategories();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CATALOGUE</span>

          <h2>Categories</h2>

          <p>Organise your jewellery into categories and subcategories.</p>
        </div>

        <button className="admin-primary-button" onClick={openCreate}>
          <Plus size={15} />
          Add Category
        </button>
      </div>

      <section className="admin-panel-card">
        <div className="admin-panel-heading">
          <div>
            <span>STRUCTURE</span>

            <h3>Jewellery Categories</h3>
          </div>

          <strong>{categories.length} categories</strong>
        </div>

        <div className="admin-category-tree">
          {categories.map((category) => (
            <div className="admin-category-group" key={category.uuid}>
              <div className="admin-category-row">
                <div className="admin-category-name">
                  <div className="admin-category-icon">
                    <FolderTree size={17} />
                  </div>

                  <div>
                    <strong>{category.name}</strong>

                    <span>/{category.slug}</span>
                  </div>
                </div>

                <div className="admin-category-row-actions">
                  <button onClick={() => openSubcategory(category)}>
                    <Plus size={14} />
                    Subcategory
                  </button>

                  <button onClick={() => openEdit(category)}>
                    <Edit3 size={14} />
                  </button>

                  <button onClick={() => handleDelete(category)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {category.children?.map((child) => (
                <div className="admin-subcategory-row" key={child.uuid}>
                  <div className="admin-subcategory-name">
                    <ChevronRight size={14} />

                    <div>
                      <strong>{child.name}</strong>

                      <span>/{child.slug}</span>
                    </div>
                  </div>

                  <div className="admin-category-row-actions">
                    <button onClick={() => openEdit(child, category)}>
                      <Edit3 size={14} />
                    </button>

                    <button onClick={() => handleDelete(child)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {categories.length === 0 && (
            <div className="admin-empty-category">No categories found.</div>
          )}
        </div>
      </section>

      {modalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-category-modal">
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">CATEGORY</span>

                <h2>
                  {editingCategory
                    ? "Edit Category"
                    : parentUuid
                      ? "Add Subcategory"
                      : "Add Category"}
                </h2>
              </div>

              <button
                className="admin-modal-close"
                onClick={() => setModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Category Name</label>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Example: Anklets"
                  autoFocus
                />
              </div>

              <div className="admin-form-group">
                <label>Parent Category</label>

                <select
                  value={parentUuid}
                  onChange={(event) => setParentUuid(event.target.value)}
                >
                  <option value="">None — Main Category</option>

                  {categories
                    .filter(
                      (category) => category.uuid !== editingCategory?.uuid,
                    )
                    .map((category) => (
                      <option key={category.uuid} value={category.uuid}>
                        {category.name}
                      </option>
                    ))}
                </select>
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
                    : editingCategory
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCategories;
