'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import Link from 'next/link';
import { CheckCircle, Package, Truck, MailOpen } from 'lucide-react';

export default function OrderConfirmationPage() {
  const orderNumber = Math.random().toString(36).substring(2, 9).toUpperCase();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Thank you for your purchase
          </p>
          <p className="text-sm text-gray-600">
            Your order number is{' '}
            <span className="font-bold text-[#7a9e8e]">#{orderNumber}</span>
          </p>
        </div>

        {/* Order Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Confirmation Email */}
          <div className="bg-white rounded-lg p-6 border border-[#e8e5dd] text-center">
            <MailOpen className="w-8 h-8 text-[#7a9e8e] mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Confirmation Email
            </h3>
            <p className="text-sm text-gray-600">
              Check your email for order details and updates
            </p>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg p-6 border border-[#e8e5dd] text-center">
            <Package className="w-8 h-8 text-[#7a9e8e] mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Processing
            </h3>
            <p className="text-sm text-gray-600">
              Your order is being prepared for shipment
            </p>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-white rounded-lg p-6 border border-[#e8e5dd] text-center">
            <Truck className="w-8 h-8 text-[#7a9e8e] mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Estimated Delivery
            </h3>
            <p className="text-sm text-gray-600">
              {estimatedDelivery.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-[#f5f2ed] rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What&apos;s Next?
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#7a9e8e] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Check Your Email
                </h3>
                <p className="text-gray-600 text-sm">
                  We&apos;ve sent a confirmation email with your order details and tracking information.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#7a9e8e] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Track Your Order
                </h3>
                <p className="text-gray-600 text-sm">
                  You can track your shipment in real-time through your dashboard or email notifications.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#7a9e8e] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Enjoy Your Products
                </h3>
                <p className="text-gray-600 text-sm">
                  Receive your order and start enjoying your new skincare products. Don&apos;t forget to leave a review!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg p-8 border border-[#e8e5dd] mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                When will my order arrive?
              </h3>
              <p className="text-gray-600 text-sm">
                Most orders arrive within 5-7 business days. You&apos;ll receive a shipping confirmation with tracking details.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my order?
              </h3>
              <p className="text-gray-600 text-sm">
                If your order hasn&apos;t shipped yet, contact us at support@silvorcare.com to make changes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What&apos;s your return policy?
              </h3>
              <p className="text-gray-600 text-sm">
                We offer a 30-day money-back guarantee on all products. If you&apos;re not satisfied, simply return your items.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition"
          >
            View Order Status
          </Link>
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-[#e8e5dd] text-gray-900 font-semibold rounded-lg hover:bg-[#f5f2ed] transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

