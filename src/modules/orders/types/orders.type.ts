export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    slug: string;
    thumbnail: string | null;
  };
  variant: {
    id: number;
    volume: string;
    sku: string | null;
  } | null;
}

export interface Order {
  id: number;
  user_id: number;
  total_price: number;
  status: string;
  payment_method: string;
  payment_status: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_email: string | null;
  address_line: string;
  ward: string | null;
  district: string | null;
  city: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payUrl?: string;
}


export interface CreateOrderRequest {
  receiver_name: string;
  receiver_phone: string;
  receiver_email?: string;
  address_line: string;
  ward?: string;
  district?: string;
  city?: string;
  note?: string;
  payment_method: string;
}

export interface CreateDirectOrderRequest extends CreateOrderRequest {
  product_id: number;
  variant_id?: number;
  quantity: number;
}
