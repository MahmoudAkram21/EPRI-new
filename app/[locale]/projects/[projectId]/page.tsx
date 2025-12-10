/** @format */

import { use } from "react";
import { projects } from "@/lib/data";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { Section } from "@/components/section";
import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  Target,
  Award,
  Mail,
  Video,
  CheckCircle2,
  TrendingUp,
  Clock,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ReactPlayer from "react-player";

export function generateStaticParams() {
  return projects.map((project) => ({
    projectId: project.id,
  }));
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = use(params)
  const project = projects.find((p) => p.id === resolvedParams.projectId);

  if (!project) {
    notFound();
  }

  const statusIcons = {
    Planning: Clock,
    "In Progress": TrendingUp,
    Completed: CheckCircle2,
    "On Hold": Clock,
  };

  const statusColors = {
    Planning: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "In Progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Completed: "bg-green-500/10 text-green-500 border-green-500/20",
    "On Hold": "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const StatusIcon = statusIcons[project.status];

  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-[400px] -mx-4 md:-mx-6 lg:-mx-8 mb-12">
          <Image
            src={project.images[0] || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <AnimatedSection animation="fade-up">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{project.category}</Badge>
                  <Badge className={statusColors[project.status]}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {project.status}
                  </Badge>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
                  {project.title}
                </h1>
                <p className="text-xl text-white/90 max-w-3xl">
                  {project.description}
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            {project.video && (
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Project Overview Video
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <ReactPlayer
                        src={project.video}
                        width="100%"
                        height="100%"
                        controls
                      />
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {/* Images Gallery */}
            <AnimatedSection animation="fade-up" delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Project Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-48 rounded-lg overflow-hidden group"
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${project.title} - Image ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Objectives and Achievements Tabs */}
            <AnimatedSection animation="fade-up" delay={0.2}>
              <Tabs defaultValue="objectives" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="objectives">Objectives</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="objectives">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Project Objectives
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {project.objectives && project.objectives.length > 0 ? (
                        <ul className="space-y-3">
                          {project.objectives.map((objective, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">
                                {objective}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">
                          No objectives listed for this project.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Key Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {project.achievements &&
                      project.achievements.length > 0 ? (
                        <ul className="space-y-3">
                          {project.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Award className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">
                                {achievement}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">
                          No achievements listed yet for this project.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </AnimatedSection>

            {/* Team Members */}
            {project.staff && project.staff.length > 0 && (
              <AnimatedSection animation="fade-up" delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Project Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {project.staff.map((member, index) => (
                        <div
                          key={member.id}
                          className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                        >
                          <div className="relative h-16 w-16 flex-shrink-0">
                            <Image
                              src={member.picture || "/placeholder.svg"}
                              alt={member.name}
                              fill
                              className="object-cover rounded-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {member.title}
                            </p>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {member.specialization}
                            </Badge>
                            <a
                              href={`mailto:${member.email}`}
                              className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
                            >
                              <Mail className="h-3 w-3" />
                              Contact
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Category</h4>
                      <Badge variant="outline">{project.category}</Badge>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Status</h4>
                      <Badge className={statusColors[project.status]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {project.status}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="font-semibold">Start Date: </span>
                          {new Date(project.startDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                      {project.endDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-semibold">End Date: </span>
                            {new Date(project.endDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {project.staff && project.staff.length > 0 && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            <span className="font-semibold">Team Size: </span>
                            {project.staff.length} member
                            {project.staff.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle>Get Involved</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Interested in learning more about this project or
                      exploring collaboration opportunities?
                    </p>
                    <Link href="/contact" className="block">
                      <Button className="w-full">Contact Us</Button>
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </Section>

      {/* Related Projects */}
      <Section className="bg-muted/30">
        <AnimatedSection animation="fade-up">
          <h2 className="font-serif text-3xl font-bold mb-8">
            Related Projects
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {projects
              .filter(
                (p) => p.id !== project.id && p.category === project.category
              )
              .slice(0, 3)
              .map((relatedProject) => {
                const RelatedStatusIcon = statusIcons[relatedProject.status];
                return (
                  <Card
                    key={relatedProject.id}
                    className="hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={relatedProject.images[0] || "/placeholder.svg"}
                        alt={relatedProject.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <Badge className={statusColors[relatedProject.status]}>
                          <RelatedStatusIcon className="h-3 w-3 mr-1" />
                          {relatedProject.status}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-base line-clamp-2">
                        {relatedProject.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/projects/${relatedProject.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Project
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </AnimatedSection>
      </Section>
    </PageContainer>
  );
}
