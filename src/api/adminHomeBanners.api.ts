const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");

export const getAdminHomeBanners = async () => {
  const response = await fetch(`${API_URL}/admin/home-banners`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },

  });

  return response.json();
};

export const createHomeBanner = async (payload: unknown) => {
  const response = await fetch(`${API_URL}/admin/home-banners`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },

    credentials: "include",

    body: JSON.stringify(payload),
  });

  return response.json();
};

export const updateHomeBanner = async (uuid: string, payload: unknown) => {
  const response = await fetch(`${API_URL}/admin/home-banners/${uuid}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },

    credentials: "include",

    body: JSON.stringify(payload),
  });

  return response.json();
};

export const deleteHomeBanner = async (uuid: string) => {
  const response = await fetch(`${API_URL}/admin/home-banners/${uuid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: "include",
  });

  return response.json();
};
