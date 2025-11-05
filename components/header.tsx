/** @format */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { departments } from "@/lib/data";
import { apiClient } from "@/lib/api";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchConference, selectShouldFetchConference, clearConference, type ConferenceState } from "@/store/slices/conferenceSlice";
import { Service } from "@/lib/services";
import type { RootState } from "@/store/store"; 

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [deptSections, setDeptSections] = useState<Array<{ id: string; name: string }>>([]);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string; section_id: string; icon?: string }>>([]);
  const [services, setServices] = useState<Service[]>([]);
  const { isLoggedIn, logout, user } = useUser();
  const pathname = usePathname();
  
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
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
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
        setDeptSections(sectionsRes.sections.map((s: any) => ({ id: s.id, name: s.name })));
        
        // Load departments
        const deptRes = await apiClient.getDepartments();
        console.log('Loaded departments:', deptRes.departments?.length || 0);
        if (deptRes.departments?.length > 0) {
          setDepartments(deptRes.departments.map((d: any) => ({ 
            id: d.id, 
            name: d.name, 
            section_id: d.section_id,
            icon: d.icon 
          })));
        } else {
          // If API returns empty departments, create fallback departments for each section
          console.log('API returned empty departments, creating fallback');
          const fallbackDepartments = sectionsRes.sections.slice(0, 6).map((section: any, idx: number) => ({
            id: String(idx + 1),
            name: `${section.name} Department`,
            section_id: section.id,
            icon: "🏛️"
          }));
          setDepartments(fallbackDepartments);
        }
        
        // Load services
        const servicesRes = await apiClient.getServices();
        setServices(servicesRes.services);
      } catch (e) {
        console.error('Error loading header data:', e);
        
        // Fallback: Load departments from local data
        try {
          // Import the departments from the already imported local data
          if (departments && departments.length > 0) {
            console.log('Using local departments fallback', departments.length);
            
            // Create basic sections from department names
            const uniqueWords = Array.from(new Set(departments.map(d => d.name.split(" ")[0])));
            const fallbackSections = uniqueWords.slice(0, 6).map((word, idx) => ({ 
              id: String(idx + 1), 
              name: word
            }));
            setDeptSections(fallbackSections);
            
            // Map departments with section associations
            setDepartments(departments.map((d, idx) => ({ 
              id: d.id, 
              name: d.name, 
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
      }
    };
    loadData();
  }, []);

  // Fix empty departments when we have sections but no departments
  useEffect(() => {
    if (deptSections.length > 0 && departments.length === 0) {
      console.log('Fixing empty departments - creating departments for existing sections');
      const generatedDepartments = deptSections.map((section, idx) => ({
        id: String(idx + 1),
        name: `${section.name} Department`,
        section_id: section.id,
        icon: "🏛️"
      }));
      setDepartments(generatedDepartments);
    }
  }, [deptSections.length, departments.length]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/services", label: "Services" },
    { href: "/equipments", label: "Equipments" },
    { href: "/projects", label: "Centers & Units" },
    { href: "/events", label: "Events" },
    ...(hasConference ? [{ href: "/conference", label: "Conference" }] : []),
    { href: "/contact", label: "Contact" },
  ];

  const aboutLinks = [
    { href: "/about/overview", label: "Overview" },
    { href: "/top-management", label: "Leadership" },
    { href: "/about/iso-certificate", label: "ISO Certificate" },
  ];

  const runLinks = [
    { href: "/run/patent", label: "Patent" },
    { href: "/run/citations", label: "Citations" },
  ];

  const newsLinks = [
    { href: "/news", label: "News" },
    { href: "/news/electronical-magazine", label: "Electronical Magazine" },
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
      className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="EPRI Logo"
              width={120}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            {/* Primary Navigation Links */}
            <div className="flex items-center gap-1">
              {/* Home Link */}
              {(() => {
                const homeLink = navLinks.find(l => l.href === "/");
                if (!homeLink) return null;
                const isActive = isActiveLink(homeLink.href);
                return (
                  <Link
                    key={homeLink.href}
                    href={homeLink.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group ${
                      isActive
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="relative z-10">{homeLink.label}</span>
                    <div 
                      className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                        isActive 
                          ? "bg-primary/15 opacity-100" 
                          : "bg-primary/10 opacity-0 group-hover:opacity-100"
                      }`}
                    ></div>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </Link>
                );
              })()}

              {/* About Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 ${
                      isActiveLink('/about')
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="relative z-10">About</span>
                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div 
                      className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                        isActiveLink('/about')
                          ? "bg-primary/15 opacity-100" 
                          : "bg-primary/10 opacity-0 group-hover:opacity-100"
                      }`}
                    ></div>
                    {isActiveLink('/about') && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {aboutLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="w-full">
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Other Navigation Links (excluding Home and Services) */}
              {navLinks
                .filter((l) => l.label !== "Services" && l.href !== "/")
                .map((link) => {
                  const isActive = isActiveLink(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group ${
                        isActive
                          ? "text-primary bg-primary/10 font-semibold"
                          : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      <span className="relative z-10">{link.label}</span>
                      <div 
                        className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                          isActive 
                            ? "bg-primary/15 opacity-100" 
                            : "bg-primary/10 opacity-0 group-hover:opacity-100"
                        }`}
                      ></div>
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                      )}
                    </Link>
                  );
                })}

              {/* News Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 ${
                      isActiveLink('/news')
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="relative z-10">News</span>
                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div 
                      className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                        isActiveLink('/news')
                          ? "bg-primary/15 opacity-100" 
                          : "bg-primary/10 opacity-0 group-hover:opacity-100"
                      }`}
                    ></div>
                    {isActiveLink('/news') && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {newsLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="w-full">
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Run Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 ${
                      isActiveLink('/run')
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="relative z-10">Run</span>
                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div 
                      className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                        isActiveLink('/run')
                          ? "bg-primary/15 opacity-100" 
                          : "bg-primary/10 opacity-0 group-hover:opacity-100"
                      }`}
                    ></div>
                    {isActiveLink('/run') && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {runLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="w-full">
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>


            </div>

            {/* Mega Menu Navigation */}
            <div className="flex items-center gap-1">
              {/* Departments Mega Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 ${
                      isActiveLink('/departments') || isActiveLink('/laboratories')
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="relative z-10">Departments</span>
                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div 
                      className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                        isActiveLink('/departments') || isActiveLink('/laboratories')
                          ? "bg-primary/15 opacity-100" 
                          : "bg-primary/10 opacity-0 group-hover:opacity-100"
                      }`}
                    ></div>
                    {(isActiveLink('/departments') || isActiveLink('/laboratories')) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[900px] max-h-[85vh] overflow-y-auto p-0 rounded-2xl border border-primary/20 ring-1 ring-primary/10 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl shadow-2xl"
                align="end"
              >
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <div className="p-6 border-b border-primary/10">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Research Departments</h3>
                    <p className="text-sm text-muted-foreground">Explore our specialized research divisions and laboratories</p>
                  </div>
                  <div className="p-6">
                    {deptSections.length > 0 && departments.length > 0 ? (
                      <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-8"
                      >
                        {deptSections.map((section) => {
                          const sectionDepartments = departments.filter(dept => dept.section_id === section.id);
                          
                          if (sectionDepartments.length === 0) return null;
                          
                          return (
                            <motion.div key={section.id} variants={item} className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider border-b border-primary/20 pb-1">
                                  {section.name}
                                </h4>
                                <Link 
                                  href={`/departments?sectionId=${section.id}`}
                                  className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                  View all ›
                                </Link>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {sectionDepartments.slice(0, 6).map((dept) => (
                                  <Link
                                    key={dept.id}
                                    href={`/departments/${dept.id}`}
                                    className="group flex items-center gap-3 p-2.5 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 hover:shadow-sm"
                                  >
                                    <div className="flex-shrink-0 text-xl group-hover:scale-110 transition-transform duration-200">
                                      {dept.icon || "🏛️"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate leading-tight">
                                        {dept.name}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                              {sectionDepartments.length > 6 && (
                                <Link 
                                  href={`/departments?sectionId=${section.id}`}
                                  className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors font-medium mt-2 px-2 py-1 rounded-md hover:bg-primary/5"
                                >
                                  +{sectionDepartments.length - 6} more departments ›
                                </Link>
                              )}
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    ) : departments.length > 0 ? (
                      <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                      >
                        <div className="space-y-3 mb-4">
                          <h4 className="text-sm font-semibold text-foreground/90 uppercase tracking-wide">
                            All Departments
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {departments.slice(0, 9).map((dept) => (
                              <Link
                                key={dept.id}
                                href={`/departments/${dept.id}`}
                                className="group flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all"
                              >
                                <div className="flex-shrink-0 text-lg">
                                  {dept.icon || "🏛️"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                    {dept.name}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                          {departments.length > 9 && (
                            <Link 
                              href="/departments"
                              className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
                            >
                              +{departments.length - 9} more departments ›
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">Loading departments...</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 border-t border-primary/10 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {departments.length} departments across {deptSections.length} sections
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Discover our research capabilities and laboratory facilities
                      </p>
                    </div>
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90 px-4 py-2">
                      <Link href="/departments">View All Departments</Link>
                    </Button>
                  </div>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>

              {/* Services Mega Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 ${
                      isActiveLink('/services')
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="relative z-10">Services</span>
                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div 
                      className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                        isActiveLink('/services')
                          ? "bg-primary/15 opacity-100" 
                          : "bg-primary/10 opacity-0 group-hover:opacity-100"
                      }`}
                    ></div>
                    {isActiveLink('/services') && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[980px] max-h-[85vh] overflow-y-auto p-0 rounded-2xl border border-primary/20 ring-1 ring-primary/10 bg-background/95 backdrop-blur-xl shadow-2xl"
                align="end"
              >
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <div className="p-6 border-b border-primary/10">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Our Services</h3>
                    <p className="text-sm text-muted-foreground">Browse our comprehensive laboratory and consulting services</p>
                  </div>
                  <div className="p-6">
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-2 md:grid-cols-3 gap-6"
                    >
                      {services.slice(0, 6).map((svc) => (
                        <motion.div
                          key={svc.id}
                          variants={item}
                          className="flex flex-col space-y-4 rounded-xl p-5 bg-white transition-all duration-200 border border-gray-200 shadow-md shadow-black/5 hover:border-primary/20 group hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <Link
                              href={`/services/${svc.id}`}
                              className="font-semibold text-foreground hover:text-primary line-clamp-2 group-hover:text-primary transition-colors flex-1 text-base"
                            >
                              {svc.title}
                            </Link>
                          </div>
                          <div className="flex flex-col text-sm text-muted-foreground space-y-1 flex-1">
                            <Link
                              href={`/services/${svc.id}`}
                              className="py-2 px-2 rounded-md hover:text-foreground hover:bg-primary/5 transition-colors text-xs"
                            >
                              Overview
                            </Link>
                            <Link
                              href={`/services/${svc.id}`}
                              className="py-2 px-2 rounded-md hover:text-foreground hover:bg-primary/5 transition-colors text-xs"
                            >
                              Features
                            </Link>
                            <Link
                              href={`/services/${svc.id}`}
                              className="py-2 px-2 rounded-md hover:text-foreground hover:bg-primary/5 transition-colors text-xs"
                            >
                              Equipment & Technology
                            </Link>
                          {(() => {
                            const sortedTabs = svc.tabs?.sort((a, b) => a.order_index - b.order_index) || [];
                            const visibleTabs = sortedTabs.slice(0, 2);
                            const remainingCount = Math.max(0, sortedTabs.length - 2);
                            
                            return (
                              <>
                                {visibleTabs.map((tab) => (
                                    <Link
                                      key={tab.id}
                                      href={`/services/${svc.id}#tab-${tab.id}`}
                                      className="py-2 px-2 rounded-md hover:text-foreground hover:bg-primary/5 transition-colors text-xs truncate"
                                    >
                                      {tab.title}
                                    </Link>
                                ))}
                              </>
                            );
                          })()}
                            <div className="h-px bg-border/30 mb-3 mt-auto"></div>
                            <Link
                              href={`/contact`}
                              className="py-2 px-3 rounded-lg text-primary hover:text-primary/80 hover:bg-primary/10 bg-primary/5 transition-colors text-xs font-medium text-center block"
                            >
                              Request Quote
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 border-t border-primary/10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Showing {Math.min(services.length, 6)} of {services.length} services
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Professional laboratory and consulting services
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button asChild size="sm" variant="outline" className="px-4 py-2">
                        <Link href="/contact">Get Quote</Link>
                      </Button>
                      <Button asChild size="sm" className="bg-primary hover:bg-primary/90 px-4 py-2">
                        <Link href="/services">View All Services</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-4 ml-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:bg-primary/5 px-4 py-2 rounded-lg transition-all duration-200 group">
                    <User className="h-4 w-4 mr-2" />
                    My Account
                    <ChevronDown className="h-3 w-3 ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/my-courses">My Courses</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/wishlist">My Wishlist</Link>
                  </DropdownMenuItem>
                  {user?.role === 'ADMIN' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-accent">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="hover:bg-primary/5 px-4 py-2 rounded-lg transition-all duration-200">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
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
          <div className="lg:hidden py-6 border-t border-border/50">
            <nav className="flex flex-col space-y-1">
              {/* Home Link */}
              {(() => {
                const homeLink = navLinks.find(l => l.href === "/");
                if (!homeLink) return null;
                const isActive = isActiveLink(homeLink.href);
                return (
                  <Link
                    key={homeLink.href}
                    href={homeLink.href}
                    className={`py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${
                      isActive
                        ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {homeLink.label}
                  </Link>
                );
              })()}

              {/* About Section */}
              <div className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                About
              </div>
              {aboutLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${
                      isActive
                        ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Other Navigation Links */}
              {navLinks
                .filter((l) => l.href !== "/" && l.label !== "Services" && l.label !== "Contact")
                .map((link) => {
                  const isActive = isActiveLink(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${
                        isActive
                          ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                          : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              
              {/* Mobile Departments Link */}
              <Link
                href="/departments"
                className={`py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${
                  isActiveLink('/departments') || isActiveLink('/laboratories')
                    ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Departments
              </Link>
              
              {/* Mobile Services Link */}
              <Link
                href="/services"
                className={`py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${
                  isActiveLink('/services')
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
                    className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${
                      isActive
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
                    className={`py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${
                      isActive
                        ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Contact Link */}
              {(() => {
                const contactLink = navLinks.find(l => l.label === "Contact");
                if (!contactLink) return null;
                const isActive = isActiveLink(contactLink.href);
                return (
                  <Link
                    key={contactLink.href}
                    href={contactLink.href}
                    className={`py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${
                      isActive
                        ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {contactLink.label}
                  </Link>
                );
              })()}
              
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
