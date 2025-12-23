import Link from "next/link"
import { getDictionary, type Locale } from "@/lib/i18n"
import { GraduationCap } from "lucide-react"

export async function Footer({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang)

  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href={`/${lang}`} className="flex items-center gap-2 mb-4">
              <img src="https://i.ibb.co/XkJW0nZp/Whats-App-Image-2025-12-09-at-6-44-04-PM.png" className="h-8 w-8 text-secondary" />
              <span className="text-xl font-bold">Education Glory</span>
            </Link>
            <p className="text-sm opacity-80">
              {lang === "ar" ? "بوابتك للتعليم العالي" : "Your gateway to higher education"}
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-secondary">{lang === "ar" ? "روابط سريعة" : "Quick Links"}</h3>
            <nav className="space-y-2">
              <Link href={`/${lang}`} className="block text-sm opacity-80 hover:opacity-100 hover:text-secondary">
                {dict.nav.home}
              </Link>
              {/* <Link href={`/${lang}/about`} className="block text-sm opacity-80 hover:opacity-100 hover:text-secondary">
                {dict.nav.about}
              </Link> */}
              <Link
                href={`/${lang}/universities`}
                className="block text-sm opacity-80 hover:opacity-100 hover:text-secondary"
              >
                {dict.nav.universities}
              </Link>
              <Link
                href={`https://wa.link/rrh1p0`}
                className="block text-sm opacity-80 hover:opacity-100 hover:text-secondary"
              >
                {dict.nav.contact}
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-secondary">{lang === "ar" ? "قانوني" : "Legal"}</h3>
            <nav className="space-y-2">
              <Link href="#" className="block text-sm opacity-80 hover:opacity-100 hover:text-secondary">
                {dict.footer.privacy}
              </Link>
              <Link href="#" className="block text-sm opacity-80 hover:opacity-100 hover:text-secondary">
                {dict.footer.terms}
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-secondary/30 pt-8 text-center text-sm opacity-80">
          © {new Date().getFullYear()} Education Glory. {dict.footer.rights}
        </div>
      </div>
    </footer>
  )
}
