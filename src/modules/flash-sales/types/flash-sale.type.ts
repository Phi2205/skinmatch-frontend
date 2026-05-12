export interface CreateFlashSaleItemPayload {
  product_id: number;
  variant_id?: number;
  sale_price: number;
}

export interface CreateFlashSaleCampaignPayload {
  title: string;
  start_at: string; // ISO string
  end_at: string;   // ISO string
  is_active?: boolean;
  items: CreateFlashSaleItemPayload[];
}

export interface FlashSaleItem {
  id: number;
  campaign_id: number;
  product_id: number;
  variant_id?: number | null;
  sale_price: number;
  products?: {
    id: number;
    name: string;
    slug: string;
    image_url?: string | null;
    summary?: string | null;
  };
  variants?: {
    id: number;
    price: number;
    sku: string;
    stock: number;
  } | null;
}

export interface FlashSaleCampaign {
  id: number;
  title: string;
  start_at: string;
  end_at: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  items: FlashSaleItem[];
}

export interface FlashSaleProductVariant {
  id: number;
  variant_id?: number | null;
  sale_price: number;
  variants?: {
    id: number;
    price: number;
    sku: string;
    stock: number;
    attributes?: Array<{ id: number; name: string; value: string }>;
  } | null;
}

export interface FlashSaleProduct {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
  summary?: string | null;
  rating_sum?: number;
  review_count?: number;
  flash_sale_items: FlashSaleProductVariant[];
}
