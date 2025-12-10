import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <PageContainer>
      <Header />
      <Section className="text-center">
        <h1 className="font-serif text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground text-lg mb-8">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </Button>
      </Section>
      <Footer />
    </PageContainer>
  )
}
