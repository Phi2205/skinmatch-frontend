export interface PaymentTransaction {
  id: number;
  order_id: number;
  transaction_id: string | null;
  payment_method: string;
  amount: number;
  status: string;
  raw_response: any;
  created_at: string;
}

export interface CreateMomoPaymentRequest {
  orderId: number;
  amount: number;
}

export interface MomoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  shortLink?: string;
}
