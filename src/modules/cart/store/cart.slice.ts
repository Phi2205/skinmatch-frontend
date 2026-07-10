'use client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCart, addToCart as addToCartApi, updateCartItemQuantity as updateQuantityApi, removeCartItem as removeCartItemApi, clearCart as clearCartApi } from '../services/cart.service';
import { toast } from 'sonner';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  slug: string;
  productId: number;
  variantId?: number | null;
  attributes?: { name: string; value: string }[];
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null
};

// --- Async Thunks ---

// 1. Lấy giỏ hàng từ Backend
export const fetchBackendCart = createAsyncThunk(
  'cart/fetchBackend',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCart();
      if (response.success && response.data) {
        // Map dữ liệu từ API sang dạng CartItem Client
        const mappedItems: CartItem[] = response.data.map((item) => ({
          id: item.id,
          name: item.products.name,
          price: item.variants ? Number(item.variants.price) : Number(item.products.price),
          quantity: item.quantity,
          imageUrl: item.products.image_url || '/placeholder.png',
          slug: item.products.slug,
          productId: item.product_id,
          variantId: item.variant_id,
          attributes: item.variants?.attributes || []
        }));
        return mappedItems;
      }
      return rejectWithValue('Không thể tải giỏ hàng');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }
);

// 2. Thêm vào giỏ hàng
export const addToCartThunk = createAsyncThunk(
  'cart/add',
  async ({ product, quantity, variantId, isAuthenticated }: { product: any; quantity: number; variantId?: number; isAuthenticated: boolean }, { dispatch, rejectWithValue }) => {
    if (isAuthenticated) {
      try {
        const response = await addToCartApi({
          productId: product.id,
          variantId,
          quantity
        });
        if (response.success) {
          toast.success('Đã thêm sản phẩm vào giỏ hàng');
          dispatch(fetchBackendCart());
        }
      } catch (error) {
        toast.error('Không thể thêm sản phẩm');
        return rejectWithValue('Lỗi API');
      }
    } else {
      // Logic cho khách vãng lai (Guest)
      toast.success('Đã thêm sản phẩm vào giỏ hàng tạm thời');
      return { product, quantity, variantId };
    }
  }
);

// 3. Cập nhật số lượng
export const updateQuantityThunk = createAsyncThunk(
  'cart/updateQuantity',
  async ({ id, quantity, isAuthenticated }: { id: string | number; quantity: number; isAuthenticated: boolean }, { dispatch, rejectWithValue }) => {
    if (isAuthenticated && typeof id === 'number') {
      try {
        const response = await updateQuantityApi(id, { quantity });
        if (response.success) {
          return { id, quantity };
        }
      } catch (error) {
        toast.error('Không thể cập nhật số lượng');
        return rejectWithValue('Lỗi API');
      }
    } else {
      return { id, quantity };
    }
  }
);

// 4. Xóa sản phẩm khỏi giỏ hàng
export const removeCartItemThunk = createAsyncThunk(
  'cart/removeItem',
  async ({ id, isAuthenticated }: { id: string | number; isAuthenticated: boolean }, { rejectWithValue }) => {
    if (isAuthenticated && typeof id === 'number') {
      try {
        const response = await removeCartItemApi(id);
        if (response.success) {
          return id;
        }
      } catch (error) {
        toast.error('Không thể xóa sản phẩm');
        return rejectWithValue('Lỗi API');
      }
    } else {
      return id;
    }
  }
);

// 5. Xóa sạch giỏ hàng
export const clearCartThunk = createAsyncThunk(
  'cart/clear',
  async ({ isAuthenticated }: { isAuthenticated: boolean }, { rejectWithValue }) => {
    if (isAuthenticated) {
      try {
        await clearCartApi();
        return;
      } catch (error) {
        toast.error('Không thể dọn sạch giỏ hàng');
        return rejectWithValue('Lỗi API');
      }
    }
    return;
  }
);

// --- Slice ---
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Khởi tạo giỏ hàng từ localStorage (dành cho khách)
    initializeGuestCart: (state) => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('cart');
        if (saved) {
          try {
            state.items = JSON.parse(saved);
          } catch (e) {
            console.error('Lỗi phân tích cú pháp giỏ hàng local:', e);
          }
        }
      }
    },
    // Đồng bộ trực tiếp state của khách sang localStorage
    syncGuestCartToStorage: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchBackendCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBackendCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBackendCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Add To Cart (Dành cho khách)
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        if (action.payload) {
          // Chỉ chạy khi payload trả về (Guest mode)
          const { product, quantity, variantId } = action.payload;
          const existingItem = state.items.find(
            (i) => i.productId === product.id && i.variantId === variantId
          );

          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            state.items.push({
              id: `local-${Date.now()}`,
              name: product.name,
              price: product.price,
              quantity,
              imageUrl: product.imageUrl || product.image_url || '/placeholder.png',
              slug: product.slug,
              productId: product.id,
              variantId
            });
          }
          // Lưu storage
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(state.items));
          }
        }
      })

      // Update Quantity
      .addCase(updateQuantityThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const { id, quantity } = action.payload;
          const item = state.items.find((i) => i.id === id);
          if (item) {
            item.quantity = quantity;
          }
          // Đồng bộ nếu là guest
          if (typeof id === 'string' && id.startsWith('local-') && typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(state.items));
          }
        }
      })

      // Remove Item
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((i) => i.id !== id);
        // Đồng bộ nếu là guest
        if (typeof id === 'string' && id.startsWith('local-') && typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(state.items));
        }
      })

      // Clear Cart
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.items = [];
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart');
        }
      });
  }
});

export const { initializeGuestCart, syncGuestCartToStorage } = cartSlice.actions;
export default cartSlice.reducer;
