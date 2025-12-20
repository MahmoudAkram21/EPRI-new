"use client";

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from 'next-intl';
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone, MessageCircle, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VisitorStatsWidget } from "@/components/visitor-stats-widget"

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div>
            <Image src="/logo.png" alt="EPRI Logo" width={200} height={64} className="h-12 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-justify">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://www.webofscience.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Web of Science
                </Link>
              </li>
              <li>
                <Link
                  href="https://scholar.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Google Scholar
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.scopus.com/home.uri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Scopus
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.civilejournal.org/index.php/cej"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Scival
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.ekb.eg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  EKB
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.sciencedirect.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  ScienceDirect
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.researchgate.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  ResearchGate
                </Link>
              </li>
              <li>
                <Link
                  href="https://link.springer.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  SpringerNature
                </Link>
              </li>
            </ul>
          </div>


          {/* Related Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.relatedLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://mohesr.gov.eg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Ministry of Higher Education & Scientific Research
                </Link>
              </li>
              <li>
                <Link
                  href="http://www.crci.sci.eg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Council of Research Centers and Institutes
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.petroleum.gov.eg/en/Pages/HomePage.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Ministry of Petroleum and Mineral Resources
                </Link>
              </li>
              <li>
                <Link
                  href="http://www.asrt.sci.eg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Academy of Scientific Research and Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* Address Info */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.addressInfo')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  1 Ahmed El-Zomor Street, El Zohour Region - Nasr city - Cairo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-muted-foreground">
                  <a href="tel:+20222747847" className="hover:text-primary transition-colors block">
                    +(202)22747847
                  </a>
                  <a href="tel:+20222747433" className="hover:text-primary transition-colors block">
                    +(202)22747433
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href="https://wa.me/201201123333"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  01201123333
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:research@epri.sci.eg"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  research@epri.sci.eg
                </a>
              </li>
            </ul>
          </div>

          {/* Visitor Stats Widget Column */}
          <div>
            <VisitorStatsWidget />
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.subscribe')}</h4>
            <p className="text-sm text-muted-foreground mb-4">{t('footer.subscribe')}</p>
            <form className="flex gap-2">
              <Input type="email" placeholder={t('footer.emailPlaceholder')} className="flex-1" />
              <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* ISO Certificates Section */}
        <div className="pt-8 border-t mb-8">
          <div className="flex justify-center items-center gap-6">
            {/* ISO 9001:2015 */}
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex flex-col items-center justify-center text-white shadow-lg hover:scale-105 transition-transform duration-200">
                <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-wide">CERTIFIED</div>
                <div className="flex items-center gap-1 my-1">
                  <span className="text-2xl md:text-3xl font-bold">ISO</span>
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16c-1.657 0-3.194-.485-4.48-1.32l-.788.787a.75.75 0 11-1.06-1.06l.788-.787A5.973 5.973 0 014.332 8.027z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-[10px] md:text-xs font-semibold">9001:2015</div>
              </div>
            </div>

            {/* ISO 45001:2018 */}
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex flex-col items-center justify-center text-white shadow-lg hover:scale-105 transition-transform duration-200">
                <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-wide">CERTIFIED</div>
                <div className="flex items-center gap-1 my-1">
                  <span className="text-2xl md:text-3xl font-bold">ISO</span>
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16c-1.657 0-3.194-.485-4.48-1.32l-.788.787a.75.75 0 11-1.06-1.06l.788-.787A5.973 5.973 0 014.332 8.027z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-[10px] md:text-xs font-semibold">45001:2018</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Media Icons - Bottom Left */}
            <div className="flex gap-3">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="X formerly Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://wa.me/201201123333"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:research@epri.sci.eg"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Official email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>

            {/* Copyright - Bottom Right */}
            <p className="text-sm text-muted-foreground text-center md:text-right">
              {t('footer.copyright')} © Designed by{" "}
              <a
                href="https://www.qeematech.net/"
                target="_blank"
                rel="dofollow"
                className="hover:text-primary transition-colors"
              >
                Qeematech
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
