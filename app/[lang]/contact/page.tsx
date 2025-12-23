import { getDictionary, type Locale } from "@/lib/i18n"
import { ContactForm } from "@/components/contact-form"
import { Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary">{dict.contact.title}</h1>
        <p className="text-center text-muted-foreground mb-12">{dict.contact.description}</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* <div className="bg-card rounded-xl p-8 shadow-lg">
            <ContactForm dict={dict} />
          </div> */}

          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-lg flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</h3>
                <p className="text-muted-foreground">info@Education Glory.com</p>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">{lang === "ar" ? "الهاتف" : "Phone"}</h3>
                <Link href={"https://wa.link/rrh1p0"} className="text-muted-foreground">601111714922+</Link>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                <img className="w-8 h-8" src={"https://images.seeklogo.com/logo-png/34/2/tiktok-logo-png_seeklogo-340606.png"}/>
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">{lang === "ar" ? "تيكتوك" : "Tiktok"}</h3>
                <Link href={"https://www.tiktok.com/@education.glory"} className="text-muted-foreground">@education.glory</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
