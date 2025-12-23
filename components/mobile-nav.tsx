"use client"

import { useState } from "react"
import Link from "next/link"
import type { Locale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Globe, ChevronDown, ChevronUp } from "lucide-react"

interface MobileNavProps {
  lang: Locale
  dict: Record<string, Record<string, string>>
  privateUnis: { slug: string; name_en: string; name_ar: string }[]
  foreignUnis: { slug: string; name_en: string; name_ar: string }[]
  governmentUnis: { slug: string; name_en: string; name_ar: string }[]
  institutes: { slug: string; name_en: string; name_ar: string }[]
}

export function MobileNav({ lang, dict, privateUnis, foreignUnis, governmentUnis, institutes }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [uniOpen, setUniOpen] = useState(false)
  const [instOpen, setInstOpen] = useState(false)
  const otherLang = lang === "ar" ? "en" : "ar"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={lang === "ar" ? "right" : "left"}
        className="w-80 bg-primary text-primary-foreground overflow-y-auto"
      >
        <nav className="flex flex-col gap-4 mt-8">
          <Link
            href={`/${lang}`}
            onClick={() => setOpen(false)}
            className="text-lg hover:text-secondary transition-colors py-2"
          >
            {dict.nav.home}
          </Link>
          {/* <Link
            href={`/${lang}/about`}
            onClick={() => setOpen(false)}
            className="text-lg hover:text-secondary transition-colors py-2"
          >
            {dict.nav.about}
          </Link> */}

          {/* Universities Section */}
          <div>
            <button
              onClick={() => setUniOpen(!uniOpen)}
              className="flex items-center justify-between w-full text-lg hover:text-secondary transition-colors py-2"
            >
              {dict.nav.universities}
              {uniOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {uniOpen && (
              <div className="ms-4 mt-2 space-y-3">
                <Link
                  href={`/${lang}/universities?type=university`}
                  onClick={() => setOpen(false)}
                  className="block text-secondary hover:underline py-1 font-semibold"
                >
                  {dict.nav.viewAll}
                </Link>

                {/* Private Universities */}
                {privateUnis.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-secondary/80 mb-1">{dict.nav.privateUniversities}</p>
                    {privateUnis.map((uni) => (
                      <Link
                        key={uni.slug}
                        href={`/${lang}/universities/${uni.slug}`}
                        onClick={() => setOpen(false)}
                        className="block text-sm opacity-80 hover:opacity-100 hover:text-secondary py-1 ps-2"
                      >
                        {lang === "ar" ? uni.name_ar : uni.name_en}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Foreign Universities */}
                {foreignUnis.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-secondary/80 mb-1">{dict.nav.foreignUniversities}</p>
                    {foreignUnis.map((uni) => (
                      <Link
                        key={uni.slug}
                        href={`/${lang}/universities/${uni.slug}`}
                        onClick={() => setOpen(false)}
                        className="block text-sm opacity-80 hover:opacity-100 hover:text-secondary py-1 ps-2"
                      >
                        {lang === "ar" ? uni.name_ar : uni.name_en}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Government Universities */}
                {governmentUnis.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-secondary/80 mb-1">{dict.nav.governmentUniversities}</p>
                    {governmentUnis.map((uni) => (
                      <Link
                        key={uni.slug}
                        href={`/${lang}/universities/${uni.slug}`}
                        onClick={() => setOpen(false)}
                        className="block text-sm opacity-80 hover:opacity-100 hover:text-secondary py-1 ps-2"
                      >
                        {lang === "ar" ? uni.name_ar : uni.name_en}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Institutes Section */}
          <div>
            <button
              onClick={() => setInstOpen(!instOpen)}
              className="flex items-center justify-between w-full text-lg hover:text-secondary transition-colors py-2"
            >
              {dict.nav.institutes}
              {instOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {instOpen && (
              <div className="ms-4 mt-2 space-y-2">
                <Link
                  href={`/${lang}/universities?type=institute`}
                  onClick={() => setOpen(false)}
                  className="block text-secondary hover:underline py-1 font-semibold"
                >
                  {dict.nav.viewAll}
                </Link>
                {institutes.map((inst) => (
                  <Link
                    key={inst.slug}
                    href={`/${lang}/universities/${inst.slug}`}
                    onClick={() => setOpen(false)}
                    className="block text-sm opacity-80 hover:opacity-100 hover:text-secondary py-1"
                  >
                    {lang === "ar" ? inst.name_ar : inst.name_en}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${lang}/contact`}
            onClick={() => setOpen(false)}
            className="text-lg hover:text-secondary transition-colors py-2"
          >
            {dict.nav.contact}
          </Link>

          <hr className="border-secondary/30 my-4" />

          <Button
            asChild
            variant="outline"
            className="border-secondary text-primary-foreground bg-transparent hover:bg-secondary hover:text-secondary-foreground"
          >
            <Link href={`/${otherLang}`} onClick={() => setOpen(false)}>
              <Globe className="h-4 w-4 me-2" />
              {dict.nav.language}
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
