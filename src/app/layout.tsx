import { Metadata } from 'next/server';

export const metadata: Metadata = {
  title: 'Euroleague guessing game',
  description: 'Created by Matija Blagojevic',
  icons: {  // Add the icons property
    icon: '/EL_E-Ball_Orange_PMS.png', // Path to your favicon.ico in the public directory
    
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
