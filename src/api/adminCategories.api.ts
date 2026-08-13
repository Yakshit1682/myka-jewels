const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);

  return response.json();
};

export const createCategory = async (payload: {
  name: string;
  parent_uuid?: string | null;
}) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },

    body: JSON.stringify(payload),
  });

  return response.json();
};

export const updateCategory = async (
  uuid: string,
  payload: {
    name?: string;
    parent_uuid?: string | null;
    is_active?: boolean;
  },
) => {
  const response = await fetch(`${API_URL}/categories/${uuid}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },

    body: JSON.stringify(payload),
  });

  return response.json();
};

export const deleteCategory = async (uuid: string) => {
  const response = await fetch(`${API_URL}/categories/${uuid}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
};
