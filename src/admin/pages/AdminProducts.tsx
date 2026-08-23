import { Edit3, ImagePlus, Plus, Search, Trash2, X } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import {
  createProduct,
  disableProduct,
  getAdminProducts,
  getCategories,
  updateProduct,
} from "../../api/adminProducts.api";

import { getCollections } from "../../api/adminCollections.api";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

type Category = {
  uuid: string;
  name: string;
  slug: string;
  parent_id?: number | null;
  children?: Category[];
};

type Collection = {
  uuid: string;
  name: string;
  slug: string;
  description?: string | null;
  image_data_uri?: string | null;
  is_active?: boolean;
};

type ProductImage = {
  id?: number;
  data_uri: string;
  is_primary?: boolean;
  sort_order?: number;
};

type ProductCategoryMapping = {
  id?: number;

  category_id?: number;

  collection_id?: number | null;

  is_primary?: boolean;

  category?: Category;

  collection?: Collection | null;
};

type Product = {
  id?: number;

  uuid: string;

  name: string;

  slug: string;

  sku?: string | null;

  short_description?: string | null;

  description?: string | null;

  material?: string | null;

  price?: string | number | null;

  is_featured: boolean;

  is_active: boolean;

  sort_order?: number;

  images?: ProductImage[];

  /*
   * New backend response.
   */
  product_categories?: ProductCategoryMapping[];
};

type CategoryCollectionSelection = {
  category_uuid: string;

  collection_uuids: string[];
};

type ProductForm = {
  name: string;

  sku: string;

  short_description: string;

  description: string;

  material: string;

  price: string;

  is_featured: boolean;

  sort_order: number;

  category_collections: CategoryCollectionSelection[];

  images: ProductImage[];
};

/*
|--------------------------------------------------------------------------
| INITIAL FORM
|--------------------------------------------------------------------------
*/

const initialForm: ProductForm = {
  name: "",

  sku: "",

  short_description: "",

  description: "",

  material: "",

  price: "",

  is_featured: false,

  sort_order: 0,

  category_collections: [],

  images: [],
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const AdminProducts = () => {
  /*
   * DATA
   */

  const [products, setProducts] = useState<Product[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [collections, setCollections] = useState<Collection[]>([]);

  /*
   * FORM
   */

  const [form, setForm] = useState<ProductForm>(initialForm);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  /*
   * UI
   */

  const [openModal, setOpenModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD DATA
  |--------------------------------------------------------------------------
  */

  const loadData = async () => {
    try {
      const [productsResponse, categoriesResponse, collectionsResponse] =
        await Promise.all([
          getAdminProducts(),

          getCategories(),

          getCollections(),
        ]);

      if (productsResponse.success) {
        setProducts(productsResponse.data || []);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data || []);
      }

      if (collectionsResponse.success) {
        setCollections(collectionsResponse.data || []);
      }
    } catch (error) {
      console.error("Unable to load admin product data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FLATTEN CATEGORIES
  |--------------------------------------------------------------------------
  |
  | Example:
  |
  | Earrings
  |   Hoops
  |   Studs
  |
  | becomes:
  |
  | Earrings
  | Hoops
  | Studs
  |
  */

  const flatCategories = useMemo(() => {
    const result: Category[] = [];

    categories.forEach((category) => {
      result.push(category);

      category.children?.forEach((child) => {
        result.push(child);
      });
    });

    return result;
  }, [categories]);

  /*
  |--------------------------------------------------------------------------
  | FILTER PRODUCTS
  |--------------------------------------------------------------------------
  */

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(value) ||
        product.sku?.toLowerCase().includes(value)
      );
    });
  }, [products, search]);

  /*
  |--------------------------------------------------------------------------
  | CREATE MODAL
  |--------------------------------------------------------------------------
  */

  const openCreateModal = () => {
    setEditingProduct(null);

    setForm(initialForm);

    setOpenModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT MODAL
  |--------------------------------------------------------------------------
  */

  const openEditModal = (product: Product) => {
    setEditingProduct(product);

    /*
     * Backend returns something like:
     *
     * [
     *   {
     *     category: Hoops,
     *     collection: Anti-Tarnish
     *   },
     *   {
     *     category: Hoops,
     *     collection: Best Sellers
     *   }
     * ]
     *
     * Frontend needs:
     *
     * [
     *   {
     *     category_uuid: Hoops,
     *     collection_uuids: [
     *       Anti-Tarnish,
     *       Best Sellers
     *     ]
     *   }
     * ]
     */

    const categoryCollectionMap = new Map<string, string[]>();

    product.product_categories?.forEach((mapping) => {
      if (!mapping.category) {
        return;
      }

      const categoryUuid = mapping.category.uuid;

      const existing = categoryCollectionMap.get(categoryUuid) || [];

      if (mapping.collection?.uuid) {
        /*
         * Avoid duplicate collection UUIDs.
         */

        if (!existing.includes(mapping.collection.uuid)) {
          existing.push(mapping.collection.uuid);
        }
      }

      categoryCollectionMap.set(categoryUuid, existing);
    });

    const categoryCollections: CategoryCollectionSelection[] = Array.from(
      categoryCollectionMap.entries(),
    ).map(([category_uuid, collection_uuids]) => ({
      category_uuid,

      collection_uuids,
    }));

    setForm({
      name: product.name || "",

      sku: product.sku || "",

      short_description: product.short_description || "",

      description: product.description || "",

      material: product.material || "",

      price:
        product.price !== null && product.price !== undefined
          ? String(product.price)
          : "",

      is_featured: Boolean(product.is_featured),

      sort_order: product.sort_order || 0,

      category_collections: categoryCollections,

      images:
        product.images?.map((image, index) => ({
          data_uri: image.data_uri,

          is_primary: image.is_primary ?? index === 0,

          sort_order: image.sort_order ?? index,
        })) || [],
    });

    setOpenModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | BASIC INPUT CHANGE
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
  | CATEGORY TOGGLE
  |--------------------------------------------------------------------------
  |
  | Selecting category:
  |
  | Hoops
  |
  | creates:
  |
  | {
  |   category_uuid: "hoops-uuid",
  |   collection_uuids: []
  | }
  |
  */

  const handleCategoryToggle = (categoryUuid: string) => {
    setForm((current) => {
      const exists = current.category_collections.some(
        (item) => item.category_uuid === categoryUuid,
      );

      /*
       * Remove category and all
       * its collection selections.
       */

      if (exists) {
        return {
          ...current,

          category_collections: current.category_collections.filter(
            (item) => item.category_uuid !== categoryUuid,
          ),
        };
      }

      /*
       * Add category.
       */

      return {
        ...current,

        category_collections: [
          ...current.category_collections,

          {
            category_uuid: categoryUuid,

            collection_uuids: [],
          },
        ],
      };
    });
  };

  /*
  |--------------------------------------------------------------------------
  | COLLECTION TOGGLE
  |--------------------------------------------------------------------------
  |
  | Collection is always linked to
  | a specific selected category.
  |
  */

  const handleCollectionToggle = (
    categoryUuid: string,
    collectionUuid: string,
  ) => {
    setForm((current) => ({
      ...current,

      category_collections: current.category_collections.map((item) => {
        if (item.category_uuid !== categoryUuid) {
          return item;
        }

        const exists = item.collection_uuids.includes(collectionUuid);

        return {
          ...item,

          collection_uuids: exists
            ? item.collection_uuids.filter((uuid) => uuid !== collectionUuid)
            : [...item.collection_uuids, collectionUuid],
        };
      }),
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
  | IMAGES
  |--------------------------------------------------------------------------
  */

  const handleImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const remaining = 4 - form.images.length;

    if (remaining <= 0) {
      alert("Maximum 4 images are allowed");

      return;
    }

    const selectedFiles = files.slice(0, remaining);

    const dataUris = await Promise.all(selectedFiles.map(fileToDataUri));

    setForm((current) => {
      const newImages = dataUris.map((dataUri, index) => ({
        data_uri: dataUri,

        sort_order: current.images.length + index,

        is_primary: current.images.length === 0 && index === 0,
      }));

      return {
        ...current,

        images: [...current.images, ...newImages],
      };
    });

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

          sort_order: imageIndex,

          is_primary: imageIndex === 0,
        })),
      };
    });
  };

  /*
  |--------------------------------------------------------------------------
  | PRIMARY IMAGE
  |--------------------------------------------------------------------------
  */

  const setPrimaryImage = (index: number) => {
    setForm((current) => ({
      ...current,

      images: current.images.map((image, imageIndex) => ({
        ...image,

        is_primary: imageIndex === index,
      })),
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE / UPDATE PRODUCT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Product name is required");

      return;
    }

    if (form.images.length > 4) {
      alert("Maximum 4 images are allowed");

      return;
    }

    setLoading(true);

    try {
      /*
       * IMPORTANT:
       *
       * This exactly matches the
       * updated backend:
       *
       * category_collections: [
       *   {
       *     category_uuid,
       *     collection_uuids
       *   }
       * ]
       */

      const payload = {
        name: form.name.trim(),

        sku: form.sku.trim() || null,

        short_description: form.short_description.trim() || null,

        description: form.description.trim() || null,

        material: form.material.trim() || null,

        price: form.price !== "" ? Number(form.price) : null,

        is_featured: form.is_featured,

        sort_order: Number(form.sort_order || 0),

        category_collections: form.category_collections.map((item) => ({
          category_uuid: item.category_uuid,

          collection_uuids: item.collection_uuids,
        })),

        images: form.images,
      };

      console.log("Product payload:", payload);

      /*
       * CREATE
       *
       * POST /admin/products
       */

      /*
       * UPDATE
       *
       * PUT /admin/products/:uuid
       */

      const response = editingProduct
        ? await updateProduct(editingProduct.uuid, payload)
        : await createProduct(payload);

      if (!response.success) {
        alert(response.message || "Unable to save product");

        return;
      }

      setOpenModal(false);

      setEditingProduct(null);

      setForm(initialForm);

      await loadData();
    } catch (error) {
      console.error("Save product error:", error);

      alert("Unable to save product");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DISABLE PRODUCT
  |--------------------------------------------------------------------------
  */

  const handleDisable = async (product: Product) => {
    const confirmed = window.confirm(`Disable ${product.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await disableProduct(product.uuid);

      if (!response.success) {
        alert(response.message);

        return;
      }

      await loadData();
    } catch (error) {
      console.error(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PRODUCT CATEGORY NAMES
  |--------------------------------------------------------------------------
  */

  const getProductCategories = (product: Product) => {
    const names = new Map<string, Category>();

    product.product_categories?.forEach((mapping) => {
      if (mapping.category) {
        names.set(
          mapping.category.uuid,

          mapping.category,
        );
      }
    });

    return Array.from(names.values());
  };

  /*
  |--------------------------------------------------------------------------
  | JSX
  |--------------------------------------------------------------------------
  */

  return (
    <>
      {/* ===================================================
          PAGE HEADING
      =================================================== */}

      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CATALOGUE</span>

          <h2>Products</h2>

          <p>Manage your jewellery catalogue.</p>
        </div>

        <button className="admin-primary-button" onClick={openCreateModal}>
          <Plus size={15} />
          Add Product
        </button>
      </div>

      {/* ===================================================
          PRODUCT TABLE
      =================================================== */}

      <section className="admin-panel-card">
        <div className="admin-products-toolbar">
          <div className="admin-products-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
            />
          </div>

          <span>{filteredProducts.length} products</span>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table admin-products-table">
            <thead>
              <tr>
                <th>Product</th>

                <th>SKU</th>

                <th>Categories</th>

                <th>Price</th>

                <th>Featured</th>

                <th>Status</th>

                <th />
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const primaryImage =
                  product.images?.find((image) => image.is_primary) ||
                  product.images?.[0];

                const productCategories = getProductCategories(product);

                return (
                  <tr key={product.uuid}>
                    {/* PRODUCT */}

                    <td>
                      <div className="admin-table-product">
                        <div className="admin-table-product-image">
                          {primaryImage ? (
                            <img
                              src={primaryImage.data_uri}
                              alt={product.name}
                            />
                          ) : (
                            <span>No image</span>
                          )}
                        </div>

                        <div>
                          <strong>{product.name}</strong>

                          <span>{product.material || "—"}</span>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}

                    <td>{product.sku || "—"}</td>

                    {/* CATEGORIES */}

                    <td>
                      <div className="admin-category-tags">
                        {productCategories.slice(0, 2).map((category) => (
                          <span key={category.uuid}>{category.name}</span>
                        ))}

                        {productCategories.length > 2 && (
                          <span>+{productCategories.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* PRICE */}

                    <td>
                      {product.price
                        ? `₹${Number(product.price).toLocaleString("en-IN")}`
                        : "—"}
                    </td>

                    {/* FEATURED */}

                    <td>{product.is_featured ? "Yes" : "No"}</td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`admin-status ${
                          product.is_active
                            ? "status-contacted"
                            : "status-disabled"
                        }`}
                      >
                        {product.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="admin-table-actions">
                        <button
                          onClick={() => openEditModal(product)}
                          aria-label="Edit"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={() => handleDisable(product)}
                          aria-label="Disable"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty-state">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================================================
          CREATE / EDIT MODAL
      =================================================== */}

      {openModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-product-modal">
            {/* HEADER */}

            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">
                  {editingProduct ? "EDIT" : "NEW PRODUCT"}
                </span>

                <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setOpenModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="admin-product-form">
              {/* BASIC DATA */}

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Product Name *</label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Royal Meenakari Jhumka"
                  />
                </div>

                <div className="admin-form-group">
                  <label>SKU</label>

                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="JHM-001"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Material</label>

                  <input
                    name="material"
                    value={form.material}
                    onChange={handleChange}
                    placeholder="Gold Plated"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Price</label>

                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="2499"
                  />
                </div>
              </div>

              {/* SHORT DESCRIPTION */}

              <div className="admin-form-group">
                <label>Short Description</label>

                <textarea
                  name="short_description"
                  value={form.short_description}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              {/* DESCRIPTION */}

              <div className="admin-form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              {/* ===================================================
                  CATEGORIES + COLLECTIONS
              =================================================== */}

              <div className="admin-form-group">
                <label>Categories</label>

                <div className="admin-category-selector">
                  {flatCategories.map((category) => {
                    const selectedCategory = form.category_collections.find(
                      (item) => item.category_uuid === category.uuid,
                    );

                    const isSelected = Boolean(selectedCategory);

                    return (
                      <div
                        key={category.uuid}
                        className="admin-category-collection-group"
                      >
                        {/* CATEGORY TAG */}

                        <label
                          className={`admin-category-option ${
                            isSelected ? "selected" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCategoryToggle(category.uuid)}
                          />

                          {category.name}
                        </label>

                        {/* COLLECTION TAGS */}

                        {isSelected && (
                          <div className="admin-collection-selector">
                            <span className="admin-collection-label">
                              Collections
                            </span>

                            <div className="admin-collection-tags">
                              {collections.map((collection) => {
                                const collectionSelected =
                                  selectedCategory?.collection_uuids.includes(
                                    collection.uuid,
                                  ) || false;

                                return (
                                  <button
                                    key={collection.uuid}
                                    type="button"
                                    className={`admin-collection-tag ${
                                      collectionSelected ? "selected" : ""
                                    }`}
                                    onClick={() =>
                                      handleCollectionToggle(
                                        category.uuid,

                                        collection.uuid,
                                      )
                                    }
                                  >
                                    {collection.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ===================================================
                  PRODUCT IMAGES
              =================================================== */}

              <div className="admin-form-group">
                <div className="admin-image-heading">
                  <label>Product Images</label>

                  <span>
                    {form.images.length}
                    /4
                  </span>
                </div>

                <div className="admin-image-grid">
                  {form.images.map((image, index) => (
                    <div
                      key={index}
                      className={`admin-image-preview ${
                        image.is_primary ? "primary" : ""
                      }`}
                    >
                      <img src={image.data_uri} alt={`Product ${index + 1}`} />

                      {image.is_primary && (
                        <span className="admin-primary-image-label">
                          Primary
                        </span>
                      )}

                      <div className="admin-image-actions">
                        {!image.is_primary && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                          >
                            Set Primary
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {form.images.length < 4 && (
                    <label className="admin-image-upload">
                      <ImagePlus size={24} />

                      <span>Add Images</span>

                      <small>Maximum 4</small>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        onChange={handleImages}
                        hidden
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* ===================================================
                  FORM BOTTOM
              =================================================== */}

              <div className="admin-form-bottom">
                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        is_featured: event.target.checked,
                      }))
                    }
                  />
                  Featured product
                </label>

                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() => setOpenModal(false)}
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
                      : editingProduct
                        ? "Update Product"
                        : "Create Product"}
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

export default AdminProducts;
