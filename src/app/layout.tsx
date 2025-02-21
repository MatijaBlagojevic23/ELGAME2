export const metadata = {
  title: 'Euroleague Guessing Game',
  description: 'Created by Matjia Blagojevic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
