"use client"

import { useState, useMemo } from "react"
 
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { news } from "@/lib/data"

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", ...Array.from(new Set(news.map((post) => post.category)))]

  const filteredNews = useMemo(() => {
    if (selectedCategory === "all") return news
    return news.filter((post) => post.category === selectedCategory)
  }, [selectedCategory])

  const featuredPost = news[0]
  const otherPosts = filteredNews.slice(1)

  return (
    <PageContainer>
     

      {/* Hero Section with Background */}
      <Section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" 
          style={{ 
            backgroundImage: `url('/modern-campus-building.jpg')`,
            transform: 'scale(1.05)',
            filter: 'brightness(0.6) contrast(1.1) saturate(1.2)'
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600/85 via-gray-600/75 to-blue-600/85"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/40 via-transparent to-purple-500/40"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-blue-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-purple-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce delay-500"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              News & Updates
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
              Stay informed with the latest news, research, and achievements from EPRI
            </p>
          </div>
        </div>
      </Section>

      {/* Featured Post */}
      {selectedCategory === "all" && featuredPost && (
        <Section>
          <Link href={`/news/${featuredPost.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow p-0" >
              <div className="grid md:grid-cols-2 gap-0">
                <img
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  className="w-full h-full min-h-[300px] object-cover"
                />
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                  <h2 className="font-serif text-3xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-muted-foreground text-lg mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredPost.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </div>
                  </div>
                  <Button variant="outline" className="w-fit bg-transparent">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        </Section>
      )}

      {/* Category Filter */}
      <Section className={selectedCategory === "all" ? "pt-0" : ""}>
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory !== category ? "bg-transparent" : ""}
            >
              {category === "all" ? "All News" : category}
            </Button>
          ))}
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No news posts found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedCategory === "all" ? otherPosts : filteredNews).map((post) => (
              <Link key={post.id} href={`/news/${post.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow pt-0 overflow-hidden"  >
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* Newsletter CTA */}
      <Section className="bg-muted/30">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6 text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-6 text-primary-foreground/90 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest news and updates directly in your inbox
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">Subscribe Now</Link>
            </Button>
          </CardContent>
        </Card>
      </Section>

     
    </PageContainer>
  )
}
