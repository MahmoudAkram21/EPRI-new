import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone, MessageCircle, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VisitorStatsWidget } from "@/components/visitor-stats-widget"

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div>
            <Image src="/logo.png" alt="EPRI Logo" width={120} height={48} className="h-12 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-justify">
              Egyptian Petroleum Research Institute - Leading educational and research institute dedicated to advancing
              knowledge in petroleum engineering and energy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/top-management" className="text-muted-foreground hover:text-primary transition-colors">
                  Leadership
                </Link>
              </li>
            </ul>
          </div>


          {/* Related Links */}
          <div>
            <h4 className="font-semibold mb-4">Related Links</h4>
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
            </ul>
          </div>

          {/* Address Info */}
          <div>
            <h4 className="font-semibold mb-4">Address Info</h4>
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
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Stay updated with our latest courses and events.</p>
            <form className="flex gap-2">
              <Input type="email" placeholder="Your email" className="flex-1" />
              <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
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
              All Rights Reserved © Designed by{" "}
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
