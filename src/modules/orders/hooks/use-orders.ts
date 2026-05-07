'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserOrders, getOrderById } from '../services/orders.service';
import { Order } from '../types/orders.type';
import { toast } from 'sonner';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUserOrders();
      if (response.success && response.data) {
        setOrders(response.data);
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
    isLoading,
    error,
    fetchOrders,
    getOrderDetails
  };
}
