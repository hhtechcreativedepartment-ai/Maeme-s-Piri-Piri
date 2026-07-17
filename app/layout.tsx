import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PostcodeModalHost from '@/components/ordering/PostcodeModalHost'
import { AuthProvider } from '@/lib/authContext'
import { CartProvider } from '@/lib/cartContext'
import { FavouritesProvider } from '@/lib/favouritesContext'
import { OrdersProvider } from '@/lib/ordersContext'
import './globals.css'

export const metadata: Metadata = {
  title: "Maeme's Piri Piri - Fresh Flame-Grilled Chicken",
  description: 'Experience fresh, flamingly good piri piri chicken with 6 delicious flavour choices. Find us at multiple locations across the UK.',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#99041e' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#ededed]" suppressHydrationWarning>
      <body className="antialiased bg-[#ededed] text-[#1F1F1F]">
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>
              <FavouritesProvider>
            <Header />
            <PostcodeModalHost />
            <main className="min-h-screen pt-20">
              {children}
            </main>
            <Footer />
              </FavouritesProvider>
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
