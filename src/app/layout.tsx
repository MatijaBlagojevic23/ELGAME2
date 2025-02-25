"use client"; // This directive is necessary for Next.js to recognize this as a client component

import { SessionProvider } from "next-auth/react";

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
