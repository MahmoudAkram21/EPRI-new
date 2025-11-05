
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <PageContainer>
      <Section className="text-center">
        <h1 className="font-serif text-4xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground text-lg mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </Section>
    </PageContainer>
  )
}
