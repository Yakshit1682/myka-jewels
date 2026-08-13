// src/api/categories.api.ts

const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);

  return response.json();
};
