import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")

  // Create admin user
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "admin123"
  const hashedPassword = await hash(adminPassword, 12)

  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@Education Glory.com" },
    update: {},
    create: {
      email: "admin@Education Glory.com",
      hashedPassword,
      name: "Admin User",
    },
  })

  console.log("Created admin user:", admin.email)

  const privateUni = await prisma.university.upsert({
    where: { slug: "misr-university" },
    update: {},
    create: {
      slug: "misr-university",
      type: "university",
      universityType: "private",
      name_en: "Misr University for Science and Technology",
      name_ar: "جامعة مصر للعلوم والتكنولوجيا",
      short_en: "A leading private university in Egypt",
      short_ar: "جامعة خاصة رائدة في مصر",
      content_en:
        "<h2>About MUST</h2><p>Misr University for Science and Technology (MUST) is one of the first private universities established in Egypt. Founded in 1996, it offers comprehensive programs across various disciplines.</p><h3>Academic Programs</h3><p>The university provides undergraduate and postgraduate programs in engineering, medicine, pharmacy, dentistry, and business.</p>",
      content_ar:
        "<h2>عن جامعة مصر</h2><p>جامعة مصر للعلوم والتكنولوجيا هي واحدة من أوائل الجامعات الخاصة في مصر. تأسست عام 1996 وتقدم برامج شاملة في تخصصات متنوعة.</p><h3>البرامج الأكاديمية</h3><p>تقدم الجامعة برامج البكالوريوس والدراسات العليا في الهندسة والطب والصيدلة وطب الأسنان والأعمال.</p>",
      images: ["https://images.unsplash.com/photo-1562774053-701939374585?w=800"],
      isPublished: true,
    },
  })

  console.log("Created private university:", privateUni.name_en)

  const foreignUni = await prisma.university.upsert({
    where: { slug: "german-university-cairo" },
    update: {},
    create: {
      slug: "german-university-cairo",
      type: "university",
      universityType: "foreign",
      name_en: "German University in Cairo",
      name_ar: "الجامعة الألمانية بالقاهرة",
      short_en: "German quality education in Egypt",
      short_ar: "تعليم ألماني عالي الجودة في مصر",
      content_en:
        "<h2>About GUC</h2><p>The German University in Cairo (GUC) is an Egyptian private university established in 2002 in cooperation with German state universities. It follows the German education model.</p><h3>German Standards</h3><p>GUC maintains strong ties with German universities and industries, providing students with international exposure and exchange opportunities.</p>",
      content_ar:
        "<h2>عن الجامعة الألمانية</h2><p>الجامعة الألمانية بالقاهرة هي جامعة مصرية خاصة تأسست عام 2002 بالتعاون مع جامعات ألمانية حكومية. تتبع نموذج التعليم الألماني.</p><h3>المعايير الألمانية</h3><p>تحافظ الجامعة على علاقات قوية مع الجامعات والصناعات الألمانية مما يوفر للطلاب فرص التبادل الدولي.</p>",
      images: ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800"],
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      isPublished: true,
    },
  })

  console.log("Created foreign university:", foreignUni.name_en)

  const governmentUni = await prisma.university.upsert({
    where: { slug: "cairo-university" },
    update: {},
    create: {
      slug: "cairo-university",
      type: "university",
      universityType: "government",
      name_en: "Cairo University",
      name_ar: "جامعة القاهرة",
      short_en: "One of Egypt's premier public research universities",
      short_ar: "واحدة من أبرز الجامعات البحثية الحكومية في مصر",
      content_en:
        "<h2>About Cairo University</h2><p>Cairo University is a public university in Giza, Egypt. It is one of the oldest and largest institutions of higher education in Egypt. Founded in 1908, it has produced many notable alumni including Nobel laureate Ahmed Zewail.</p><h3>Academic Excellence</h3><p>The university offers a wide range of undergraduate and postgraduate programs across various disciplines including medicine, engineering, law, and humanities.</p>",
      content_ar:
        "<h2>عن جامعة القاهرة</h2><p>جامعة القاهرة هي جامعة حكومية في الجيزة، مصر. تعد واحدة من أقدم وأكبر مؤسسات التعليم العالي في مصر. تأسست عام 1908، وقد أنتجت العديد من الخريجين البارزين بما في ذلك الحائز على جائزة نوبل أحمد زويل.</p><h3>التميز الأكاديمي</h3><p>تقدم الجامعة مجموعة واسعة من البرامج الجامعية والدراسات العليا في تخصصات متنوعة بما في ذلك الطب والهندسة والقانون والعلوم الإنسانية.</p>",
      images: [
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800",
        "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800",
      ],
      isPublished: true,
    },
  })

  console.log("Created government university:", governmentUni.name_en)

  // Create specializations for universities
  await prisma.specialization.createMany({
    data: [
      // Private university specializations
      {
        universityId: privateUni.id,
        name_en: "Computer Engineering",
        name_ar: "هندسة الحاسبات",
        duration: "5 years",
        tuition: "$6,000/year",
      },
      {
        universityId: privateUni.id,
        name_en: "Pharmacy",
        name_ar: "الصيدلة",
        duration: "5 years",
        tuition: "$7,000/year",
      },
      // Foreign university specializations
      {
        universityId: foreignUni.id,
        name_en: "Mechatronics Engineering",
        name_ar: "هندسة الميكاترونكس",
        duration: "5 years",
        tuition: "$10,000/year",
      },
      {
        universityId: foreignUni.id,
        name_en: "Business Informatics",
        name_ar: "نظم معلومات الأعمال",
        duration: "4 years",
        tuition: "$8,000/year",
      },
      // Government university specializations
      {
        universityId: governmentUni.id,
        name_en: "Medicine",
        name_ar: "الطب",
        duration: "6 years",
        tuition: "$500/year",
      },
      {
        universityId: governmentUni.id,
        name_en: "Engineering",
        name_ar: "الهندسة",
        duration: "5 years",
        tuition: "$400/year",
      },
      {
        universityId: governmentUni.id,
        name_en: "Law",
        name_ar: "الحقوق",
        duration: "4 years",
        tuition: "$300/year",
      },
    ],
  })

  // Create institute
  const institute1 = await prisma.university.upsert({
    where: { slug: "tech-institute" },
    update: {},
    create: {
      slug: "tech-institute",
      type: "institute",
      universityType: null,
      name_en: "Technical Institute of Excellence",
      name_ar: "المعهد التقني للتميز",
      short_en: "Leading technical education institution",
      short_ar: "مؤسسة رائدة في التعليم التقني",
      content_en:
        "<h2>Technical Excellence</h2><p>Our institute focuses on practical, hands-on education in technical fields. We prepare students for immediate employment in high-demand industries.</p><h3>Industry Partnerships</h3><p>We maintain strong relationships with leading companies to ensure our curriculum meets current industry standards.</p>",
      content_ar:
        "<h2>التميز التقني</h2><p>يركز معهدنا على التعليم العملي والتطبيقي في المجالات التقنية. نقوم بإعداد الطلاب للتوظيف الفوري في الصناعات ذات الطلب المرتفع.</p><h3>الشراكات الصناعية</h3><p>نحافظ على علاقات قوية مع الشركات الرائدة لضمان أن مناهجنا تلبي معايير الصناعة الحالية.</p>",
      images: ["https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800"],
      isPublished: true,
    },
  })

  console.log("Created institute:", institute1.name_en)

  // Create specializations for institute
  await prisma.specialization.createMany({
    data: [
      {
        universityId: institute1.id,
        name_en: "Web Development",
        name_ar: "تطوير الويب",
        duration: "2 years",
        tuition: "$3,000/year",
      },
      {
        universityId: institute1.id,
        name_en: "Network Administration",
        name_ar: "إدارة الشبكات",
        duration: "2 years",
        tuition: "$2,800/year",
      },
    ],
  })

  // Get a specialization for the sample application
  const spec = await prisma.specialization.findFirst({
    where: { universityId: governmentUni.id },
  })

  // Create sample application
  await prisma.application.create({
    data: {
      universityId: governmentUni.id,
      specializationId: spec?.id,
      studentName: "Ahmed Mohamed",
      email: "ahmed@example.com",
      phone: "+20 123 456 7890",
      nationality: "Egyptian",
      residence: "Cairo, Egypt",
    },
  })

  console.log("Created sample application")

  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
