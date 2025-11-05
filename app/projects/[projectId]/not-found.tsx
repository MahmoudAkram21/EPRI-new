import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { FolderOpen } from "lucide-react"
import Link from "next/link"

export default function ProjectNotFound() {
  return (
    <PageContainer>
      <Section className="py-20 text-center">
        <FolderOpen className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
        <h1 className="font-serif text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The project you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/projects">
            <Button>Browse All Projects</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </Section>
    </PageContainer>
  )
}

