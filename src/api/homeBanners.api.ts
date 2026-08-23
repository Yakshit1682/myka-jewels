// src/api/homeBanners.api.ts

const API_URL = import.meta.env.VITE_API_URL;

export const getHomeBanners = async () => {
  const response = await fetch(`${API_URL}/home/banners`);

  return response.json();
};
