import { Product, ProductVariant } from "../../product/types/product.type";

export interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    variant_id: number | null;
    quantity: number;
    created_at: string;
    updated_at: string;
    products: Product;
    variants: ProductVariant | null;
}

export interface AddToCartRequest {
    productId: number;
    variantId?: number;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}
