import type React from "react"
import { type Locale, locales } from "@/lib/i18n"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Navbar lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  )
}
