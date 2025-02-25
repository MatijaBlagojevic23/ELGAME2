"use client"; // This directive is necessary for Next.js to recognize this as a client component

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../context/AuthContext";




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
        <AuthProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
