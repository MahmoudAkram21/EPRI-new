import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ServiceNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Service Not Found</h2>
        <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
      </div>
    </div>
  )
}
