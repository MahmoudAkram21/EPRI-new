import type React from "react"
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { UserProvider } from "@/contexts/user-context"
import { ReduxProvider } from "@/store/ReduxProvider"
import { Toaster } from "@/components/ui/toaster"
import { ConditionalHeader } from '@/components/conditional-header'
import { ConditionalFooter } from '@/components/conditional-footer'
import { VisitTrackerProvider } from '@/components/visit-tracker-provider'
import { SocialMediaButtons } from '@/components/social-media-buttons'
import { ScrollToTop } from '@/components/scroll-to-top'
import { HtmlAttributes } from '@/components/html-attributes'
import { routing } from "@/i18n/routing";
import { Locale } from "next-intl";


export function generateStaticParams() {
  return routing.locales.map((locale: Locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Providing all messages to the client
  // Import messages directly based on the locale from params
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <>
      <HtmlAttributes lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} />
      <NextIntlClientProvider messages={messages}>
        <ReduxProvider>
          <UserProvider>
            <VisitTrackerProvider />
            <ConditionalHeader />
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster />
            <ConditionalFooter />
            <SocialMediaButtons position="right" showLabels={true} />
            <ScrollToTop />
          </UserProvider>
        </ReduxProvider>
      </NextIntlClientProvider>
      <Analytics />
    </>
  )
}


