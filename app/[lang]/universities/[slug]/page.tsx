import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getDictionary, type Locale } from "@/lib/i18n"
import { prisma } from "@/lib/prisma"
import { SpecializationsTable } from "@/components/specializations-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react"
import DOMPurify from "isomorphic-dompurify"

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>
}) {
  const { lang, slug } = await params
  const dict = await getDictionary(lang)

  const university = await prisma.university.findUnique({
    where: { slug, isPublished: true },
    include: { specializations: true },
  })

  if (!university) {
    notFound()
  }

  const name = lang === "ar" ? university.name_ar : university.name_en
  const shortDesc = lang === "ar" ? university.short_ar : university.short_en
  const content = lang === "ar" ? university.content_ar : university.content_en
  const sanitizedContent = content ? DOMPurify.sanitize(content) : ""
  const BackArrow = lang === "ar" ? ArrowRight : ArrowLeft

  const getTypeLabel = () => {
    if (university.type === "institute") {
      return lang === "ar" ? "معهد" : "Institute"
    }
    switch (university.universityType) {
      case "private":
        return lang === "ar" ? "جامعة خاصة" : "Private University"
      case "foreign":
        return lang === "ar" ? "جامعة أجنبية" : "Foreign University"
      case "government":
        return lang === "ar" ? "جامعة حكومية" : "Government University"
      default:
        return lang === "ar" ? "جامعة" : "University"
    }
  }

  const heroImage = university.images[0] || "/placeholder.svg"

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto max-w-5xl px-4 pt-8 pb-32">
          {/* Back Button */}
          <div className="mb-12">
            <Button variant="secondary" asChild className="backdrop-blur-sm bg-blue-900/90">
              <Link href={`/${lang}/universities`}>
                <BackArrow className="h-4 w-4 me-2" />
                {dict.common.back}
              </Link>
            </Button>
          </div>

          {/* Title Content */}
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="default" className="text-sm px-4 py-1.5">
                {getTypeLabel()}
              </Badge>
              {university.specializations.length > 0 && (
                <Badge variant="secondary" className="text-sm px-4 py-1.5 backdrop-blur-sm bg-blue/90">
                  <GraduationCap className="h-3.5 w-3.5 me-1.5" />
                  {university.specializations.length} {lang === "ar" ? "تخصصات" : "Specializations"}
                </Badge>
              )}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              {name}
            </h1>
            
            {shortDesc && (
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed drop-shadow-md">
                {shortDesc}
              </p>
            )}
          </div>
        </div>

        {/* Wavy Bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
          <svg
            className="relative rotate-180 block w-full h-[80px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-background"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {/* Video Section */}
        {university.videoUrl && (
          <div className="mb-12">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border">
              <iframe
                src={university.videoUrl.replace("watch?v=", "embed/")}
                title={name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Main Content Article */}
        {sanitizedContent && (
          <article className="mb-16">
            <div
              className="prose prose-lg prose-slate dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:text-primary
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-6 prose-li:my-2
                prose-img:rounded-xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </article>
        )}

        {/* Images Gallery */}
        {university.images.length > 1 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-8">
              {lang === "ar" ? "معرض الصور" : "Gallery"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {university.images.slice(1).map((image, index) => (
                <div key={index} className="group relative aspect-video rounded-xl overflow-hidden shadow-lg border border-border hover:shadow-2xl transition-all duration-300">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${name} - ${index + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specializations Section */}
        <div className="mt-16 pt-16 border-t border-border">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary mb-3">
              {dict.university.specializations}
            </h2>
            <p className="text-muted-foreground text-lg">
              {lang === "ar" 
                ? "استكشف البرامج الأكاديمية والتخصصات المتاحة" 
                : "Explore available academic programs and specializations"}
            </p>
          </div>
          
          <SpecializationsTable
            specializations={university.specializations}
            universitySlug={university.slug}
            lang={lang}
            dict={dict}
          />
        </div>
      </div>
    </div>
  )
}