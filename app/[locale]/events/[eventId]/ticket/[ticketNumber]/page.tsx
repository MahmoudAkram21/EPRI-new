"use client"

import { useEffect, useState, useRef, use } from "react"
import { events } from "@/lib/data"
import { notFound, useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  MapPin,
  Clock,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Download,
  Share2,
  CheckCircle2,
  QrCode,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { ConferenceRegistration } from "@/lib/data"

export default function TicketPage({
  params,
}: {
  params: Promise<{ eventId: string; ticketNumber: string }>
}) {
  const resolvedParams = use(params)
  const event = events.find((e) => e.id === resolvedParams.eventId)
  const [registration, setRegistration] = useState<ConferenceRegistration | null>(null)
  const router = useRouter()
  const ticketRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Retrieve registration from localStorage
    const stored = localStorage.getItem(`registration-${resolvedParams.ticketNumber}`)
    if (stored) {
      setRegistration(JSON.parse(stored))
    }
  }, [resolvedParams.ticketNumber])

  if (!event || !registration) {
    return (
      <PageContainer>
        <Section className="py-20 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Loading your ticket...</h1>
          </div>
        </Section>
      </PageContainer>
    )
  }

  const handleDownload = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${event.title} - Ticket`,
          text: `I'm registered for ${event.title}! Ticket: ${resolvedParams.ticketNumber}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Share failed")
      }
    }
  }

  return (
    <PageContainer>
      <Section>
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="font-serif text-4xl font-bold mb-2">Registration Confirmed!</h1>
              <p className="text-muted-foreground text-lg">
                Your ticket has been generated. Please save this for your records.
              </p>
            </div>
          </AnimatedSection>

          {/* Ticket Card */}
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="overflow-hidden" ref={ticketRef}>
              {/* Ticket Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-3">
                      {event.category}
                    </Badge>
                    <h2 className="font-serif text-2xl font-bold mb-2">{event.title}</h2>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.time.split(" - ")[0]}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center justify-center">
                      <QrCode className="h-16 w-16" />
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="px-6 space-y-6">
                {/* Ticket Number */}
                <div className="text-center py-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Ticket Number</p>
                  <p className="text-2xl font-bold font-mono">{resolvedParams.ticketNumber}</p>
                </div>

                <Separator />

                {/* Attendee Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Attendee Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{registration.attendeeName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium break-all">{registration.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{registration.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Organization</p>
                        <p className="font-medium">{registration.organization}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Job Title</p>
                        <p className="font-medium">{registration.jobTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Registration Date</p>
                        <p className="font-medium">
                          {new Date(registration.registrationDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Event Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{event.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{event.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Important Information</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Please bring a printed or digital copy of this ticket</li>
                    <li>• Check-in opens 30 minutes before the event start time</li>
                    <li>• A valid photo ID is required for entry</li>
                    <li>• For any changes or cancellations, contact us at least 48 hours in advance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Action Buttons */}
          <AnimatedSection animation="fade-up" delay={0.2}>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button onClick={handleDownload} size="lg" className="gap-2">
                <Download className="h-5 w-5" />
                Download/Print Ticket
              </Button>
              {navigator.share && (
                <Button onClick={handleShare} variant="outline" size="lg" className="gap-2">
                  <Share2 className="h-5 w-5" />
                  Share
                </Button>
              )}
              <Link href={`/events/${event.id}`}>
                <Button variant="outline" size="lg">
                  View Event Details
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Additional Info */}
          <AnimatedSection animation="fade-up" delay={0.3}>
            <Card className="mt-8">
              <CardHeader>
                <h3 className="font-semibold text-lg">Need Help?</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about your registration or need to make changes, please contact our events
                  team:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href="mailto:events@epri.edu" className="text-primary hover:underline">
                      events@epri.edu
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href="tel:+2021234567" className="text-primary hover:underline">
                      +20 2 1234 5678
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Section>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #ticket-card,
          #ticket-card * {
            visibility: visible;
          }
          #ticket-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </PageContainer>
  )
}

