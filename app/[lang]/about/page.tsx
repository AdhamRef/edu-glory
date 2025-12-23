import { getDictionary, type Locale } from "@/lib/i18n"
import { GraduationCap, Target, Users } from "lucide-react"

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">{dict.about.title}</h1>

        <div className="bg-card rounded-xl p-8 shadow-lg mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">{dict.about.description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">{lang === "ar" ? "رؤيتنا" : "Our Vision"}</h3>
            <p className="text-muted-foreground">
              {lang === "ar"
                ? "أن نكون المنصة الرائدة في ربط الطلاب بالفرص التعليمية"
                : "To be the leading platform connecting students with educational opportunities"}
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="https://i.ibb.co/XkJW0nZp/Whats-App-Image-2025-12-09-at-6-44-04-PM.png" className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">{lang === "ar" ? "مهمتنا" : "Our Mission"}</h3>
            <p className="text-muted-foreground">
              {lang === "ar"
                ? "تسهيل الوصول إلى التعليم العالي الجودة للجميع"
                : "Making quality higher education accessible to everyone"}
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">{lang === "ar" ? "قيمنا" : "Our Values"}</h3>
            <p className="text-muted-foreground">
              {lang === "ar" ? "الشفافية والجودة وخدمة الطلاب" : "Transparency, quality, and student-centered service"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
