'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/authContext';
import { getCart, addToCart as addToCartApi, updateCartItemQuantity as updateQuantityApi, removeCartItem as removeCartItemApi, clearCart as clearCartApi } from '../services/cart.service';
import { toast } from 'sonner';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  slug: string;
  productId?: number;
  variantId?: number | null;
  attributes?: { name: string; value: string }[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: any, quantity: number, variantId?: number) => Promise<void>;
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
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchBackendCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getCart();
      if (response.success && response.data) {
        const mappedItems: CartItem[] = response.data.map((item) => ({
          id: item.id,
          name: item.products.name,
          price: item.variants ? item.variants.price : item.products.price,
          quantity: item.quantity,
          imageUrl: item.products.image_url || '/placeholder.png',
          slug: item.products.slug,
          productId: item.product_id,
          variantId: item.variant_id,
          attributes: item.variants?.attributes || []
        }));
        setItems(mappedItems);
      }
    } catch (error) {
      console.error('Failed to fetch backend cart:', error);
      toast.error('Failed to load cart from server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize cart
  useEffect(() => {
    const initCart = async () => {
      if (isAuthenticated) {
        await fetchBackendCart();
      } else {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            setItems(JSON.parse(savedCart));
          } catch (error) {
            console.error('Failed to parse local cart:', error);
          }
        }
        setIsLoading(false);
      }
      setIsInitialized(true);
    };

    initCart();
  }, [isAuthenticated, fetchBackendCart]);

  // Sync local storage if not authenticated
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated, isInitialized]);

  const addItem = async (product: any, quantity: number, variantId?: number) => {
    if (isAuthenticated) {
      try {
        const response = await addToCartApi({
          productId: product.id,
          variantId,
          quantity
        });
        if (response.success) {
          await fetchBackendCart();
          toast.success('Added to cart');
        }
      } catch (error) {
        toast.error('Failed to add to cart');
      }
    } else {
      setItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.productId === product.id && i.variantId === variantId);

        if (existingItem) {
          return prevItems.map((i) =>
            (i.productId === product.id && i.variantId === variantId)
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }

        const newItem: CartItem = {
          id: `local-${Date.now()}`,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl || product.image_url || '/placeholder.png',
          slug: product.slug,
          productId: product.id,
          variantId
        };
        return [...prevItems, newItem];
      });
      toast.success('Added to local cart');
    }
  };

  const removeItem = async (id: string | number) => {
    if (isAuthenticated && typeof id === 'number') {
      try {
        const response = await removeCartItemApi(id);
        if (response.success) {
          setItems((prev) => prev.filter((i) => i.id !== id));
        }
      } catch (error) {
        toast.error('Failed to remove item');
      }
    } else {
      setItems((prevItems) => prevItems.filter((i) => i.id !== id));
    }
  };

  const updateQuantity = async (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    if (isAuthenticated && typeof id === 'number') {
      try {
        const response = await updateQuantityApi(id, { quantity });
        if (response.success) {
          setItems((prevItems) =>
            prevItems.map((i) =>
              i.id === id ? { ...i, quantity } : i
            )
          );
        }
      } catch (error) {
        toast.error('Failed to update quantity');
      }
    } else {
      setItems((prevItems) =>
        prevItems.map((i) =>
          i.id === id ? { ...i, quantity } : i
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await clearCartApi();
        setItems([]);
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    } else {
      setItems([]);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
        refreshCart: fetchBackendCart,
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
