// src/api/adminProducts.api.ts

const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");

export const getAdminProducts = async () => {
  const response = await fetch(`${API_URL}/products?limit=100`);

  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);

  return response.json();
};

export const createProduct = async (payload: any) => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};

export const updateProduct = async (uuid: string, payload: any) => {
  const response = await fetch(`${API_URL}/products/${uuid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};

export const disableProduct = async (uuid: string) => {
  const response = await fetch(`${API_URL}/products/${uuid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
};
