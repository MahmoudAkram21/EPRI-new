import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { UserProvider } from "@/contexts/user-context"
import { ReduxProvider } from "@/store/ReduxProvider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { ConditionalHeader } from '@/components/conditional-header'
import { ConditionalFooter } from '@/components/conditional-footer'
import { VisitTrackerProvider } from '@/components/visit-tracker-provider'
import { SocialMediaButtons } from '@/components/social-media-buttons'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "EPRI - Egyptian Petroleum Research Institute",
  description:
    "Leading educational and research institute offering world-class courses in petroleum engineering, energy, and related fields",
  generator: "v0.app",
  icons: {
    icon: "/favicon.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ReduxProvider>
          <UserProvider>
            <VisitTrackerProvider />
            <ConditionalHeader />
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster />
            <ConditionalFooter />
            <SocialMediaButtons position="right" showLabels={true} />
          </UserProvider>
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  )
}
