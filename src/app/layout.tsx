export const metadata = {
  title: 'Euroleague guessing game',
  description: 'Created by Matija Blagojevic',
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
