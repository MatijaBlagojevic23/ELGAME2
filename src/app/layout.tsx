import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: 'Euroleague Guessing Game',
  description: 'Created by Matija Blagojevic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* You can add other meta tags or links here */}
      </head>
      <body>
        <SessionProvider> {/* Wrap children with SessionProvider */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}