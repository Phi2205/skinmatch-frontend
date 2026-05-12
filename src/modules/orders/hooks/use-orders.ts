'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserOrders, getOrderById } from '../services/orders.service';
import { Order } from '../types/orders.type';
import { PaginationMeta } from '@/modules/product/types/product.type';
import { toast } from 'sonner';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (page?: number, limit?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUserOrders(page, limit);
      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          setOrders(response.data);
          setMeta(null);
        } else {
          setOrders(response.data.items);
          setMeta(response.data.meta);
        }
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('An error occurred while fetching orders');
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOrderDetails = async (id: number) => {
    try {
      const response = await getOrderById(id);
      return response.data;
    } catch (err) {
      toast.error('Failed to load order details');
      return null;
    }
  };

  return {
    orders,
    meta,
    isLoading,
    error,
    fetchOrders,
    getOrderDetails
  };
}
