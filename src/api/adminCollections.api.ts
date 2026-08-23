const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");

export type CollectionPayload = {
  name: string;
  description?: string | null;
  image_data_uri?: string | null;
  sort_order?: number;
  is_active?: boolean;
};

export const getCollections = async () => {
  const response = await fetch(`${API_URL}/admin/collections`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
};

export const getCollectionByUuid = async (uuid: string) => {
  const response = await fetch(`${API_URL}/admin/collections/${uuid}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
};

export const createCollection = async (payload: CollectionPayload) => {
  const response = await fetch(`${API_URL}/admin/collections`, {
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

export const updateCollection = async (
  uuid: string,
  payload: Partial<CollectionPayload>,
) => {
  const response = await fetch(`${API_URL}/admin/collections/${uuid}`, {
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

export const deleteCollection = async (uuid: string) => {
  const response = await fetch(`${API_URL}/admin/collections/${uuid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: "include",
  });

  return response.json();
};
