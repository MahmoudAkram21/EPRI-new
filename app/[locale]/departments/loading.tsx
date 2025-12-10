import { Skeleton } from "@/components/ui/skeleton"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"

export default function DepartmentsLoading() {
  return (
    <PageContainer>
      <Section>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </Section>
    </PageContainer>
  )
}
