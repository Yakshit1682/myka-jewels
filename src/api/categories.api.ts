// src/api/categories.api.ts

const API_URL = "http://localhost:5003/api/v1";

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);

  return response.json();
};
