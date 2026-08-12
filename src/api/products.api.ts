// src/api/products.api.ts

const API_URL = "http://localhost:5003/api/v1";

export const getProducts = async (params?: {
  category?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams();

  if (params?.category) {
    query.set("category", params.category);
  }

  if (params?.featured !== undefined) {
    query.set("featured", String(params.featured));
  }

  if (params?.search) {
    query.set("search", params.search);
  }

  if (params?.page) {
    query.set("page", String(params.page));
  }

  if (params?.limit) {
    query.set("limit", String(params.limit));
  }

  const url =
    `${API_URL}/products` + (query.toString() ? `?${query.toString()}` : "");

  const response = await fetch(url);

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
