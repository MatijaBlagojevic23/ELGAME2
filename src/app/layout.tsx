 import '../../styles/globals.css';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Euroleague Guessing Game',
  description: 'Created by Matija Blagojevic',
  viewport: { // It's good to define viewport in metadata as well
    width: 'device-width',
    initialScale: 1.0,
  },
  link: [ // Use the 'link' array in metadata for link tags
    {
      rel: 'preload',
      as: 'image',
      href: '/logo/Milan.png', // Path to your Milan logo (adjust if needed)
    },
    // You can add more preload links for other logos here, for example:
    // { rel: 'preload', as: 'image', href: '/logo/Barcelona.png' },
    // { rel: 'preload', as: 'image', href: '/logo/RealMadrid.png' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

