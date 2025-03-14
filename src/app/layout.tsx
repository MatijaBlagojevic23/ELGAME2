"use client"; // This directive ensures Next.js recognizes this as a client component

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../context/AuthContext";
import { Analytics } from "@vercel/analytics/react"; // Import Vercel Analytics

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AuthProvider>
          <SessionProvider>
            {children}
            <Analytics /> {/* Add Vercel Analytics here */}
          </SessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
