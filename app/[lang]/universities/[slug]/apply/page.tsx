import { notFound } from "next/navigation"
import Link from "next/link"
import { getDictionary, type Locale } from "@/lib/i18n"
import { prisma } from "@/lib/prisma"
import { ApplyForm } from "@/components/apply-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale; slug: string }>
  searchParams: Promise<{ spec?: string }>
}) {
  const { lang, slug } = await params
  const { spec } = await searchParams
  const dict = await getDictionary(lang)

  const university = await prisma.university.findUnique({
    where: { slug, isPublished: true },
    include: { specializations: true },
  })

  if (!university) {
    notFound()
  }

  const name = lang === "ar" ? university.name_ar : university.name_en
  const BackArrow = lang === "ar" ? ArrowRight : ArrowLeft

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/${lang}/universities/${slug}`}>
            <BackArrow className="h-4 w-4 me-2" />
            {dict.common.back}
          </Link>
        </Button>

        <div className="bg-card rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-2">{dict.apply.title}</h1>
          <p className="text-muted-foreground mb-8">
            {dict.apply.subtitle} <span className="font-semibold">{name}</span>
          </p>

          <ApplyForm university={university} preSelectedSpec={spec} lang={lang} dict={dict} />
        </div>
      </div>
    </div>
  )
}
