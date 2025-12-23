import Link from "next/link"
import { getDictionary, type Locale } from "@/lib/i18n"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { GraduationCap, Globe } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export async function Navbar({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang)

  const universities = await prisma.university.findMany({
    where: { isPublished: true, type: "university" },
    select: {
      slug: true,
      name_en: true,
      name_ar: true,
      universityType: true,
    },
    orderBy: { name_en: "asc" },
  })

  const institutes = await prisma.university.findMany({
    where: { isPublished: true, type: "institute" },
    select: {
      slug: true,
      name_en: true,
      name_ar: true,
    },
    orderBy: { name_en: "asc" },
  })

  // Group universities by type
  const privateUnis = universities.filter((u) => u.universityType === "private")
  const foreignUnis = universities.filter((u) => u.universityType === "foreign")
  const governmentUnis = universities.filter((u) => u.universityType === "government")

  const otherLang = lang === "ar" ? "en" : "ar"

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <img src="https://i.ibb.co/XkJW0nZp/Whats-App-Image-2025-12-09-at-6-44-04-PM.png" className="h-8 w-8 text-secondary" />
            
            <span className="text-xl font-bold">Education Glory</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href={`/${lang}`} className="hover:text-secondary transition-colors px-2">
              {dict.nav.home}
            </Link>
            {/* <Link href={`/${lang}/about`} className="hover:text-secondary transition-colors px-2">
              {dict.nav.about}
            </Link> */}

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-primary-foreground hover:bg-primary hover:text-secondary data-[state=open]:bg-primary/90">
                    {dict.nav.universities}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4 bg-white text-foreground rounded-md">
                      <Link
                        href={`/${lang}/universities?type=university`}
                        className="block mb-3 text-sm font-semibold text-primary hover:underline"
                      >
                        {dict.nav.viewAll}
                      </Link>

                      {/* Private Universities */}
                      {privateUnis.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-secondary mb-2 border-b border-secondary/30 pb-1">
                            {dict.nav.privateUniversities}
                          </h4>
                          <ul className="space-y-1">
                            {privateUnis.map((uni) => (
                              <li key={uni.slug}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={`/${lang}/universities/${uni.slug}`}
                                    className="block text-sm text-primary hover:text-primary! text-primary hover:text-primary! py-1 px-2 rounded hover:bg-muted transition-colors"
                                  >
                                    {lang === "ar" ? uni.name_ar : uni.name_en}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Foreign Universities */}
                      {foreignUnis.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-secondary mb-2 border-b border-secondary/30 pb-1">
                            {dict.nav.foreignUniversities}
                          </h4>
                          <ul className="space-y-1">
                            {foreignUnis.map((uni) => (
                              <li key={uni.slug}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={`/${lang}/universities/${uni.slug}`}
                                    className="block text-sm text-primary hover:text-primary! py-1 px-2 rounded hover:bg-muted transition-colors"
                                  >
                                    {lang === "ar" ? uni.name_ar : uni.name_en}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Government Universities */}
                      {governmentUnis.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-secondary mb-2 border-b border-secondary/30 pb-1">
                            {dict.nav.governmentUniversities}
                          </h4>
                          <ul className="space-y-1">
                            {governmentUnis.map((uni) => (
                              <li key={uni.slug}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={`/${lang}/universities/${uni.slug}`}
                                    className="block text-sm text-primary hover:text-primary! py-1 px-2 rounded hover:bg-muted transition-colors"
                                  >
                                    {lang === "ar" ? uni.name_ar : uni.name_en}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Institutes Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-primary-foreground hover:bg-primary hover:text-secondary data-[state=open]:bg-primary/90">
                    {dict.nav.institutes}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4 bg-white text-foreground rounded-md">
                      <Link
                        href={`/${lang}/universities?type=institute`}
                        className="block mb-3 text-sm font-semibold text-primary hover:underline"
                      >
                        {dict.nav.viewAll}
                      </Link>
                      <ul className="space-y-1">
                        {institutes.map((inst) => (
                          <li key={inst.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={`/${lang}/universities/${inst.slug}`}
                                className="block text-sm text-primary hover:text-primary! py-1 px-2 rounded hover:bg-muted transition-colors"
                              >
                                {lang === "ar" ? inst.name_ar : inst.name_en}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href={`/${lang}/contact`} className="hover:text-secondary transition-colors px-2">
              {dict.nav.contact}
            </Link>

            {/* Language Switcher */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-secondary text-primary-foreground bg-transparent hover:bg-secondary hover:text-secondary-foreground ms-2"
            >
              <Link href={`/${otherLang}`}>
                <Globe className="h-4 w-4 me-1" />
                {dict.nav.language}
              </Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <MobileNav
            lang={lang}
            dict={dict}
            privateUnis={privateUnis}
            foreignUnis={foreignUnis}
            governmentUnis={governmentUnis}
            institutes={institutes}
          />
        </div>
      </div>
    </header>
  )
}
