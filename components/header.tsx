/** @format */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, User, LogOut, Shield, ChevronDown, ChevronRight, Building2, MapPin, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/lib/api";
import { MobileMenuDrilldown } from "@/components/mobile-menu-drilldown";
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null); // Current submenu view
  const [menuStack, setMenuStack] = useState<string[]>([]); // Navigation breadcrumb
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [deptSections, setDeptSections] = useState<Array<{ id: string; name: string | TranslationObject }>>([]);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string | TranslationObject; section_id: string; icon?: string; laboratories?: any[] }>>([]);
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
          // Fetch laboratories for each department
          const departmentsWithLabs = await Promise.all(
            deptRes.departments.map(async (d: any) => {
              try {
                const labsRes = await apiClient.getLaboratories({ departmentId: d.id });
                return {
                  id: d.id,
                  name: getTranslation(d.name, locale),
                  section_id: d.section_id,
                  icon: d.icon,
                  laboratories: labsRes.laboratories || []
                };
              } catch (error) {
                console.error(`Error loading laboratories for department ${d.id}:`, error);
                return {
                  id: d.id,
                  name: getTranslation(d.name, locale),
                  section_id: d.section_id,
                  icon: d.icon,
                  laboratories: []
                };
              }
            })
          );
          setDepartments(departmentsWithLabs);
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
    setActiveMenu(null);
    setMenuStack([]);
  }, [pathname]);

  // Mobile menu navigation functions
  const goToSubmenu = (menuName: string) => {
    setMenuStack([...menuStack, activeMenu].filter(Boolean) as string[]);
    setActiveMenu(menuName);
  };

  const goBack = () => {
    const newStack = [...menuStack];
    const previousMenu = newStack.pop();
    setMenuStack(newStack);
    setActiveMenu(previousMenu || null);
  };

  const resetMobileMenu = () => {
    setActiveMenu(null);
    setMenuStack([]);
    setMobileMenuOpen(false);
  };


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

              {/* Departments Mega Menu with Nested Dropdowns */}
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
                  className="w-72 max-h-[600px] overflow-y-auto"
                  align="start"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/departments" className="font-semibold">
                      All Departments
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <DropdownMenuSub key={dept.id}>
                        <DropdownMenuSubTrigger className="cursor-pointer">
                          {dept.icon && <span className="mr-2">{dept.icon}</span>}
                          <span>{typeof dept.name === 'string' ? dept.name : getTranslation(dept.name, locale)}</span>
                        </DropdownMenuSubTrigger>

                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="w-64" sideOffset={8}>
                            <DropdownMenuItem asChild>
                              <Link href={`/departments/${dept.id}`} className="font-medium">
                                📋 Department Overview
                              </Link>
                            </DropdownMenuItem>

                            {dept.laboratories && dept.laboratories.length > 0 && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs">
                                  🔬 Laboratories
                                </DropdownMenuLabel>
                                {dept.laboratories.slice(0, 5).map((lab: any) => (
                                  <DropdownMenuItem key={lab.id} asChild>
                                    <Link href={`/laboratories/${lab.id}`}>
                                      {typeof lab.name === 'string' ? lab.name : getTranslation(lab.name, locale)}
                                    </Link>
                                  </DropdownMenuItem>
                                ))}
                                {dept.laboratories.length > 5 && (
                                  <DropdownMenuItem asChild>
                                    <Link href={`/departments/${dept.id}?tab=laboratories`} className="text-primary">
                                      View All Labs ({dept.laboratories.length}) →
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
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

          <div className="hidden lg:flex items-center gap-2 xl:gap-4 ml-2 xl:ml-4 shrink-0">
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
                  {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
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
            className="lg:hidden shrink-0 p-2 -mr-2"
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
            <MobileMenuDrilldown
              activeMenu={activeMenu}
              goToSubmenu={goToSubmenu}
              goBack={goBack}
              resetMobileMenu={resetMobileMenu}
              isActiveLink={isActiveLink}
              aboutLinks={aboutLinks}
              newsLinks={newsLinks}
              libraryLinks={libraryLinks}
              departments={departments}
              serviceCenters={serviceCenters}
            />
          </div>
        )}
      </div>
    </header>
  );
}

