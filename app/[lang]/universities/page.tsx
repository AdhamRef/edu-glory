import { getDictionary, type Locale } from "@/lib/i18n"
import { prisma } from "@/lib/prisma"
import { UniversityCard } from "@/components/university-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function UniversitiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>
  searchParams: Promise<{ type?: string; universityType?: string }>
}) {
  const { lang } = await params
  const { type, universityType } = await searchParams
  const dict = await getDictionary(lang)

  // Build filter based on query params
  const where: Record<string, unknown> = { isPublished: true }
  if (type) {
    where.type = type
  }
  if (universityType) {
    where.universityType = universityType
  }

  const universities = await prisma.university.findMany({
    where,
    include: { specializations: true },
    orderBy: { createdAt: "desc" },
  })

  // Get counts for tabs
  const allCount = await prisma.university.count({ where: { isPublished: true } })
  const privateCount = await prisma.university.count({
    where: { isPublished: true, type: "university", universityType: "private" },
  })
  const foreignCount = await prisma.university.count({
    where: { isPublished: true, type: "university", universityType: "foreign" },
  })
  const governmentCount = await prisma.university.count({
    where: { isPublished: true, type: "university", universityType: "government" },
  })
  const instituteCount = await prisma.university.count({ where: { isPublished: true, type: "institute" } })

  // Determine active tab
  const activeTab = universityType || (type === "institute" ? "institutes" : "all")

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          {type === "institute" ? dict.nav.institutes : dict.nav.universities}
        </h1>

        <Tabs defaultValue={activeTab} className="mb-8">
          <TabsList className="flex flex-wrap justify-center gap-2 h-auto bg-transparent">
            <TabsTrigger
              value="all"
              asChild
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <a href={`/${lang}/universities`}>
                {lang === "ar" ? "الكل" : "All"} ({allCount})
              </a>
            </TabsTrigger>
            <TabsTrigger
              value="private"
              asChild
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <a href={`/${lang}/universities?type=university&universityType=private`}>
                {dict.nav.privateUniversities} ({privateCount})
              </a>
            </TabsTrigger>
            <TabsTrigger
              value="foreign"
              asChild
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <a href={`/${lang}/universities?type=university&universityType=foreign`}>
                {dict.nav.foreignUniversities} ({foreignCount})
              </a>
            </TabsTrigger>
            <TabsTrigger
              value="government"
              asChild
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <a href={`/${lang}/universities?type=university&universityType=government`}>
                {dict.nav.governmentUniversities} ({governmentCount})
              </a>
            </TabsTrigger>
            <TabsTrigger
              value="institutes"
              asChild
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <a href={`/${lang}/universities?type=institute`}>
                {dict.nav.institutes} ({instituteCount})
              </a>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {universities.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university) => (
              <UniversityCard key={university.id} university={university} lang={lang} dict={dict} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">{dict.common.noResults}</p>
        )}
      </div>
    </div>
  )
}
