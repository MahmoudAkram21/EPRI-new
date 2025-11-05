import { use } from "react"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import { news } from "@/lib/data"
import { notFound } from "next/navigation"

export default function NewsDetailPage({ params }: { params: Promise<{ newsId: string }> }) {
  const resolvedParams = use(params)
  const post = news.find((n) => n.id === resolvedParams.newsId)

  if (!post) {
    notFound()
  }

  const relatedPosts = news.filter((n) => n.id !== post.id && n.category === post.category).slice(0, 3)

  return (
    <PageContainer>
      

      {/* Breadcrumb */}
      <div className="container mx-auto px-4">
        <Link
          href="/news"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </Link>
      </div>

      {/* Article Header */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">{post.title}</h1>
          <div className="flex items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="container mx-auto px-4 mb-12">
        <div className="max-w-4xl mx-auto">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Article Content */}
      <Section>
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <article className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>

              <p className="leading-relaxed mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </p>

              <h2 className="font-serif text-2xl font-bold mt-8 mb-4">Key Highlights</h2>
              <p className="leading-relaxed mb-6">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum.
              </p>

              <ul className="space-y-2 mb-6">
                <li>Innovative approach to solving complex challenges</li>
                <li>Collaboration between multiple departments and institutions</li>
                <li>Significant impact on the field and broader community</li>
                <li>Recognition from leading industry organizations</li>
              </ul>

              <h2 className="font-serif text-2xl font-bold mt-8 mb-4">Looking Forward</h2>
              <p className="leading-relaxed mb-6">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo.
              </p>

              <p className="leading-relaxed mb-6">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia
                dolor sit amet, consectetur, adipisci velit.
              </p>
            </article>

            <Separator className="my-8" />

            {/* Share */}
            <div className="flex items-center gap-4">
              <span className="font-semibold">Share this article:</span>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="bg-transparent">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="bg-transparent">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="bg-transparent">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="bg-transparent">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card >
                <CardHeader>
                  <CardTitle>Related News</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/news/${relatedPost.id}`} className="block group">
                      <div className="space-y-2">
                        <img
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(relatedPost.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      {relatedPost.id !== relatedPosts[relatedPosts.length - 1].id && <Separator className="mt-4" />}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(news.map((n) => n.category))).map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary-foreground/90 mb-4">
                  Subscribe to our newsletter for the latest news and updates
                </p>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/contact">Subscribe</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      
    </PageContainer>
  )
}
