/** @format */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, Shield, ChevronDown, Building2, MapPin, ArrowUpRight } from "lucide-react";
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
import type { ServiceCenter } from "@/types/service-center";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [deptSections, setDeptSections] = useState<Array<{ id: string; name: string }>>([]);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string; section_id: string; icon?: string }>>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [hoveredCenterUnitId, setHoveredCenterUnitId] = useState<string | null>(null);
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

        const centersRes = await apiClient.getServiceCenters();
        const normalizedCenters = (centersRes.centers ?? []).map((center: any) => {
          const equipments = Array.isArray(center.equipments) ? center.equipments : [];
          const products = Array.isArray(center.products) ? center.products : [];
          const servicesList = Array.isArray(center.services) ? center.services : [];
          return {
            ...center,
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
        setServiceCenters([]);
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

  const libraryLinks = [
    { href: "/library/overview", label: "Overview" },
    { href: "/library/books", label: "Books" },
    { href: "/library/projects", label: "Projects" },
    { href: "/library/publication", label: "Publication" },
    { href: "/library/patent", label: "Patent" },
    { href: "/library/citation", label: "Citation" },
    { href: "/library/library", label: "Library" },
  ];

  const librarySubLinks = [
    { href: "/library/journal", label: "Journal" },
    { href: "/library/theses-phd", label: "Theses (PHD)" },
    { href: "/library/theses-msc", label: "Theses (MSC)" },
  ];

  const moreLinks = [
    { href: "/products", label: "Products" },
    { href: "/training-center", label: "Training Center" },
    { href: "/ejp-journal", label: "Ejp Journal" },
    { href: "/tico-eclub", label: "Tico & E-Club" },
    { href: "/contact", label: "Contact" },
  ];

  const aboutLinks = [
    { href: "/about/overview", label: "Overview" },
    { href: "/about/top-management", label: "Top Management" },
    { href: "/about/iso-certificate", label: "Accreditation (Iso certificates)" },
    { href: "/about/awards", label: "Awards" },
    { href: "/about/clients-partners", label: "Our clients partners" },
    { href: "/about/schools", label: "Schools" },
    { href: "/about/protocols-agreements", label: "Protocols & Agreements" },
  ];

  const runLinks = [
    { href: "/run/patent", label: "Patent" },
    { href: "/run/citations", label: "Citations" },
  ];

  const newsLinks = [
    { href: "/news", label: "News" },
    { href: "/events", label: "Events" },
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
      className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="EPRI Logo"
              width={120}
              height={48}
              className="h-8 sm:h-10 md:h-12 w-auto"
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



              {/* News & Events Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 ${
                      isActiveLink('/news') || isActiveLink('/events')
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="relative z-10 leading-tight">
                      <span className="block">News & Events</span>
                    </span>
                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div 
                      className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                        isActiveLink('/news') || isActiveLink('/events')
                          ? "bg-primary/15 opacity-100" 
                          : "bg-primary/10 opacity-0 group-hover:opacity-100"
                      }`}
                    ></div>
                    {(isActiveLink('/news') || isActiveLink('/events')) && (
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
                  className="w-[900px] max-h-[85vh] overflow-y-auto p-0 rounded-2xl border border-primary/20 ring-1 ring-primary/10 bg-linear-to-br from-background/95 to-background/80 backdrop-blur-xl shadow-2xl"
                align="end"
                onMouseLeave={() => setHoveredSectionId(null)}
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
                  <div className="flex min-h-[400px]">
                    {/* Left Sidebar - Sections */}
                    <div className="w-64 border-r border-primary/10 bg-primary/5 p-4">
                      {deptSections.length > 0 ? (
                        <div className="space-y-1">
                          {deptSections.map((section) => {
                            const sectionDepartments = departments.filter(dept => dept.section_id === section.id);
                            const isHovered = hoveredSectionId === section.id;
                            
                            return (
                              <div
                                key={section.id}
                                className="relative"
                                onMouseEnter={() => setHoveredSectionId(section.id)}
                              >
                                <Link 
                                  href={`/departments?sectionId=${section.id}`}
                                  className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                                    isHovered
                                      ? "bg-primary/20 text-primary font-semibold"
                                      : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{section.name}</span>
                                    {sectionDepartments.length > 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        {sectionDepartments.length}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-sm text-muted-foreground">Loading sections...</p>
                        </div>
                      )}
                    </div>

                    {/* Right Content - Departments for Hovered Section */}
                    <div className="flex-1 p-6">
                      {hoveredSectionId ? (
                        (() => {
                          const section = deptSections.find(s => s.id === hoveredSectionId);
                          const sectionDepartments = departments.filter(dept => dept.section_id === hoveredSectionId);
                          
                          return (
                            <motion.div
                              key={hoveredSectionId}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                              className="h-full"
                            >
                              <div className="mb-4">
                                <h4 className="text-base font-semibold text-foreground mb-1">
                                  {section?.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {sectionDepartments.length} {sectionDepartments.length === 1 ? 'department' : 'departments'}
                                </p>
                              </div>
                              
                              {sectionDepartments.length > 0 ? (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                  {sectionDepartments.map((dept) => (
                                    <motion.div
                                      key={dept.id}
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.15 }}
                                      className="border border-border/30 rounded-lg p-4 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                                    >
                                      <Link
                                        href={`/departments?sectionId=${hoveredSectionId}&departmentId=${dept.id}`}
                                        className="block mb-3"
                                      >
                                        <h5 className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2">
                                          {dept.icon && <span>{dept.icon}</span>}
                                          {dept.name}
                                        </h5>
                                      </Link>
                                      <div className="grid grid-cols-2 gap-2">
                                        <Link
                                          href={`/departments?sectionId=${hoveredSectionId}&departmentId=${dept.id}&tab=research-areas`}
                                          className="text-xs text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-primary/10"
                                        >
                                          Research Areas
                                        </Link>
                                        <Link
                                          href={`/departments?sectionId=${hoveredSectionId}&departmentId=${dept.id}&tab=projects`}
                                          className="text-xs text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-primary/10"
                                        >
                                          Projects
                                        </Link>
                                        <Link
                                          href={`/departments?sectionId=${hoveredSectionId}&departmentId=${dept.id}&tab=laboratories`}
                                          className="text-xs text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-primary/10"
                                        >
                                          Laboratories
                                        </Link>
                                        <Link
                                          href={`/departments?sectionId=${hoveredSectionId}&departmentId=${dept.id}&tab=staff`}
                                          className="text-xs text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-primary/10"
                                        >
                                          Staff
                                        </Link>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-12">
                                  <p className="text-sm text-muted-foreground">
                                    No departments in this section yet.
                                  </p>
                                </div>
                              )}
                              
                              {/* See All Departments Button */}
                              <div className="mt-6 pt-4 border-t border-primary/10">
                                <Button 
                                  asChild 
                                  size="sm" 
                                  className="w-full bg-primary hover:bg-primary/90"
                                >
                                  <Link href={`/departments?sectionId=${hoveredSectionId}`}>
                                    See All Departments
                                  </Link>
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })()
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                              Hover over a section to view departments
                            </p>
                            <Button asChild size="sm" variant="outline">
                              <Link href="/departments">View All Departments</Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>

              {/* Service Centers & Units Mega Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 ${
                      isActiveLink('/service-centers')
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="relative z-10 leading-tight">
                      <span className="block">Service Centers & Units</span>
                    </span>
                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div
                      className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                        isActiveLink('/service-centers')
                          ? "bg-primary/15 opacity-100"
                          : "bg-primary/10 opacity-0 group-hover:opacity-100"
                      }`}
                    ></div>
                    {isActiveLink('/service-centers') && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[900px] max-h-[85vh] overflow-y-auto p-0 rounded-2xl border border-primary/20 ring-1 ring-primary/10 bg-linear-to-br from-background/95 to-background/80 backdrop-blur-xl shadow-2xl"
                  align="end"
                  onMouseLeave={() => setHoveredCenterUnitId(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <div className="p-6 border-b border-primary/10">
                      <h3 className="text-lg font-semibold text-foreground mb-1">Service Centers & Units</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore accredited hubs and specialized units delivering testing, optimization, and innovation programs
                      </p>
                    </div>
                    <div className="flex min-h-[400px]">
                      {/* Left Sidebar - Centers & Units Categories */}
                      <div className="w-64 border-r border-primary/10 bg-primary/5 p-4">
                        {/* Centers Section */}
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                            Centers
                          </h4>
                          <div className="space-y-1">
                            {serviceCenters
                              .filter(c => (c.type || 'center') === 'center')
                              .slice(0, 4)
                              .map((center) => {
                                const isHovered = hoveredCenterUnitId === center.id;
                                return (
                                  <div
                                    key={center.id}
                                    className="relative"
                                    onMouseEnter={() => setHoveredCenterUnitId(center.id)}
                                  >
                                    <Link
                                      href={`/service-centers/${center.slug}`}
                                      className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                                        isHovered
                                          ? "bg-primary/20 text-primary font-semibold"
                                          : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                                      }`}
                                    >
                                      <span className="text-sm">{center.name}</span>
                                    </Link>
                                  </div>
                                );
                              })}
                          </div>
                          {serviceCenters.filter(c => (c.type || 'center') === 'center').length > 4 && (
                            <div className="mt-3 pt-3 border-t border-primary/10">
                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs text-primary hover:text-primary hover:bg-primary/10"
                              >
                                <Link href="/service-centers?type=center">
                                  See All Centers
                                </Link>
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Units Section */}
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                            Units
                          </h4>
                          <div className="space-y-1">
                            {serviceCenters
                              .filter(c => c.type === 'unit')
                              .slice(0, 4)
                              .map((unit) => {
                                const isHovered = hoveredCenterUnitId === unit.id;
                                return (
                                  <div
                                    key={unit.id}
                                    className="relative"
                                    onMouseEnter={() => setHoveredCenterUnitId(unit.id)}
                                  >
                                    <Link
                                      href={`/service-centers/${unit.slug}`}
                                      className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                                        isHovered
                                          ? "bg-primary/20 text-primary font-semibold"
                                          : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                                      }`}
                                    >
                                      <span className="text-sm">{unit.name}</span>
                                    </Link>
                                  </div>
                                );
                              })}
                          </div>
                          {serviceCenters.filter(c => c.type === 'unit').length > 4 && (
                            <div className="mt-3 pt-3 border-t border-primary/10">
                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs text-primary hover:text-primary hover:bg-primary/10"
                              >
                                <Link href="/service-centers?type=unit">
                                  See All Units
                                </Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Content - Sub-items for Hovered Center/Unit */}
                      <div className="flex-1 p-6">
                        {hoveredCenterUnitId ? (
                          (() => {
                            const centerUnit = serviceCenters.find(c => c.id === hoveredCenterUnitId);
                            if (!centerUnit) return null;

                            return (
                              <motion.div
                                key={hoveredCenterUnitId}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                              >
                                <div className="mb-4">
                                  <h4 className="text-base font-semibold text-foreground mb-1">
                                    {centerUnit.name}
                                  </h4>
                                  {centerUnit.headline && (
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {centerUnit.headline}
                                    </p>
                                  )}
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                  <Link
                                    href={`/service-centers/${centerUnit.slug}#overview`}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20"
                                  >
                                    Overview
                                  </Link>
                                  <Link
                                    href={`/service-centers/${centerUnit.slug}#lab-methodology`}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20"
                                  >
                                    Lab Methodology & Services
                                  </Link>
                                  <Link
                                    href={`/service-centers/${centerUnit.slug}#events`}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20"
                                  >
                                    Events
                                  </Link>
                                  <Link
                                    href={`/service-centers/${centerUnit.slug}#training`}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20"
                                  >
                                    Training & E-Learning
                                  </Link>
                                  <Link
                                    href={`/service-centers/${centerUnit.slug}#products`}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20"
                                  >
                                    Products
                                  </Link>
                                  <Link
                                    href={`/service-centers/${centerUnit.slug}#equipment`}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20"
                                  >
                                    Equipment List
                                  </Link>
                                  <Link
                                    href={`/service-centers/${centerUnit.slug}#staff`}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20"
                                  >
                                    Staff
                                  </Link>
                                  <Link
                                    href={`/service-centers/${centerUnit.slug}#work-volume`}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20"
                                  >
                                    Work Volume & Company Activity
                                  </Link>
                                  <Link
                                    href={`/service-centers/${centerUnit.slug}#future-prospects`}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20"
                                  >
                                    Future Prospects
                                  </Link>
                                </div>

                                {/* View Full Page Button */}
                                <div className="mt-6 pt-4 border-t border-primary/10">
                                  <Button
                                    asChild
                                    size="sm"
                                    className="w-full bg-primary hover:bg-primary/90"
                                  >
                                    <Link href={`/service-centers/${centerUnit.slug}`}>
                                      View Full Details
                                    </Link>
                                  </Button>
                                </div>
                              </motion.div>
                            );
                          })()
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-2">
                                Hover over a center or unit to view details
                              </p>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/service-centers">View All Centers & Units</Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Library & Scientific Situation Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 ${
                      libraryLinks.some(link => isActiveLink(link.href)) || librarySubLinks.some(link => isActiveLink(link.href))
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="relative z-10 leading-tight">
                      <span className="block">Library & Scientific Situation</span>
                    </span>
                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div 
                      className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                        libraryLinks.some(link => isActiveLink(link.href)) || librarySubLinks.some(link => isActiveLink(link.href))
                          ? "bg-primary/15 opacity-100" 
                          : "bg-primary/10 opacity-0 group-hover:opacity-100"
                      }`}
                    ></div>
                    {(libraryLinks.some(link => isActiveLink(link.href)) || librarySubLinks.some(link => isActiveLink(link.href))) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {libraryLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link 
                        href={link.href} 
                        className={`w-full ${isActiveLink(link.href) ? 'text-primary font-semibold' : ''}`}
                      >
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Library Sub-sections
                  </div>
                  {librarySubLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link 
                        href={link.href} 
                        className={`w-full pl-6 ${isActiveLink(link.href) ? 'text-primary font-semibold' : ''}`}
                      >
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* More Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group flex items-center gap-1 ${
                      moreLinks.some(link => isActiveLink(link.href))
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="relative z-10">More</span>
                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <div 
                      className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                        moreLinks.some(link => isActiveLink(link.href))
                          ? "bg-primary/15 opacity-100" 
                          : "bg-primary/10 opacity-0 group-hover:opacity-100"
                      }`}
                    ></div>
                    {moreLinks.some(link => isActiveLink(link.href)) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {moreLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link 
                        href={link.href} 
                        className={`w-full ${isActiveLink(link.href) ? 'text-primary font-semibold' : ''}`}
                      >
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-2 xl:gap-4 ml-2 xl:ml-4 flex-shrink-0">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:bg-primary/5 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 group text-sm">
                    <User className="h-4 w-4 mr-1 xl:mr-2" />
                    <span className="hidden xl:inline">My Account</span>
                    <span className="xl:hidden">Account</span>
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
                <Button variant="ghost" asChild className="hover:bg-primary/5 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 text-sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 px-3 xl:px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm">
                  <Link href="/register">Get Started</Link>
                </Button>
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


              {/* News & Events Section */}
              <div className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                News & Events
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

              {/* Library & Scientific Situation Section */}
              <div className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Library & Scientific Situation
              </div>
              {libraryLinks.map((link) => {
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
              <div className="pl-12 py-1 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Library Sub-sections
              </div>
              {librarySubLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-2 px-12 text-sm font-medium transition-all duration-200 rounded-lg ${
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

              {/* More Section */}
              <div className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                More
              </div>
              {moreLinks.map((link) => {
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
                          className={`flex-1 block py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${
                            isActiveLink('/departments')
                              ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                              : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {section.name}
                        </Link>
                        {sectionDepartments.length > 0 && (
                          <button
                            onClick={() => setExpandedMobileSection(isExpanded ? null : section.id)}
                            className="px-4 py-2 text-muted-foreground hover:text-primary transition-colors"
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
                                className="block py-1.5 px-4 text-xs font-medium text-foreground hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {dept.icon && <span className="mr-2">{dept.icon}</span>}
                                {dept.name}
                              </Link>
                              <div className="pl-6 space-y-1">
                                <Link
                                  href={`/departments?sectionId=${section.id}&departmentId=${dept.id}&tab=research-areas`}
                                  className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  Research Areas
                                </Link>
                                <Link
                                  href={`/departments?sectionId=${section.id}&departmentId=${dept.id}&tab=projects`}
                                  className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  Projects
                                </Link>
                                <Link
                                  href={`/departments?sectionId=${section.id}&departmentId=${dept.id}&tab=laboratories`}
                                  className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  Laboratories
                                </Link>
                                <Link
                                  href={`/departments?sectionId=${section.id}&departmentId=${dept.id}&tab=staff`}
                                  className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
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
                  className={`py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${
                    isActiveLink('/departments') || isActiveLink('/laboratories')
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
                        className={`block py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${
                          isActiveLink('/service-centers')
                            ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                            : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {center.name}
                      </Link>
                      <div className="pl-12 space-y-1">
                        <Link
                          href={`/service-centers/${center.slug}#overview`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Overview
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#lab-methodology`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Lab Methodology & Services
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#events`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Events
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#training`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Training & E-Learning
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#products`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Products
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#equipment`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Equipment List
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#staff`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Staff
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#work-volume`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Work Volume & Company Activity
                        </Link>
                        <Link
                          href={`/service-centers/${center.slug}#future-prospects`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
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
                        className={`block py-2 px-8 text-sm font-medium transition-all duration-200 rounded-lg ${
                          isActiveLink('/service-centers')
                            ? "text-primary bg-primary/10 font-semibold border-l-2 border-primary"
                            : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {unit.name}
                      </Link>
                      <div className="pl-12 space-y-1">
                        <Link
                          href={`/service-centers/${unit.slug}#overview`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Overview
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#lab-methodology`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Lab Methodology & Services
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#events`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Events
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#training`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Training & E-Learning
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#products`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Products
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#equipment`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Equipment List
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#staff`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Staff
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#work-volume`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Work Volume & Company Activity
                        </Link>
                        <Link
                          href={`/service-centers/${unit.slug}#future-prospects`}
                          className="block py-1 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
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
