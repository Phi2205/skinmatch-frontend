'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  CartItem,
  fetchBackendCart,
  addToCartThunk,
  updateQuantityThunk,
  removeCartItemThunk,
  clearCartThunk,
  initializeGuestCart
} from '../store/cart.slice';

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity: number, variantId?: number) => Promise<void>;
  removeItem: (id: string | number) => Promise<void>;
  updateQuantity: (id: string | number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  itemCount: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  
  const items = useAppSelector((state) => state.cart.items);
  const isLoading = useAppSelector((state) => state.cart.isLoading);

  // Initialize cart based on authentication state
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchBackendCart());
    } else {
      dispatch(initializeGuestCart());
    }
  }, [isAuthenticated, dispatch]);

  const addItem = async (product: any, quantity: number, variantId?: number) => {
    await dispatch(addToCartThunk({ product, quantity, variantId, isAuthenticated }));
  };

  const removeItem = async (id: string | number) => {
    await dispatch(removeCartItemThunk({ id, isAuthenticated }));
  };

  const updateQuantity = async (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }
    await dispatch(updateQuantityThunk({ id, quantity, isAuthenticated }));
  };

  const clearCart = async () => {
    await dispatch(clearCartThunk({ isAuthenticated }));
  };

  const refreshCart = async () => {
    if (isAuthenticated) {
      await dispatch(fetchBackendCart());
    }
  };

  const total = items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isLoading,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
