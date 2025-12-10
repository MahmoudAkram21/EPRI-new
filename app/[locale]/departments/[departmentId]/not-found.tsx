import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DepartmentNotFound() {
  return (
    <PageContainer>
      <Section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Department Not Found</h1>
        <p className="text-muted-foreground mb-8">The department you're looking for doesn't exist.</p>
        <Link href="/departments">
          <Button>View All Departments</Button>
        </Link>
      </Section>
    </PageContainer>
  )
}
