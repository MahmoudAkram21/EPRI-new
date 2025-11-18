import Link from "next/link"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Library, FileText, GraduationCap } from "lucide-react"

const librarySubSections = [
  {
    title: "Journal",
    description: "Access our scientific journals and periodicals",
    icon: FileText,
    href: "/library/journal",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Theses (PHD)",
    description: "Browse doctoral theses and dissertations",
    icon: GraduationCap,
    href: "/library/theses-phd",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Theses (MSC)",
    description: "Access master's degree theses and research",
    icon: GraduationCap,
    href: "/library/theses-msc",
    color: "from-green-500 to-emerald-500"
  }
]

export default function LibraryMainPage() {
  return (
    <PageContainer>
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700">
        <div className="relative z-10 mx-auto max-w-6xl">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Library
          </h1>
          <p className="text-lg leading-relaxed text-white/90 sm:text-xl max-w-3xl">
            Digital library resources and collections.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {librarySubSections.map((section) => (
            <Card key={section.href} className="group hover:shadow-lg transition-shadow">
              <Link href={section.href}>
                <CardHeader>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} text-white shadow-lg`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </Section>
    </PageContainer>
  )
}

