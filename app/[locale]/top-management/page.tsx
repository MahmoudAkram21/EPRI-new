
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Linkedin } from "lucide-react"
import { teamMembers } from "@/lib/data"

export default function TopManagementPage() {
  return (
    <PageContainer>

      {/* Hero Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-5xl font-bold mb-4">Leadership Team</h1>
            <p className="text-xl text-muted-foreground">
              Meet the visionary leaders guiding EPRI towards excellence in education and research
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Grid */}
      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden px-6">
              <div className="md:flex">
                <div className="md:w-48 flex-shrink-0">
                  <img
                    src={member.picture || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <CardContent className="flex-1 pt-6">
                  <h3 className="font-serif text-2xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-semibold mb-4">{member.role}</p>
                  <p className="text-muted-foreground leading-relaxed mb-6">{member.bio}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-transparent">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Mission Statement */}
      <Section className="bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            At EPRI, we are committed to advancing knowledge, fostering innovation, and preparing the next generation of
            leaders. Our leadership team brings together decades of experience in education, research, and
            administration to create an environment where excellence thrives.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-3">Excellence</h3>
              <p className="text-muted-foreground">Maintaining the highest standards in education and research</p>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold mb-3">Innovation</h3>
              <p className="text-muted-foreground">Pioneering new approaches to learning and discovery</p>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold mb-3">Impact</h3>
              <p className="text-muted-foreground">Creating positive change in our community and beyond</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Advisory Board Section */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold mb-4">Advisory Board</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our distinguished advisory board provides strategic guidance and expertise
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: "Dr. Patricia Lee", role: "Technology Advisor", image: "/placeholder.svg?height=200&width=200" },
            { name: "Prof. James Wilson", role: "Academic Advisor", image: "/placeholder.svg?height=200&width=200" },
            { name: "Ms. Sarah Chen", role: "Industry Liaison", image: "/placeholder.svg?height=200&width=200" },
            { name: "Dr. Michael Brown", role: "Research Advisor", image: "/placeholder.svg?height=200&width=200" },
          ].map((advisor, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarImage src={advisor.image || "/placeholder.svg"} alt={advisor.name} />
                  <AvatarFallback>
                    {advisor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg mb-1">{advisor.name}</h3>
                <p className="text-sm text-muted-foreground">{advisor.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

    </PageContainer>
  )
}
