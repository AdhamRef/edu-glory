import React from "react";
import {
  GraduationCap,
  Users,
  Globe,
  Award,
  Plane,
  Home,
  FileText,
  Heart,
  CheckCircle,
  MapPin,
  BookOpen,
  Shield,
  HandCoins,
} from "lucide-react";
import Link from "next/link";
import UniversitySlider from "@/components/university-slider";
import { getDictionary, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export default async function EducationGloryLanding({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const universities = await prisma.university.findMany({
    where: { isPublished: true },
    include: { specializations: true },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  if (universities.length === 0) return null;
  return (
    <div className="min-h-screen bg-[#fbf9ed]">
      {/* Hero Section with Background */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(135deg,rgba(2, 24, 44, 0.75) 0%,rgba(16, 78, 104, 0.70) 100%), url("https://www.thestatesman.com/wp-content/uploads/2020/09/QT-Indian-students.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#1d97c1] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#032848] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#fbf9ed] mb-6 leading-tight">
            {dict.landing.hero.title}
            <span className="block text-[#20bef3] mt-2">
              {dict.landing.hero.titleHighlight}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#fbf9ed] text-opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
            {dict.landing.hero.subtitle}
          </p>

          <p className="text-lg text-[#fbf9ed] text-opacity-80 mb-12 max-w-2xl mx-auto">
            {dict.landing.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${lang}/universities`}
              className="px-6 py-2 bg-[#1d97c1] text-[#fbf9ed] rounded-lg font-semibold text-lg hover:bg-opacity-90 transform hover:scale-105 transition-all shadow-xl"
            >
              {dict.landing.hero.exploreButton}
            </Link>
            <Link
              href={`https://wa.link/rrh1p0`}
              className="px-6 py-2 bg-[#fbf9ed] bg-opacity-10 backdrop-blur-sm text-[#0f5089] rounded-lg font-semibold text-lg border-2 border-[#fbf9ed] border-opacity-30 hover:bg-opacity-20 transform hover:scale-105 transition-all"
            >
              {dict.landing.hero.contactButton}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-[#fbf9ed]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#1d97c1]" />
              <span className="text-sm opacity-90">{dict.landing.hero.trust.free}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#1d97c1]" />
              <span className="text-sm opacity-90">{dict.landing.hero.trust.certified}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#1d97c1]" />
              <span className="text-sm opacity-90">{dict.landing.hero.trust.support}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Services Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#032848] mb-4">
              {dict.landing.services.title}
            </h2>
            <p className="text-xl text-[#032848] text-opacity-70 max-w-2xl mx-auto">
              {dict.landing.services.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-t-4 border-[#1d97c1]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#032848] to-[#1d97c1] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-[#fbf9ed]" />
              </div>
              <h3 className="text-2xl font-bold text-[#032848] mb-4">
                {dict.landing.services.consultation.title}
              </h3>
              <p className="text-[#032848] text-opacity-70 leading-relaxed mb-4">
                {dict.landing.services.consultation.description}
              </p>
              <p className="text-[#1d97c1] font-semibold">
                {dict.landing.services.consultation.highlight}
              </p>
            </div>

            {/* Service 2 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-t-4 border-[#1d97c1]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#032848] to-[#1d97c1] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-[#fbf9ed]" />
              </div>
              <h3 className="text-2xl font-bold text-[#032848] mb-4">
                {dict.landing.services.admission.title}
              </h3>
              <p className="text-[#032848] text-opacity-70 leading-relaxed mb-4">
                {dict.landing.services.admission.description}
              </p>
              <p className="text-[#1d97c1] font-semibold">
                {dict.landing.services.admission.highlight}
              </p>
            </div>

            {/* Service 3 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-t-4 border-[#1d97c1]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#032848] to-[#1d97c1] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Home className="w-8 h-8 text-[#fbf9ed]" />
              </div>
              <h3 className="text-2xl font-bold text-[#032848] mb-4">
                {dict.landing.services.housing.title}
              </h3>
              <p className="text-[#032848] text-opacity-70 leading-relaxed mb-4">
                {dict.landing.services.housing.description}
              </p>
              <p className="text-[#1d97c1] font-semibold">
                {dict.landing.services.housing.highlight}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ongoing Support Section */}
      <div className="bg-gradient-to-br from-[#032848] via-[#1d97c1] to-[#032848] py-15 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#fbf9ed] mb-4">
              {dict.landing.support.title}
            </h2>
            <p className="text-xl text-[#fbf9ed] text-opacity-90">
              {dict.landing.support.subtitle}
            </p>
          </div>

          <div className="bg-[#fbf9ed] bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white border-opacity-20">
            <p className="text-lg text-primary text-opacity-90 mb-8 text-center leading-relaxed">
              {dict.landing.support.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 bg-white bg-opacity-5 rounded-xl p-6 hover:bg-opacity-10 transition-all">
                <CheckCircle className="w-6 h-6 text-[#1d97c1] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-primary font-semibold mb-2">
                    {dict.landing.support.features.academic.title}
                  </h4>
                  <p className="text-primary text-opacity-70 text-sm">
                    {dict.landing.support.features.academic.description}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white bg-opacity-5 rounded-xl p-6 hover:bg-opacity-10 transition-all">
                <CheckCircle className="w-6 h-6 text-[#1d97c1] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-primary font-semibold mb-2">
                    {dict.landing.support.features.visa.title}
                  </h4>
                  <p className="text-primary text-opacity-70 text-sm">
                    {dict.landing.support.features.visa.description}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white bg-opacity-5 rounded-xl p-6 hover:bg-opacity-10 transition-all">
                <CheckCircle className="w-6 h-6 text-[#1d97c1] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-primary font-semibold mb-2">
                    {dict.landing.support.features.accommodation.title}
                  </h4>
                  <p className="text-primary text-opacity-70 text-sm">
                    {dict.landing.support.features.accommodation.description}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white bg-opacity-5 rounded-xl p-6 hover:bg-opacity-10 transition-all">
                <CheckCircle className="w-6 h-6 text-[#1d97c1] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-primary font-semibold mb-2">
                    {dict.landing.support.features.transfer.title}
                  </h4>
                  <p className="text-primary text-opacity-70 text-sm">
                    {dict.landing.support.features.transfer.description}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white bg-opacity-5 rounded-xl p-6 hover:bg-opacity-10 transition-all">
                <CheckCircle className="w-6 h-6 text-[#1d97c1] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-primary font-semibold mb-2">
                    {dict.landing.support.features.additional.title}
                  </h4>
                  <p className="text-primary text-opacity-70 text-sm">
                    {dict.landing.support.features.additional.description}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white bg-opacity-5 rounded-xl p-6 hover:bg-opacity-10 transition-all">
                <CheckCircle className="w-6 h-6 text-[#1d97c1] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-primary font-semibold mb-2">
                    {dict.landing.support.features.vacation.title}
                  </h4>
                  <p className="text-primary text-opacity-70 text-sm">
                    {dict.landing.support.features.vacation.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-3 bg-[#1d97c1] bg-opacity-20 backdrop-blur-sm rounded-full px-8 py-4 border border-[#1d97c1] border-opacity-30">
                <Heart className="w-6 h-6 text-[#fbf9ed]" />
                <p className="text-[#fbf9ed] font-semibold text-lg">
                  {dict.landing.support.commitment}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-15 px-6 bg-[#fbf9ed]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#032848] mb-4">
              {dict.home.featured}
            </h2>
            <p className="text-xl text-[#032848] text-opacity-70">
              {dict.home.subtitle}
            </p>
          </div>

          <UniversitySlider
            universities={universities}
            lang={lang}
            dict={dict}
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <div className="py-10 px-6 bg-[#fbf9ed]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#032848] mb-4">
              {dict.landing.whyUs.title}
            </h2>
            <p className="text-xl text-[#032848] text-opacity-70">
              {dict.landing.whyUs.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-r-4 border-[#1d97c1]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1d97c1] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HandCoins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#032848] mb-2">
                    {dict.landing.whyUs.reasons.free.title}
                  </h3>
                  <p className="text-[#032848] text-opacity-70">
                    {dict.landing.whyUs.reasons.free.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-r-4 border-[#1d97c1]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1d97c1] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#032848] mb-2">
                    {dict.landing.whyUs.reasons.certified.title}
                  </h3>
                  <p className="text-[#032848] text-opacity-70">
                    {dict.landing.whyUs.reasons.certified.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-r-4 border-[#1d97c1]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1d97c1] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#032848] mb-2">
                    {dict.landing.whyUs.reasons.experience.title}
                  </h3>
                  <p className="text-[#032848] text-opacity-70">
                    {dict.landing.whyUs.reasons.experience.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-r-4 border-[#1d97c1]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1d97c1] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#032848] mb-2">
                    {dict.landing.whyUs.reasons.comprehensive.title}
                  </h3>
                  <p className="text-[#032848] text-opacity-70">
                    {dict.landing.whyUs.reasons.comprehensive.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-6 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(3, 40, 72, 0.97) 0%, rgba(29, 151, 193, 0.95) 100%), url("https://www.thestatesman.com/wp-content/uploads/2020/09/QT-Indian-students.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#fbf9ed] mb-6">
            {dict.landing.cta.title}
          </h2>
          <p className="text-xl text-[#fbf9ed] text-opacity-90 mb-10 max-w-2xl mx-auto">
            {dict.landing.cta.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`https://wa.link/rrh1p0`}
              className="px-10 py-5 bg-[#1d97c1] text-[#fbf9ed] rounded-xl font-bold text-lg hover:bg-opacity-90 transform hover:scale-105 transition-all shadow-2xl"
            >
              {dict.landing.cta.primaryButton}
            </Link>
            <Link
              href={`/${lang}/universities`}
              className="px-10 py-5 bg-white text-[#032848] rounded-xl font-bold text-lg hover:bg-opacity-90 transform hover:scale-105 transition-all shadow-2xl"
            >
              {dict.landing.cta.secondaryButton}
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-[#fbf9ed] text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{dict.landing.cta.features.instant}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{dict.landing.cta.features.noHidden}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{dict.landing.cta.features.professional}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}