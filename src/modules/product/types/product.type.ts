export interface Product {
  id: number;
  name: string;
  price: number;
  category_id: number | null;
  description: string | null;
  ingredient_full_text: string | null;
  usage_instructions: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  summary: string | null;
  created_at: string | null;
  categories: {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
  } | null;
  product_images: {
    id: number;
    image_url: string;
    alt_text: string | null;
    is_main: boolean;
  }[];
  badges: {
    id: number;
    name: string;
    slug: string;
    icon_url: string | null;
  }[];
  concerns: {
    id: number;
    name: string;
    slug: string;
  }[];
  skin_types: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  }[];
  ingredients: {
    id: number;
    name: string;
    slug: string;
  }[];
  images: {
    id: number;
    image_url: string;
    alt_text: string | null;
    is_main: boolean;
    position: number;
  }[];
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  concern_ids?: string;
  skin_type_ids?: string;
  badge_ids?: string;
  min_price?: number;
  max_price?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    meta: PaginationMeta;
  };
}
