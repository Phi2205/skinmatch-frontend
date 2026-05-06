'use client';

import { useState } from 'react';
import { createMomoLink, getOrderStatus } from '../services/payments.service';
import { CreateMomoPaymentRequest } from '../types/payments.type';
import { toast } from 'sonner';

export function usePayments() {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiateMomoPayment = async (orderId: number, amount: number) => {
    setIsProcessing(true);
    try {
      const data: CreateMomoPaymentRequest = { orderId, amount };
      const response = await createMomoLink(data);
      
      if (response.payUrl) {
        window.location.href = response.payUrl;
      } else {
        toast.error('Failed to create payment link');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('An error occurred during payment initiation');
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (orderId: number) => {
    try {
      const response = await getOrderStatus(orderId);
      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return null;
    }
  };

  return {
    initiateMomoPayment,
    checkPaymentStatus,
    isProcessing
  };
}
