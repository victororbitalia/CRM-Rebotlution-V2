import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { RestaurantProvider } from '@/context/RestaurantContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'REBOTLUTION CRM - Gestión de Reservas',
  description: 'Sistema de gestión de reservas para restaurantes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <RestaurantProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </RestaurantProvider>
      </body>
    </html>
  )
}
