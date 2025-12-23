import type React from "react"
import type { Metadata } from "next"
import { Cairo, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const cairo = Cairo({ subsets: ["arabic", "latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Education Glory - Universities & Institutes",
  description: "Your gateway to higher education. Discover top universities and institutes.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
