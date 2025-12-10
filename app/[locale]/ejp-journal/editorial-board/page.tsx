"use client"

import { Section } from "@/components/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Mail, Building2, Award } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"

export default function EditorialBoardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  // Sample editorial board members - replace with actual data from backend
  // Note: In a real implementation, these would come from the database with translations
  const editorialBoard = [
    {
      id: "1",
      name: { en: "Dr. Ahmed Hassan", ar: "د. أحمد حسن" },
      role: "editorInChief",
      affiliation: { en: "EPRI, Egypt", ar: "معهد بحوث البترول، مصر" },
      email: "ahmed.hassan@epri.eg",
      image: "/dr-ahmed-hassan.jpg",
      bio: { 
        en: "Expert in petroleum engineering with over 20 years of experience.",
        ar: "خبير في هندسة البترول مع أكثر من 20 عاماً من الخبرة."
      }
    },
    {
      id: "2",
      name: { en: "Dr. Fatma Elsayed", ar: "د. فاطمة السيد" },
      role: "associateEditor",
      affiliation: { en: "EPRI, Egypt", ar: "معهد بحوث البترول، مصر" },
      email: "fatma.elsayed@epri.eg",
      image: "/dr-fatma-elsayed.jpg",
      bio: { 
        en: "Specialized in petrochemical processes and catalysis.",
        ar: "متخصصة في عمليات البتروكيماويات والتحفيز."
      }
    },
    {
      id: "3",
      name: { en: "Dr. Mohamed Ibrahim", ar: "د. محمد إبراهيم" },
      role: "associateEditor",
      affiliation: { en: "EPRI, Egypt", ar: "معهد بحوث البترول، مصر" },
      email: "mohamed.ibrahim@epri.eg",
      image: "/dr-mohamed-ibrahim.jpg",
      bio: { 
        en: "Research focus on reservoir engineering and enhanced oil recovery.",
        ar: "يركز بحثه على هندسة المكامن وتحسين استخراج النفط."
      }
    },
    {
      id: "4",
      name: { en: "Dr. Laila Abdelrahman", ar: "د. ليلى عبدالرحمن" },
      role: "boardMember",
      affiliation: { en: "EPRI, Egypt", ar: "معهد بحوث البترول، مصر" },
      email: "laila.abdelrahman@epri.eg",
      image: "/dr-laila-abdelrahman.jpg",
      bio: { 
        en: "Expert in environmental engineering and sustainable energy.",
        ar: "خبيرة في الهندسة البيئية والطاقة المستدامة."
      }
    },
    {
      id: "5",
      name: { en: "Dr. Yasser Khalil", ar: "د. ياسر خليل" },
      role: "boardMember",
      affiliation: { en: "EPRI, Egypt", ar: "معهد بحوث البترول، مصر" },
      email: "yasser.khalil@epri.eg",
      image: "/dr-yasser-khalil.jpg",
      bio: { 
        en: "Specialized in drilling engineering and well completion.",
        ar: "متخصص في هندسة الحفر وإكمال الآبار."
      }
    }
  ];

  // Helper function to get translation
  function getTranslation(value: { en: string; ar: string } | string): string {
    if (typeof value === 'string') return value;
    return value[locale as 'en' | 'ar'] || value.en || '';
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700 mb-8">
        <div className="relative z-10 mx-auto max-w-6xl">
          <Button asChild variant="ghost" className="mb-6 text-white hover:bg-white/10">
            <Link href="/ejp-journal" className="flex items-center">
              <BackArrow className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t('ejpJournal.editorialBoard.backToJournal')}
            </Link>
          </Button>
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
            {t('ejpJournal.editorialBoard.title')}
          </h1>
          <p className="text-lg leading-relaxed text-white/90 sm:text-xl max-w-3xl">
            {t('ejpJournal.editorialBoard.subtitle')}
          </p>
        </div>
      </Section>

      {/* Editorial Board Members */}
      <Section>
        <div className="space-y-8">
          {editorialBoard.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{getTranslation(member.name)}</h3>
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <Award className="h-4 w-4" />
                          <span className="font-semibold">{t(`ejpJournal.editorialBoard.role.${member.role}`)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Building2 className="h-4 w-4" />
                          <span>{getTranslation(member.affiliation)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors">
                            {member.email}
                          </a>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{getTranslation(member.bio)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Contact Section */}
      <Section>
        <Card>
          <CardHeader>
            <CardTitle>{t('ejpJournal.editorialBoard.editorialOffice')}</CardTitle>
            <CardDescription>{t('ejpJournal.editorialBoard.contactEditorial')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-300">
                {t('ejpJournal.editorialBoard.contactDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <a href="mailto:editorial@epri.eg">
                    <Mail className="mr-2 h-4 w-4" />
                    {t('ejpJournal.editorialBoard.contactButton')}
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/ejp-journal">
                    {t('ejpJournal.editorialBoard.backToHomepage')}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </div>
  )
}

