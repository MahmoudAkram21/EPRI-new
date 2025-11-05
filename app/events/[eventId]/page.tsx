import { use } from "react"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowLeft, Share2, CheckCircle2 } from "lucide-react"
import { events } from "@/lib/data"
import { notFound } from "next/navigation"

export default function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = use(params)
  const event = events.find((e) => e.id === resolvedParams.eventId)

  if (!event) {
    notFound()
  }

  const eventDate = new Date(event.date)
  const isUpcoming = eventDate >= new Date()
  const spotsLeft = event.capacity - event.registered
  const percentFilled = (event.registered / event.capacity) * 100

  return (
    <PageContainer>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/events"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
      </div>

      {/* Event Header */}
      <section className="relative h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 pb-12 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-white/20 text-white border-white/40">{event.category}</Badge>
            {isUpcoming ? (
              <Badge className="bg-green-500/90 text-white">Upcoming</Badge>
            ) : (
              <Badge className="bg-muted/90 text-muted-foreground">Past Event</Badge>
            )}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-balance">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {eventDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Event Content */}
      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div>
              <h2 className="font-serif text-3xl font-bold mb-4">About This Event</h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">{event.description}</p>
              <p className="text-muted-foreground leading-relaxed">
                Join us for an engaging and informative event that brings together experts, practitioners, and
                enthusiasts. This is a unique opportunity to learn, network, and collaborate with peers in your field.
              </p>
            </div>

            {/* Benefits / What to Expect */}
            <div>
              <h2 className="font-serif text-3xl font-bold mb-4">
                {event.benefits ? "What's Included" : "What to Expect"}
              </h2>
              <div className="space-y-3">
                {(
                  event.benefits || [
                    "Expert presentations and keynote speeches",
                    "Interactive workshops and hands-on sessions",
                    "Networking opportunities with industry professionals",
                    "Q&A sessions with speakers",
                    "Refreshments and catering provided",
                    "Certificate of attendance",
                  ]
                ).map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div>
                <h2 className="font-serif text-3xl font-bold mb-6">Featured Speakers</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {event.speakers.map((speaker) => (
                    <Card key={speaker.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="relative h-20 w-20 flex-shrink-0">
                            <img
                              src={speaker.picture || "/placeholder.svg"}
                              alt={speaker.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1">{speaker.name}</h3>
                            <p className="text-sm text-primary mb-2">{speaker.title}</p>
                            {speaker.topic && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                <strong>Topic:</strong> {speaker.topic}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground line-clamp-3">{speaker.bio}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule */}
            <div>
              <h2 className="font-serif text-3xl font-bold mb-4">Event Agenda</h2>
              <Card>
                <CardContent className="px-0">
                  {(
                    event.agenda || [
                      { id: "1", time: "09:00 AM", title: "Registration & Welcome Coffee", description: "", duration: "30min" },
                      { id: "2", time: "09:30 AM", title: "Opening Remarks", description: "", duration: "30min" },
                      { id: "3", time: "10:00 AM", title: "Keynote Presentation", description: "", duration: "60min" },
                      { id: "4", time: "11:00 AM", title: "Panel Discussion", description: "", duration: "60min" },
                      { id: "5", time: "12:00 PM", title: "Lunch Break", description: "", duration: "60min" },
                      { id: "6", time: "01:00 PM", title: "Workshop Sessions", description: "", duration: "120min" },
                      { id: "7", time: "03:00 PM", title: "Networking & Refreshments", description: "", duration: "60min" },
                      { id: "8", time: "04:00 PM", title: "Closing Remarks", description: "", duration: "30min" },
                    ]
                  ).map((item, index, arr) => (
                    <div key={item.id}>
                      <div className="flex items-start gap-4 p-4">
                        <div className="font-semibold text-primary min-w-[100px]">{item.time}</div>
                        <div className="flex-1">
                          <div className="font-medium mb-1">{item.title}</div>
                          {item.description && <p className="text-sm text-muted-foreground mb-1">{item.description}</p>}
                          {item.speaker && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Speaker:</strong> {item.speaker}
                            </p>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{item.duration}</div>
                      </div>
                      {index < arr.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Location */}
            <div>
              <h2 className="font-serif text-3xl font-bold mb-4">Location</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">{event.location}</h3>
                      <p className="text-sm text-muted-foreground">EPRI Campus, Building A</p>
                      <p className="text-sm text-muted-foreground">123 Education Drive, City, State 12345</p>
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
                    <p className="text-muted-foreground">Map placeholder</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Capacity</span>
                      <span className="font-semibold">
                        {event.registered} / {event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentFilled}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {spotsLeft > 0 ? `${spotsLeft} spots remaining` : "Event is full"}
                    </p>
                  </div>

                  <Separator />

                  {isUpcoming ? (
                    <>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">
                          {event.price ? `$${event.price}` : "Free"}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.isConference ? "Conference registration" : "Registration required"}
                        </p>
                      </div>
                      {event.isConference ? (
                        <Button className="w-full" size="lg" disabled={spotsLeft === 0} asChild>
                          <Link href={`/events/${event.id}/register`}>
                            {spotsLeft === 0 ? "Event Full" : "Register for Conference"}
                          </Link>
                        </Button>
                      ) : (
                        <Button className="w-full" size="lg" disabled={spotsLeft === 0}>
                          {spotsLeft === 0 ? "Event Full" : "Register Now"}
                        </Button>
                      )}
                      <Button variant="outline" className="w-full bg-transparent">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Event
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">This event has already taken place</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Questions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Have questions about this event? Our events team is here to help.
                </p>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Related Events */}
            <Card>
              <CardHeader>
                <CardTitle>More Events</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/events">View All Events</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </PageContainer>
  )
}
