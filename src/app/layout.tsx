import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/modules/cart/hooks/useCart'
import { AuthProvider } from '@/contexts/authContext'
import QueryProvider from '@/shared/providers/query-provider'
import { Toaster } from 'sonner'
import { ChatbotWidget } from '@/modules/chatbot/components/chatbot-widget'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SkinMatch - Sản Phẩm Chăm Sóc Da Tự Nhiên',
  description: 'Khám phá các sản phẩm chăm sóc da tự nhiên, tinh khiết. Mua sắm bộ sưu tập serum, kem dưỡng ẩm và các sản phẩm đặc trị phù hợp với mọi loại da.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="bg-background" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background pt-[60px] md:pt-0 pb-20 md:pb-0`}>
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <ChatbotWidget />
              <Toaster position="top-right" richColors />
              {process.env.NODE_ENV === 'production' && <Analytics />}
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
