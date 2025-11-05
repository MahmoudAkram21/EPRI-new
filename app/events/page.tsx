import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { events } from "@/lib/data"

export default function EventsPage() {
  const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date())
  const pastEvents = events.filter((event) => new Date(event.date) < new Date())

  return (
    <PageContainer>

      {/* Hero Section with Background */}
      <Section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" 
          style={{ 
            backgroundImage: `url('/conference-symposium.jpg')`,
            transform: 'scale(1.05)',
            filter: 'brightness(0.6) contrast(1.1) saturate(1.2)'
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/85 via-blue-600/75 to-cyan-600/85"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/40 via-transparent to-orange-500/40"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-green-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-pink-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce delay-500"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              Events & Workshops
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
              Join us for conferences, workshops, and networking opportunities that advance your knowledge and career
            </p>
          </div>
        </div>
      </Section>

      {/* Upcoming Events */}
      <Section>
        <div className="mb-12">
          <h2 className="font-serif text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-muted-foreground text-lg">Don't miss these exciting opportunities</p>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No upcoming events at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-56 object-cover rounded-t-lg -mt-6"
                  />
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>{event.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                    <CardDescription className="text-base">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground pt-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.registered} / {event.capacity} registered
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <Section className="bg-muted/30">
          <div className="mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Past Events</h2>
            <p className="text-muted-foreground text-lg">Explore our previous events and highlights</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full opacity-75">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{event.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* CTA Section */}
      <Section>
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6 text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Want to Host an Event?</h2>
            <p className="text-xl mb-6 text-primary-foreground/90 max-w-2xl mx-auto">
              EPRI welcomes proposals for workshops, seminars, and conferences. Get in touch with our events team.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">Contact Events Team</Link>
            </Button>
          </CardContent>
        </Card>
      </Section>

    </PageContainer>
  )
}
