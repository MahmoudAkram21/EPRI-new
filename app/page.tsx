 
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowRight, BookOpen, Users, Award, TrendingUp, Calendar, Star, Eye, Target, Heart } from "lucide-react"
import { categories, courses, instructors, events, news, testimonials, stats } from "@/lib/data"
import { HeroSlider } from "@/components/hero-slider"
import { AnimatedSection } from "@/components/animated-section"
import { AnimatedCounter } from "@/components/animated-counter"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ServicesSection } from "@/components/services-section"
import { ClientsCarousel } from "@/components/clients-carousel"
import { AnnouncementsSwiper } from "@/components/announcements-swiper"
import { getActiveAnnouncements } from "@/lib/announcements"

export default function HomePage() {
  const popularCourses = courses.slice(0, 3)
  const upcomingEvents = events.slice(0, 2)
  const latestNews = news.slice(0, 3)
  const announcements = getActiveAnnouncements()

  return (
    <PageContainer>
     

      <HeroSlider />

      {/* Announcements Section */}
      <AnnouncementsSwiper 
        announcements={announcements}
        autoHide={true}
        showCloseButton={true}
        className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 border-b border-border/50"
      />

      <Section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <AnimatedSection animation="fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center group">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 md:p-3 rounded-full group-hover:shadow-lg transition-all duration-300">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
              </div>
              <div className="font-serif text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                <AnimatedCounter end={stats.students} suffix="+" />
              </div>
              <div className="text-muted-foreground font-medium text-sm md:text-base">Active Students</div>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 md:p-3 rounded-full group-hover:shadow-lg transition-all duration-300">
                  <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
              </div>
              <div className="font-serif text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                <AnimatedCounter end={stats.courses} suffix="+" />
              </div>
              <div className="text-muted-foreground font-medium text-sm md:text-base">Courses Available</div>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-2 md:p-3 rounded-full group-hover:shadow-lg transition-all duration-300">
                  <Award className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
              </div>
              <div className="font-serif text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                <AnimatedCounter end={stats.satisfaction} suffix="%" />
              </div>
              <div className="text-muted-foreground font-medium text-sm md:text-base">Satisfaction Rate</div>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 md:p-3 rounded-full group-hover:shadow-lg transition-all duration-300">
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
              </div>
              <div className="font-serif text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                <AnimatedCounter end={stats.instructors} suffix="+" />
              </div>
              <div className="text-muted-foreground font-medium text-sm md:text-base">Expert Instructors</div>
            </div>
          </div>
        </AnimatedSection>
      </Section>

      {/* About Section */}
      <Section>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <AnimatedSection animation="fade-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Leading the Way in Education and Research</h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
              For over three decades, EPRI has been at the forefront of educational excellence and groundbreaking
              research. Our commitment to innovation and academic rigor has shaped the careers of thousands of
              professionals worldwide.
            </p>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              We combine world-class faculty, cutting-edge facilities, and a collaborative learning environment to
              provide an unparalleled educational experience.
            </p>
            <Button asChild className="w-full md:w-auto">
              <Link href="/top-management">
                Meet Our Leadership <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={0.2}>
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              <img
                src="/modern-university-library-students-studying.jpg"
                alt="Students studying"
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* Vision, Mission & Values Section */}
      <Section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Our Vision, Mission & Values
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Guiding principles that drive our commitment to excellence in petroleum research and education
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Vision */}
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-300 group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Vision
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  To be the leading center of excellence in petroleum research and education in the Middle East and
                  Africa, recognized globally for innovative solutions and sustainable practices in the energy sector.
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Mission */}
          <AnimatedSection animation="fade-up" delay={0.2}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-purple-300 group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Mission
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  To advance petroleum science and technology through cutting-edge research, world-class education, and
                  strategic partnerships, while developing the next generation of energy leaders and contributing to
                  Egypt's sustainable development.
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Values */}
          <AnimatedSection animation="fade-up" delay={0.3}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-orange-300 group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-center mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Values
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Excellence in research and education</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Innovation and creativity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Integrity and ethical conduct</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Collaboration and teamwork</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Sustainability and responsibility</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Section>

      {/* Clients Section */}
      <Section className="bg-gradient-to-br overflow-hidden from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-cyan-900/20 dark:to-blue-900/20">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Our Trusted Partners
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Collaborating with leading companies in the petroleum and energy sector
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={0.5}>
          <ClientsCarousel />
        </AnimatedSection>
      </Section>

      {/* Services Section */}
      <ServicesSection />

      <Section className="bg-muted/30">
        <AnimatedSection animation="fade-up">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-4">Learn from the Best</h2>
              <p className="text-muted-foreground text-lg">
                Our instructors are leading experts in their fields
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex bg-transparent">
              <Link href="/courses">
                View All Instructors <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          {instructors.map((instructor, index) => (
            <AnimatedSection key={instructor.id} animation="slide-up" delay={index * 0.15}>
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src={instructor.picture || "/placeholder.svg"} alt={instructor.name} />
                    <AvatarFallback>
                      {instructor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-xl mb-2">{instructor.name}</h3>
                  <p className="text-primary font-medium mb-3">{instructor.expertise}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{instructor.bio}</p>
                  <div className="text-sm text-muted-foreground">{instructor.courses} courses</div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Events Section */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-muted-foreground text-lg">
                Join us for workshops, conferences, and networking opportunities
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex bg-transparent">
              <Link href="/events">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingEvents.map((event, index) => (
            <AnimatedSection key={event.id} animation="fade-up" delay={index * 0.2}>
              <Link href={`/events/${event.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 px-6">
                  <div className="md:flex">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full md:w-48 h-48 object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                    />
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>{event.category}</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </div>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>{event.time}</div>
                          <div>{event.location}</div>
                          <div className="pt-2">
                            {event.registered} / {event.capacity} registered
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      <Section className="bg-muted/30">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear from those who have transformed their careers with EPRI
            </p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.id} animation="scale" delay={index * 0.15}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      <Section className="bg-muted/30">
        <AnimatedSection animation="fade-up">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-4">Latest News</h2>
              <p className="text-muted-foreground text-lg">Stay updated with the latest from EPRI</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex bg-transparent">
              <Link href="/news">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6">
          {latestNews.map((post, index) => (
            <AnimatedSection key={post.id} animation="fade-up" delay={index * 0.15}>
              <Link href={`/news/${post.id}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 pt-0 overflow-hidden" >
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Popular Courses Section */}
      {/* <Section className="bg-muted/30">
        <AnimatedSection animation="fade-up">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-4">Popular Courses</h2>
              <p className="text-muted-foreground text-lg">Start learning with our most enrolled programs</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex bg-transparent">
              <Link href="/courses">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCourses.map((course, index) => (
            <AnimatedSection key={course.id} animation="fade-up" delay={index * 0.15}>
              <Link href={`/courses/${course.id}`}>
                <Card className="h-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription>{course.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.lessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">By {course.instructor}</div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="font-semibold text-lg">{course.isFree ? "Free" : `$${course.price}`}</div>
                    <div className="text-sm text-muted-foreground">{course.students.toLocaleString()} students</div>
                  </CardFooter>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/courses">
              View All Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section> */}

      {/* CTA Section */}
      <Section className="bg-primary text-primary-foreground">
        <AnimatedSection animation="fade-up">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Join thousands of students advancing their careers with EPRI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">
                  Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-primary-foreground/10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/20"
                asChild
              >
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </Section>

     

      <ScrollToTop />
    </PageContainer>
  )
}