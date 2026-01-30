import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'Bwati - Academic Ecosystem',
    template: '%s | Bwati',
  },
  description:
    'Research lab, community operations, and academic collaboration platform. Connect with researchers, share knowledge, and build academic communities.',
  keywords: [
    'academic',
    'research',
    'Bwati',
    'education',
    'community',
    'collaboration',
    'research lab',
    'academic ecosystem',
    'knowledge sharing',
    'academic networking',
  ],
  authors: [{ name: 'Bwati' }],
  creator: 'Bwati',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Bwati',
    title: 'Bwati - Academic Ecosystem',
    description:
      'Research lab, community operations, and academic collaboration platform. Connect with researchers, share knowledge, and build academic communities.',
    images: [
      {
        url: 'assets/Bwati.png',
        width: 901,
        height: 842,
        alt: 'Bwati',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bwati - Academic Ecosystem',
    description:
      'Research lab, community operations, and academic collaboration platform. Connect with researchers, share knowledge, and build academic communities.',
    images: ['assets/Bwati.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased font-body">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#fff',
                borderRadius: '8px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}

