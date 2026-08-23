// src/api/products.api.ts

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (params?: {
  category?: string;
  collection?: string;
  featured?: boolean;
  search?: string;
  stock_status?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams();

  if (params?.category) {
    query.set("category", params.category);
  }

  if (params?.collection) {
    query.set("collection", params.collection);
  }

  if (params?.featured !== undefined) {
    query.set("featured", String(params.featured));
  }

  if (params?.search) {
    query.set("search", params.search);
  }

  if (params?.stock_status) {
    query.set("stock_status", params.stock_status);
  }

  if (params?.min_price !== undefined) {
    query.set("min_price", String(params.min_price));
  }

  if (params?.max_price !== undefined) {
    query.set("max_price", String(params.max_price));
  }

  if (params?.sort) {
    query.set("sort", params.sort);
  }

  if (params?.page) {
    query.set("page", String(params.page));
  }

  if (params?.limit) {
    query.set("limit", String(params.limit));
  }

  const response = await fetch(`${API_URL}/products?${query.toString()}`);

  return response.json();
};

export const getProductBySlug = async (slug: string) => {
  const response = await fetch(`${API_URL}/products/${slug}`);

  return response.json();
};

export const getSignatureProducts = async () => {
  const response = await fetch(`${API_URL}/products/signature`);

  return response.json();
};
