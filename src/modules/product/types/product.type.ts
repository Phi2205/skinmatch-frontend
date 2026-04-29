export interface Product {
  id: number;
  name: string;
  price: number;
  category_id: number | null;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  summary: string | null;
  created_at: string | null;
  categories: {
    id: number;
    name: string;
    slug: string;
  } | null;
  product_images: {
    id: number;
    image_url: string;
    alt_text: string | null;
    is_main: boolean;
  }[];
  product_badges: {
    badges: {
      id: number;
      name: string;
      slug: string;
      icon_url: string | null;
    };
  }[];
  product_concerns: {
    concerns: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
  product_skin_types: {
    skin_types: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
  product_ingredients: {
    ingredients: {
      id: number;
      name: string;
      slug: string;
    };
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
