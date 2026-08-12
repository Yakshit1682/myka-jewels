export type ProductImage = {
  id?: number;
  uuid?: string;

  data_uri: string;

  alt_text?: string | null;

  sort_order: number;

  is_primary: boolean;
};

export type Category = {
  uuid: string;

  name: string;

  slug: string;

  children?: Category[];
};

export interface Product {
  uuid: string;

  name: string;

  slug: string;

  sku?: string | null;

  short_description?: string | null;

  description?: string | null;

  material?: string | null;

  metal_color?: string | null;

  price?: string | number | null;

  compare_at_price?: string | number | null;

  weight_grams?: string | number | null;

  stock_status: "IN_STOCK" | "OUT_OF_STOCK" | "ON_REQUEST";

  is_featured: boolean;

  is_active: boolean;

  images: ProductImage[];

  categories: Category[];
}
