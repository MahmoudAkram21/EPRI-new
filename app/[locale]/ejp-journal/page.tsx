"use client"

import { Section } from "@/components/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Users, FileText, Search, ArrowRight, ArrowLeft } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"

export default function EJPJournalPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700 mb-8">
        <div className="relative z-10 mx-auto max-w-6xl">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
            {t('ejpJournal.title')}
          </h1>
          <p className="text-lg leading-relaxed text-white/90 sm:text-xl max-w-3xl mb-8">
            {t('ejpJournal.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/ejp-journal/editorial-board">
                <Users className={cn("h-5 w-5", isRTL ? "ml-2" : "mr-2")} />
                {t('ejpJournal.editorialBoard')}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/ejp-journal/submit">
                <FileText className={cn("h-5 w-5", isRTL ? "ml-2" : "mr-2")} />
                {t('ejpJournal.submitArticle')}
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Quick Links */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t('ejpJournal.quickLinks.currentIssue.title')}</CardTitle>
              <CardDescription>{t('ejpJournal.quickLinks.currentIssue.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/ejp-journal/current-issue" className="flex items-center">
                  {t('ejpJournal.viewIssue')} <ArrowIcon className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t('ejpJournal.quickLinks.archive.title')}</CardTitle>
              <CardDescription>{t('ejpJournal.quickLinks.archive.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/ejp-journal/archive" className="flex items-center">
                  {t('ejpJournal.browseArchive')} <ArrowIcon className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Search className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t('ejpJournal.quickLinks.search.title')}</CardTitle>
              <CardDescription>{t('ejpJournal.quickLinks.search.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/ejp-journal/search" className="flex items-center">
                  {t('ejpJournal.search')} <ArrowIcon className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t('ejpJournal.quickLinks.editorialBoard.title')}</CardTitle>
              <CardDescription>{t('ejpJournal.quickLinks.editorialBoard.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/ejp-journal/editorial-board" className="flex items-center">
                  {t('ejpJournal.viewBoard')} <ArrowIcon className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* About Section */}
      <Section>
        <Card>
          <CardHeader>
            <CardTitle>{t('ejpJournal.about.title')}</CardTitle>
            <CardDescription>{t('ejpJournal.about.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
              {t('ejpJournal.about.description1')}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              {t('ejpJournal.about.description2')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">100+</div>
                <div className="text-sm text-muted-foreground">{t('ejpJournal.about.publishedArticles')}</div>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">{t('ejpJournal.about.internationalAuthors')}</div>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">4.2</div>
                <div className="text-sm text-muted-foreground">{t('ejpJournal.about.impactFactor')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </div>
  )
}

