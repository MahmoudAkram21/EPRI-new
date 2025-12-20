/** @format */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, User, LogOut, Shield, ChevronDown, Building2, MapPin, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/lib/api";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchConference, selectShouldFetchConference, clearConference, type ConferenceState } from "@/store/slices/conferenceSlice";
import { Service } from "@/lib/services";
import type { RootState } from "@/store/store";
import type { ServiceCenter } from "@/types/service-center";

type TranslationObject = { en: string; ar: string } | string

// Helper function to extract translation value
function getTranslation(value: TranslationObject | undefined, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || ''
  }
  return ''
}

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [deptSections, setDeptSections] = useState<Array<{ id: string; name: string | TranslationObject }>>([]);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string | TranslationObject; section_id: string; icon?: string }>>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState<string>('');
  const { isLoggedIn, logout, user } = useUser();
  const pathname = usePathname();

  // Track hash changes for active state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash);
      const handleHashChange = () => {
        setCurrentHash(window.location.hash);
      };
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, [pathname]);

  const dispatch = useAppDispatch();
  const conference = useAppSelector((state: RootState) => {
    const conf = state.conference as ConferenceState;
    return conf?.data;
  });
  const shouldFetch = useAppSelector((state: RootState) => {
    const conf = state.conference as ConferenceState;
    return selectShouldFetchConference({ conference: conf });
  });

  const hasConference = !!conference;

  // Helper function to check if a menu item is active
  const isActiveLink = (href: string) => {
    console.log(href, pathname);
    if (href === `/${locale}`) {
      return pathname === `/${locale}/`;

    }
    return pathname.startsWith(`/${locale}${href}`);
  };

  useEffect(() => {
    if (shouldFetch) {
      dispatch(fetchConference());
    }
  }, [shouldFetch, dispatch]);

  // Load department sections, departments, and services for mega menu
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load department sections
        const sectionsRes = await apiClient.getDepartmentSections();
        console.log('Loaded sections:', sectionsRes.sections?.length || 0);
        setDeptSections(sectionsRes.sections.map((s: any) => ({
          id: s.id,
          name: getTranslation(s.name, locale)
        })));

        // Load departments
        const deptRes = await apiClient.getDepartments();
        console.log('Loaded departments:', deptRes.departments?.length || 0);
        if (deptRes.departments?.length > 0) {
          setDepartments(deptRes.departments.map((d: any) => ({
            id: d.id,
            name: getTranslation(d.name, locale),
            section_id: d.section_id,
            icon: d.icon
          })));
        } else {
          // If API returns empty departments, create fallback departments for each section
          console.log('API returned empty departments, creating fallback');
          const fallbackDepartments = sectionsRes.sections.slice(0, 6).map((section: any, idx: number) => ({
            id: String(idx + 1),
            name: `${getTranslation(section.name, locale)} Department`,
            section_id: section.id,
            icon: "🏛️"
          }));
          setDepartments(fallbackDepartments);
        }

        // Load services
        const servicesRes = await apiClient.getServices();
        setServices(servicesRes.services);

        const centersRes = await apiClient.getServiceCenters();
        const normalizedCenters = (centersRes.centers ?? []).map((center: any) => {
          const equipments = Array.isArray(center.equipments) ? center.equipments : [];
          const products = Array.isArray(center.products) ? center.products : [];
          const servicesList = Array.isArray(center.services) ? center.services : [];
          return {
            ...center,
            name: getTranslation(center.name, locale),
            headline: center.headline ? getTranslation(center.headline, locale) : undefined,
            description: center.description ? getTranslation(center.description, locale) : undefined,
            equipments,
            products,
            services: servicesList
          };
        });
        setServiceCenters(normalizedCenters);
      } catch (e) {
        console.error('Error loading header data:', e);

        // Fallback: Load departments from local data
        try {
          // Import the departments from the already imported local data
          if (departments && departments.length > 0) {
            console.log('Using local departments fallback', departments.length);

            // Create basic sections from department names
            const uniqueWords = Array.from(new Set(departments.map(d => {
              const name = typeof d.name === 'string' ? d.name : getTranslation(d.name, locale);
              return name.split(" ")[0];
            })));
            const fallbackSections = uniqueWords.slice(0, 6).map((word, idx) => ({
              id: String(idx + 1),
              name: word
            }));
            setDeptSections(fallbackSections);

            // Map departments with section associations
            setDepartments(departments.map((d, idx) => ({
              id: d.id,
              name: typeof d.name === 'string' ? d.name : getTranslation(d.name, locale),
              section_id: String((idx % fallbackSections.length) + 1), // Distribute across sections
              icon: d.icon || "🏛️"
            })));
          } else {
            // Ultimate fallback - create some sample departments
            console.log('Using ultimate fallback departments');
            const sampleDepartments = [
              { id: "1", name: "Sedimentology Laboratory", section_id: "1", icon: "🪨" },
              { id: "2", name: "Paleontology Laboratory", section_id: "1", icon: "�" },
              { id: "3", name: "Geophysics Laboratory", section_id: "2", icon: "🌍" },
              { id: "4", name: "Chemical Analysis Lab", section_id: "2", icon: "🧪" },
              { id: "5", name: "Petroleum Engineering", section_id: "3", icon: "⛽" },
              { id: "6", name: "Research Center", section_id: "3", icon: "🔬" },
            ];
            const sampleSections = [
              { id: "1", name: "Geology" },
              { id: "2", name: "Analysis" },
              { id: "3", name: "Engineering" },
            ];
            setDeptSections(sampleSections);
            setDepartments(sampleDepartments);
          }
        } catch (fallbackError) {
          console.error('Fallback data loading failed:', fallbackError);
          // Last resort fallback
          const lastResortDepartments = [
            { id: "1", name: "Research Department", section_id: "1", icon: "🔬" },
            { id: "2", name: "Analysis Lab", section_id: "1", icon: "🧪" },
            { id: "3", name: "Engineering Division", section_id: "1", icon: "⚙️" },
          ];
          const lastResortSections = [{ id: "1", name: "General" }];
          setDeptSections(lastResortSections);
          setDepartments(lastResortDepartments);
        }

        // Keep services empty if API fails
        setServices([]);
        setServiceCenters([]);
      }
    };
    loadData();
  }, [locale]);

  // Fix empty departments when we have sections but no departments
  useEffect(() => {
    if (deptSections.length > 0 && departments.length === 0) {
      console.log('Fixing empty departments - creating departments for existing sections');
      const generatedDepartments = deptSections.map((section, idx) => ({
        id: String(idx + 1),
        name: `${getTranslation(section.name, locale)} Department`,
        section_id: section.id,
        icon: "🏛️"
      }));
      setDepartments(generatedDepartments);
    }
  }, [deptSections.length, departments.length]);

  const libraryLinks = [
    { href: "/library/overview", label: t('nav.overview') },
    { href: "/library/books", label: t('nav.books') },
    { href: "/library/projects", label: t('nav.projects') },
    { href: "/library/publication", label: t('nav.publication') },
    { href: "/library/citation", label: t('nav.citation.title') },
    { href: "/library/library", label: t('nav.library') },
  ];

  const librarySubLinks = [
    { href: "/library/journal", label: t('nav.journal') },
    { href: "/library/theses-phd", label: t('nav.thesesPhd') },
    { href: "/library/theses-msc", label: t('nav.thesesMsc') },
    { href: "/library/annual-report", label: t('nav.annualReport') },
    { href: "/library/epri-book-edition", label: t('nav.epriBookEdition') },
  ];

  const moreLinks = [
    { href: "/products", label: t('nav.products') },
    { href: "/equipments", label: "Scientific Equipment" },
    { href: "/contact", label: t('nav.contact') },
  ];

  const aboutLinks = [
    { href: "/about/overview", label: t('nav.overview') },
    { href: "/about/top-management", label: t('nav.topManagement') },
    { href: "/about/iso-certificate", label: t('nav.isoCertificate') },
    { href: "/about/awards", label: t('nav.awards') },
    { href: "/about/clients-partners", label: t('nav.clientsPartners') },
    { href: "/about/schools", label: t('nav.schools') },
    { href: "/about/protocols-agreements", label: t('nav.protocolsAgreements') },
  ];

  const runLinks = [
    { href: "/run/patent", label: t('nav.patent') },
    { href: "/run/citations", label: t('nav.citations') },
  ];

  const newsLinks = [
    { href: "/news", label: t('nav.news') },
    { href: "/events", label: t('nav.events') },
    { href: "/news/electronical-magazine", label: t('nav.electronicalMagazine') },
  ];

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.02 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <div className="px-4 mx-auto  sm:px-4">
        <div className="flex h-20 sm:h-24 md:h-28 items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="EPRI Logo"
              width={160}
              height={64}
              className="h-8 sm:h-12 md:h-14 lg:h-16 xl:h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center flex-1 min-w-0">
            {/* Primary Navigation Links */}
            <div className="flex items-center gap-1 flex-wrap">

              {/* About Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative px-1 py-1 text-[12px] font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 hover:scale-105 ${isActiveLink(`${locale === "ar" ? "/ar" : ""}/about`)
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                  >
                    <span className="relative z-10">{t('nav.about')}</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div
                      className={`absolute inset-0 rounded-lg transition-all duration-200 ${isActiveLink('/about')
                        ? "bg-primary/15 opacity-100"
                        : "bg-primary/10 opacity-0 group-hover:opacity-100 group-hover:shadow-md"
                        }`}
                    ></div>
                    {isActiveLink('/about') && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {aboutLinks.map((link) => {
                    const isActive = isActiveLink(link.href);
                    return (
                      <DropdownMenuItem key={link.href} asChild className="hover:bg-primary/10 transition-colors">
                        <Link
                          href={link.href}
                          className={`w-full hover:text-primary transition-colors relative ${isActive ? 'text-primary font-semibold bg-primary/10 border-l-2 border-primary pl-3' : 'pl-4'
                            }`}
                        >
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Departments Simple Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative px-1 py-1 text-[12px] font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 hover:scale-105 ${isActiveLink('/departments') || isActiveLink('/laboratories')
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                  >
                    <span className="relative z-10">{t('nav.departments')}</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div
                      className={`absolute inset-0 rounded-lg transition-all duration-200 ${isActiveLink('/departments') || isActiveLink('/laboratories')
                        ? "bg-primary/15 opacity-100"
                        : "bg-primary/10 opacity-0 group-hover:opacity-100 group-hover:shadow-md"
                        }`}
                    ></div>
                    {(isActiveLink('/departments') || isActiveLink('/laboratories')) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 max-h-[500px] overflow-y-auto"
                  align="end"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/departments" className="w-full">
                      All Departments
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <DropdownMenuItem key={dept.id} asChild>
                        <Link
                          href={`/departments/${dept.id}`}
                          className="w-full"
                        >
                          {dept.icon && <span className="mr-2">{dept.icon}</span>}
                          {typeof dept.name === 'string' ? dept.name : getTranslation(dept.name, locale)}
                        </Link>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      <span className="text-muted-foreground">Loading departments...</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Service Centers & Units Simple Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative px-1 py-1 text-[12px] font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 hover:scale-105 ${isActiveLink('/service-centers')
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                  >
                    <span className="relative z-10 leading-tight">
                      <span className="block">{t('nav.serviceCenters')}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div
                      className={`absolute inset-0 rounded-lg transition-all duration-200 ${isActiveLink('/service-centers')
                        ? "bg-primary/15 opacity-100"
                        : "bg-primary/10 opacity-0 group-hover:opacity-100 group-hover:shadow-md"
                        }`}
                    ></div>
                    {isActiveLink('/service-centers') && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 max-h-[500px] overflow-y-auto"
                  align="end"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/service-centers" className="w-full">
                      All Centers & Units
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {serviceCenters.length > 0 ? (
                    <>
                      {serviceCenters
                        .filter(c => (c.type || 'center') === 'center')
                        .map((center) => (
                          <DropdownMenuItem key={center.id} asChild>
                            <Link
                              href={`/service-centers/${center.slug}`}
                              className="w-full"
                            >
                              {typeof center.name === 'string' ? center.name : getTranslation(center.name, locale)}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      {serviceCenters.filter(c => c.type === 'unit').length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                            Units
                          </div>
                          {serviceCenters
                            .filter(c => c.type === 'unit')
                            .map((unit) => (
                              <DropdownMenuItem key={unit.id} asChild>
                                <Link
                                  href={`/service-centers/${unit.slug}`}
                                  className="w-full"
                                >
                                  {typeof unit.name === 'string' ? unit.name : getTranslation(unit.name, locale)}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                        </>
                      )}
                    </>
                  ) : (
                    <DropdownMenuItem disabled>
                      <span className="text-muted-foreground">Loading centers...</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* News & Events Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative px-1 py-1 text-[12px] font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 hover:scale-105 ${isActiveLink('/news') || isActiveLink('/events')
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                  >
                    <span className="relative z-10 leading-tight">
                      <span className="block">{t('nav.newsEvents')}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div
                      className={`absolute inset-0 rounded-lg transition-all duration-200 ${isActiveLink('/news') || isActiveLink('/events')
                        ? "bg-primary/15 opacity-100"
                        : "bg-primary/10 opacity-0 group-hover:opacity-100 group-hover:shadow-md"
                        }`}
                    ></div>
                    {(isActiveLink('/news') || isActiveLink('/events')) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {newsLinks.map((link) => {
                    const isActive = isActiveLink(link.href);
                    return (
                      <DropdownMenuItem key={link.href} asChild className="hover:bg-primary/10 transition-colors">
                        <Link
                          href={link.href}
                          className={`w-full hover:text-primary transition-colors relative ${isActive ? 'text-primary font-semibold bg-primary/10 border-l-2 border-primary pl-3' : 'pl-4'
                            }`}
                        >
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Training Center - Direct Link */}
              <Link
                href="/training-center"
                className={`relative px-2 py-1 text-[12px] font-medium transition-all duration-200 rounded-lg hover:scale-105 ${isActiveLink('/training-center')
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/5 hover:shadow-md"
                  }`}
              >
                {t('nav.trainingCenter')}
                {isActiveLink('/training-center') && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                )}
              </Link>

              {/* Library & Scientific Situation Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative px-1 py-1 text-[12px] font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 hover:scale-105 ${libraryLinks.some(link => isActiveLink(link.href)) || librarySubLinks.some(link => isActiveLink(link.href))
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                  >
                    <span className="relative z-10 leading-tight">
                      {t('nav.library')}
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div
                      className={`absolute inset-0 rounded-lg transition-all duration-200 ${libraryLinks.some(link => isActiveLink(link.href)) || librarySubLinks.some(link => isActiveLink(link.href))
                        ? "bg-primary/15 opacity-100"
                        : "bg-primary/10 opacity-0 group-hover:opacity-100 group-hover:shadow-md"
                        }`}
                    ></div>
                    {(libraryLinks.some(link => isActiveLink(link.href)) || librarySubLinks.some(link => isActiveLink(link.href))) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {libraryLinks.map((link) => {
                    const isActive = isActiveLink(link.href);
                    return (
                      <DropdownMenuItem key={link.href} asChild className="hover:bg-primary/10 transition-colors">
                        <Link
                          href={link.href}
                          className={`w-full hover:text-primary transition-colors relative ${isActive ? 'text-primary font-semibold bg-primary/10 border-l-2 border-primary pl-3' : 'pl-4'
                            }`}
                        >
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Library Sub-sections
                  </div>
                  {librarySubLinks.map((link) => {
                    const isActive = isActiveLink(link.href);
                    return (
                      <DropdownMenuItem key={link.href} asChild className="hover:bg-primary/10 transition-colors">
                        <Link
                          href={link.href}
                          className={`w-full hover:text-primary transition-colors relative ${isActive ? 'text-primary font-semibold bg-primary/10 border-l-2 border-primary pl-6' : 'pl-8'
                            }`}
                        >
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Innovation and Entrepreneurship - Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative px-1 py-1 text-[12px] font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 hover:scale-105 ${isActiveLink('/innovation-and-entrepreneurship')
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                  >
                    <span className="relative z-10 leading-tight">
                      <span className="block">{t('nav.innovation.title').split(' ').slice(0, 2).join(' ')}</span>
                      <span className="block">{t('nav.innovation.title').split(' ').slice(2).join(' ')}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div
                      className={`absolute inset-0 rounded-lg transition-all duration-200 ${isActiveLink('/innovation-and-entrepreneurship')
                        ? "bg-primary/15 opacity-100"
                        : "bg-primary/10 opacity-0 group-hover:opacity-100 group-hover:shadow-md"
                        }`}
                    ></div>
                    {isActiveLink('/innovation-and-entrepreneurship') && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-72 max-h-[500px] overflow-y-auto"
                  align="end"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/innovation-and-entrepreneurship" className="w-full">
                      {t('nav.innovation.overview')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/innovation-and-entrepreneurship/technology-transfer-tto" className="w-full">
                      {t('nav.innovation.technologyTransferTTO')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/innovation-and-entrepreneurship/grant-international-cooperation-gico" className="w-full">
                      {t('nav.innovation.grantInternationalCooperationGICO')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/innovation-and-entrepreneurship/technology-innovation-support-tisc" className="w-full">
                      {t('nav.innovation.technologyInnovationSupportTISC')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/innovation-and-entrepreneurship/ip-management" className="w-full">
                      {t('nav.innovation.ipManagement')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/innovation-and-entrepreneurship/e-club" className="w-full">
                      {t('nav.innovation.eClub')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/innovation-and-entrepreneurship/incubators-startups" className="w-full">
                      {t('nav.innovation.incubatorsStartups')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/innovation-and-entrepreneurship/patent" className="w-full">
                      {t('nav.innovation.patent')}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* EJP Journal - Direct Link */}
              <Link
                href="/ejp-journal"
                className={`relative px-2 py-1 text-[12px] font-medium transition-all duration-200 rounded-lg hover:scale-105 ${isActiveLink('/ejp-journal')
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/5 hover:shadow-md"
                  }`}
              >
                <span className="block">{t('nav.ejpJournal')}</span>
                {isActiveLink('/ejp-journal') && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                )}
              </Link>

              {/* More Dropdown - Last menu item */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative px-2 py-1 text-[12px] font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 hover:scale-105 ${moreLinks.some(link => isActiveLink(link.href))
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                  >
                    <span className="relative z-10">{t('nav.more')}</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div
                      className={`absolute inset-0 rounded-lg transition-all duration-200 ${moreLinks.some(link => isActiveLink(link.href))
                        ? "bg-primary/15 opacity-100"
                        : "bg-primary/10 opacity-0 group-hover:opacity-100 group-hover:shadow-md"
                        }`}
                    ></div>
                    {moreLinks.some(link => isActiveLink(link.href)) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {moreLinks.map((link) => {
                    const isActive = isActiveLink(link.href);
                    return (
                      <DropdownMenuItem key={link.href} asChild className="hover:bg-primary/10 transition-colors">
                        <Link
                          href={link.href}
                          className={`w-full hover:text-primary transition-colors relative ${isActive ? 'text-primary font-semibold bg-primary/10 border-l-2 border-primary pl-3' : 'pl-4'
                            }`}
                        >
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-2 xl:gap-4 ml-2 xl:ml-4 flex-shrink-0">
            <LanguageSwitcher />
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:bg-primary/5 px-2 xl:px-4 py-1 rounded-lg transition-all duration-200 group text-sm">
                    <User className="h-4 w-4 mr-1 xl:mr-2" />
                    <span className="hidden xl:inline">{t('nav.myAccount')}</span>
                    <span className="xl:hidden">{t('nav.account')}</span>
                    <ChevronDown className="h-3 w-3 ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">{t('nav.dashboard')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/my-courses">{t('nav.myCourses')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/wishlist">{t('nav.myWishlist')}</Link>
                  </DropdownMenuItem>
                  {user?.role === 'ADMIN' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="h-4 w-4 mr-2" />
                          {t('nav.adminDashboard')}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-accent">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('common.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="hover:bg-primary/5 px-2 xl:px-4 py-1 rounded-lg transition-all duration-200 text-[12px]">
                  <Link href="/login">{t('common.login')}</Link>
                </Button>
                {/* <Button asChild className="bg-primary hover:bg-primary/90 px-3 xl:px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm">
                  <Link href="/register">{t('nav.getStarted')}</Link>
                </Button> */}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex-shrink-0 p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 sm:py-6 border-t border-border/50 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-1">

              {/* About Section */}
              <div className={`py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider `}>
                {t('nav.about')}
              </div>
              {aboutLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                      ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}


              {/* News & Events Section */}
              <div className="py-1 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('nav.newsEvents')}
              </div>
              {newsLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                      ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Training Center - Mobile */}
              <Link
                href="/training-center"
                className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${isActiveLink('/training-center')
                  ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.trainingCenter')}
              </Link>

              {/* EJP Journal - Mobile */}
              <Link
                href="/ejp-journal"
                className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${isActiveLink('/ejp-journal')
                  ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.ejpJournal')}
              </Link>

              {/* Innovation and Entrepreneurship - Mobile */}
              <div className="py-2">
                <div className="px-8 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {t('nav.innovation.title')}
                </div>
                <Link
                  href="/innovation-and-entrepreneurship"
                  className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg block ${isActiveLink('/innovation-and-entrepreneurship')
                    ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.innovation.overview')}
                </Link>
                <Link
                  href="/innovation-and-entrepreneurship/technology-transfer-tto"
                  className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg block ${isActiveLink('/innovation-and-entrepreneurship/technology-transfer-tto')
                    ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.innovation.technologyTransferTTO')}
                </Link>
                <Link
                  href="/innovation-and-entrepreneurship/grant-international-cooperation-gico"
                  className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg block ${isActiveLink('/innovation-and-entrepreneurship/grant-international-cooperation-gico')
                    ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.innovation.grantInternationalCooperationGICO')}
                </Link>
                <Link
                  href="/innovation-and-entrepreneurship/technology-innovation-support-tisc"
                  className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg block ${isActiveLink('/innovation-and-entrepreneurship/technology-innovation-support-tisc')
                    ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.innovation.technologyInnovationSupportTISC')}
                </Link>
                <Link
                  href="/innovation-and-entrepreneurship/ip-management"
                  className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg block ${isActiveLink('/innovation-and-entrepreneurship/ip-management')
                    ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.innovation.ipManagement')}
                </Link>
                <Link
                  href="/innovation-and-entrepreneurship/e-club"
                  className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg block ${isActiveLink('/innovation-and-entrepreneurship/e-club')
                    ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.innovation.eClub')}
                </Link>
                <Link
                  href="/innovation-and-entrepreneurship/incubators-startups"
                  className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg block ${isActiveLink('/innovation-and-entrepreneurship/incubators-startups')
                    ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.innovation.incubatorsStartups')}
                </Link>
                <Link
                  href="/innovation-and-entrepreneurship/patent"
                  className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg block ${isActiveLink('/innovation-and-entrepreneurship/patent')
                    ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.innovation.patent')}
                </Link>
              </div>

              {/* Library & Scientific Situation Section */}
              <div className="py-1 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('nav.library')}
              </div>
              {libraryLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                      ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pl-12 py-1 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Library Sub-sections
              </div>
              {librarySubLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-2 px-12 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                      ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* More Section */}
              <div className="py-1 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                More
              </div>
              {moreLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                      ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile Departments Section */}
              <div className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Departments
              </div>
              {deptSections.length > 0 ? (
                deptSections.map((section) => {
                  const sectionDepartments = departments.filter(dept => dept.section_id === section.id);
                  const isExpanded = expandedMobileSection === section.id;

                  return (
                    <div key={section.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/departments?sectionId=${section.id}`}
                          className={`flex-1 block py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${isActiveLink('/departments')
                            ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                            : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {typeof section.name === 'string' ? section.name : getTranslation(section.name, locale)}
                        </Link>
                        {sectionDepartments.length > 0 && (
                          <button
                            onClick={() => setExpandedMobileSection(isExpanded ? null : section.id)}
                            className="px-2 py-1 text-muted-foreground hover:text-primary transition-colors"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </button>
                        )}
                      </div>
                      {isExpanded && sectionDepartments.length > 0 && (
                        <div className="pl-8 space-y-2">
                          {sectionDepartments.map((dept) => (
                            <div key={dept.id} className="space-y-1">
                              <Link
                                href={`/departments?sectionId=${section.id}&departmentId=${dept.id}`}
                                className={`block py-1.5 px-4 text-xs font-medium transition-colors ${isActiveLink(`/departments?sectionId=${section.id}&departmentId=${dept.id}`)
                                  ? "text-primary font-semibold"
                                  : "text-foreground hover:text-primary"
                                  }`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {dept.icon && <span className="mr-2">{dept.icon}</span>}
                                {typeof dept.name === 'string' ? dept.name : getTranslation(dept.name, locale)}
                              </Link>
                              <div className="pl-6 space-y-1">
                                <Link
                                  href={`/departments?sectionId=${section.id}&departmentId=${dept.id}&tab=research-areas`}
                                  className={`block py-1 px-4 text-xs transition-colors ${isActiveLink(`/departments?sectionId=${section.id}&departmentId=${dept.id}&tab=research-areas`)
                                    ? "text-primary font-semibold"
                                    : "text-muted-foreground hover:text-primary"
                                    }`}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  Research Areas
                                </Link>
                                <Link
                                  href={`/departments?sectionId=${section.id}&departmentId=${dept.id}&tab=projects`}
                                  className={`block py-1 px-4 text-xs transition-colors ${isActiveLink(`/departments?sectionId=${section.id}&departmentId=${dept.id}&tab=projects`)
                                    ? "text-primary font-semibold"
                                    : "text-muted-foreground hover:text-primary"
                                    }`}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  Projects
                                </Link>
                                <Link
                                  href={`/departments?sectionId=${section.id}&departmentId=${dept.id}&tab=laboratories`}
                                  className={`block py-1 px-4 text-xs transition-colors ${isActiveLink(`/departments?sectionId=${section.id}&departmentId=${dept.id}&tab=laboratories`)
                                    ? "text-primary font-semibold"
                                    : "text-muted-foreground hover:text-primary"
                                    }`}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  Laboratories
                                </Link>
                                <Link
                                  href={`/departments?sectionId=${section.id}&departmentId=${dept.id}&tab=staff`}
                                  className={`block py-1 px-4 text-xs transition-colors ${isActiveLink(`/departments?sectionId=${section.id}&departmentId=${dept.id}&tab=staff`)
                                    ? "text-primary font-semibold"
                                    : "text-muted-foreground hover:text-primary"
                                    }`}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  Staff
                                </Link>
                              </div>
                            </div>
                          ))}
                          <div className="pt-2">
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="w-full text-xs"
                            >
                              <Link
                                href={`/departments?sectionId=${section.id}`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                See All Departments
                              </Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <Link
                  href="/departments"
                  className={`py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${isActiveLink('/departments') || isActiveLink('/laboratories')
                    ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Departments
                </Link>
              )}

              {/* Mobile Centers & Units Section */}
              <div className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Centers & Units
              </div>

              {/* Centers */}
              <div className="mb-2">
                <div className="py-2 px-4 text-xs font-semibold text-muted-foreground">
                  Centers
                </div>
                {serviceCenters
                  .filter(c => (c.type || 'center') === 'center')
                  .slice(0, 4)
                  .map((center) => (
                    <div key={center.id} className="space-y-1">
                      <Link
                        href={`/service-centers/${center.slug}`}
                        className={`block py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${isActiveLink(`/service-centers/${center.slug}`)
                          ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                          : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                          }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {typeof center.name === 'string' ? center.name : getTranslation(center.name, locale)}
                      </Link>
                      <div className="pl-12 space-y-1">
                        <Link
                          href={`/service-centers/${center.slug}#overview`}
                          className={`block py-1 px-4 text-xs transition-colors ${pathname.includes(`/service-centers/${center.slug}`) && (currentHash === '#overview' || (!currentHash && pathname === `/service-centers/${center.slug}`))
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Overview
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#lab-methodology`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#lab-methodology'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Lab Methodology & Services
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#events`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#events'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Events
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#training`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#training'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Training & E-Learning
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#products`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#products'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Products
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#equipment`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#equipment'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Equipment List
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#staff`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#staff'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Staff
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#work-volume`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#work-volume'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Work Volume & Company Activity
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#future-prospects`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#future-prospects'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Future Prospects
                        </Link>
                      </div>
                    </div>
                  ))}
                {serviceCenters.filter(c => (c.type || 'center') === 'center').length > 4 && (
                  <div className="mt-2 px-8">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/service-centers?type=center">
                        See All Centers
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Units */}
              <div>
                <div className="py-2 px-4 text-xs font-semibold text-muted-foreground">
                  Units
                </div>
                {serviceCenters
                  .filter(c => c.type === 'unit')
                  .slice(0, 4)
                  .map((unit) => (
                    <div key={unit.id} className="space-y-1">
                      <Link
                        href={`/service-centers/${unit.slug}`}
                        className={`block py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${isActiveLink(`/service-centers/${unit.slug}`)
                          ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                          : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                          }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {typeof unit.name === 'string' ? unit.name : getTranslation(unit.name, locale)}
                      </Link>
                      <div className="pl-12 space-y-1">
                        <Link
                          href={`/service-centers/${unit.slug}#overview`}
                          className={`block py-1 px-4 text-xs transition-colors ${pathname.includes(`/service-centers/${unit.slug}`) && (currentHash === '#overview' || (!currentHash && pathname === `/service-centers/${unit.slug}`))
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Overview
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#lab-methodology`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#lab-methodology'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Lab Methodology & Services
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#events`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#events'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Events
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#training`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#training'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Training & E-Learning
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#products`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#products'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Products
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#equipment`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#equipment'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Equipment List
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#staff`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#staff'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Staff
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#work-volume`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#work-volume'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Work Volume & Company Activity
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#future-prospects`}
                          className={`block py-1 px-4 text-xs transition-colors ${currentHash === '#future-prospects'
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                            }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Future Prospects
                        </Link>
                      </div>
                    </div>
                  ))}
                {serviceCenters.filter(c => c.type === 'unit').length > 4 && (
                  <div className="mt-2 px-8">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/service-centers?type=unit">
                        See All Units
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Services Link */}
              <Link
                href="/services"
                className={`py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${isActiveLink('/services')
                  ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>

              {/* News Section */}
              <div className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                News
              </div>
              {newsLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                      ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Run Section */}
              <div className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Run
              </div>
              {runLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                      ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-border/50">
                {isLoggedIn ? (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/dashboard/my-courses">My Courses</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/dashboard/wishlist">My Wishlist</Link>
                    </Button>
                    {user?.role === 'ADMIN' && (
                      <Button variant="ghost" asChild className="text-primary">
                        <Link href="/admin">
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={logout}
                      className="bg-transparent text-accent"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
