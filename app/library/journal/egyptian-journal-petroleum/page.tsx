import { Section } from "@/components/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EgyptianJournalPetroleumPage() {
  return (
    <div className="min-h-screen">
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700 mb-8">
        <div className="relative z-10 mx-auto max-w-6xl">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Egyptian Journal Of Petroleum
          </h1>
          <p className="text-lg leading-relaxed text-white/90 sm:text-xl max-w-3xl">
            Access articles and publications from the Egyptian Journal of Petroleum.
          </p>
        </div>
      </Section>

      <Section>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Egyptian Journal Of Petroleum</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                Content for Egyptian Journal Of Petroleum page...
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  )
}

