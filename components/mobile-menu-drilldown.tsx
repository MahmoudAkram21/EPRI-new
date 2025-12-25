"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { ChevronRight, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileMenuDrilldownProps {
    activeMenu: string | null
    goToSubmenu: (menuName: string) => void
    goBack: () => void
    resetMobileMenu: () => void
    isActiveLink: (href: string) => boolean
    aboutLinks: Array<{ href: string; label: string }>
    newsLinks: Array<{ href: string; label: string }>
    libraryLinks: Array<{ href: string; label: string }>
    departments: Array<{ id: string; name: any; section_id: string; laboratories?: any[] }>
    serviceCenters: Array<{ id: string; name: any }>
}

export function MobileMenuDrilldown({
    activeMenu,
    goToSubmenu,
    goBack,
    resetMobileMenu,
    isActiveLink,
    aboutLinks,
    newsLinks,
    libraryLinks,
    departments,
    serviceCenters,
}: MobileMenuDrilldownProps) {
    const t = useTranslations()
    const locale = useLocale()

    // Helper to get localized text
    const getLocalizedText = (field: any): string => {
        if (!field) return ''
        if (typeof field === 'string') return field
        return field[locale as 'en' | 'ar'] || field.en || ''
    }

    // Animation variants for slide transitions
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction > 0 ? '-100%' : '100%',
            opacity: 0
        })
    }

    return (
        <nav className="flex flex-col space-y-1 relative overflow-hidden">
            {/* Back Button */}
            <AnimatePresence>
                {activeMenu && (
                    <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        onClick={goBack}
                        className="flex items-center gap-2 py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary transition-colors border-b border-border/30 mb-2 sticky top-0 bg-background z-10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {t('common.back')}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Menu Content with Slide Animation */}
            <AnimatePresence mode="wait" custom={activeMenu ? 1 : -1}>
                <motion.div
                    key={activeMenu || 'main'}
                    custom={activeMenu ? 1 : -1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="space-y-1"
                >

                    {/* Main Menu - No active submenu */}
                    {!activeMenu && (
                        <>
                            <button
                                onClick={() => goToSubmenu('about')}
                                className="flex items-center justify-between py-3 px-4 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                            >
                                <span>{t('nav.about')}</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => goToSubmenu('departments')}
                                className="flex items-center justify-between py-3 px-4 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                            >
                                <span>{t('nav.departments')}</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => goToSubmenu('laboratories')}
                                className="flex items-center justify-between py-3 px-4 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                            >
                                <span>{t('nav.laboratories')}</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => goToSubmenu('service-centers')}
                                className="flex items-center justify-between py-3 px-4 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                            >
                                <span>{t('nav.serviceCenters')}</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => goToSubmenu('news-events')}
                                className="flex items-center justify-between py-3 px-4 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                            >
                                <span>{t('nav.newsEvents')}</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <Link
                                href="/training-center"
                                className="py-3 px-4 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                                onClick={resetMobileMenu}
                            >
                                {t('nav.trainingCenter')}
                            </Link>

                            <button
                                onClick={() => goToSubmenu('library')}
                                className="flex items-center justify-between py-3 px-4 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                            >
                                <span>{t('nav.library')}</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <Link
                                href="/innovation-and-entrepreneurship"
                                className="py-3 px-4 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                                onClick={resetMobileMenu}
                            >
                                {t('nav.innovationEntrepreneurship')}
                            </Link>

                            <Link
                                href="/ejp-journal"
                                className="py-3 px-4 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                                onClick={resetMobileMenu}
                            >
                                {t('nav.ejpJournal')}
                            </Link>

                            <Link
                                href="/products"
                                className="py-3 px-4 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                                onClick={resetMobileMenu}
                            >
                                {t('nav.products')}
                            </Link>

                            <Link
                                href="/equipments"
                                className="py-3 px-4 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                                onClick={resetMobileMenu}
                            >
                                {t('nav.equipments')}
                            </Link>

                            <Link
                                href="/contact"
                                className="py-3 px-4 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                                onClick={resetMobileMenu}
                            >
                                {t('nav.contact')}
                            </Link>
                        </>
                    )}

                    {/* About Submenu */}
                    {activeMenu === 'about' && (
                        <>
                            {aboutLinks.map((link) => {
                                const isActive = isActiveLink(link.href)
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                                            ? "text-primary bg-primary/10 font-semibold border-l-4 border-primary"
                                            : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                                            }`}
                                        onClick={resetMobileMenu}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </>
                    )}

                    {/* Departments Submenu */}
                    {activeMenu === 'departments' && (
                        <>
                            <Link
                                href="/departments"
                                className="py-3 px-4 text-sm font-semibold text-primary bg-primary/10 transition-all rounded-lg border-l-4 border-primary"
                                onClick={resetMobileMenu}
                            >
                                {t('nav.allDepartments')}
                            </Link>
                            {departments.map((dept) => (
                                <Link
                                    key={dept.id}
                                    href={`/departments/${dept.id}`}
                                    className="py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                                    onClick={resetMobileMenu}
                                >
                                    {getLocalizedText(dept.name)}
                                </Link>
                            ))}
                        </>
                    )}

                    {/* Laboratories Submenu */}
                    {activeMenu === 'laboratories' && (
                        <>
                            <Link
                                href="/laboratories"
                                className="py-3 px-4 text-sm font-semibold text-primary bg-primary/10 transition-all rounded-lg border-l-4 border-primary"
                                onClick={resetMobileMenu}
                            >
                                {t('nav.allLaboratories')}
                            </Link>
                            {departments.flatMap(dept => dept.laboratories || []).map((lab: any) => (
                                <Link
                                    key={lab.id}
                                    href={`/laboratories/${lab.id}`}
                                    className="py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                                    onClick={resetMobileMenu}
                                >
                                    {getLocalizedText(lab.name)}
                                </Link>
                            ))}
                        </>
                    )}

                    {/* Service Centers Submenu */}
                    {activeMenu === 'service-centers' && (
                        <>
                            <Link
                                href="/service-centers"
                                className="py-3 px-4 text-sm font-semibold text-primary bg-primary/10 transition-all rounded-lg border-l-4 border-primary"
                                onClick={resetMobileMenu}
                            >
                                {t('nav.allServiceCenters')}
                            </Link>
                            {serviceCenters.map((center) => (
                                <Link
                                    key={center.id}
                                    href={`/service-centers/${center.id}`}
                                    className="py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                                    onClick={resetMobileMenu}
                                >
                                    {getLocalizedText(center.name)}
                                </Link>
                            ))}
                        </>
                    )}

                    {/* News & Events Submenu */}
                    {activeMenu === 'news-events' && (
                        <>
                            {newsLinks.map((link) => {
                                const isActive = isActiveLink(link.href)
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                                            ? "text-primary bg-primary/10 font-semibold border-l-4 border-primary"
                                            : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                                            }`}
                                        onClick={resetMobileMenu}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </>
                    )}

                    {/* Library Submenu */}
                    {activeMenu === 'library' && (
                        <>
                            {libraryLinks.map((link) => {
                                const isActive = isActiveLink(link.href)
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                                            ? "text-primary bg-primary/10 font-semibold border-l-4 border-primary"
                                            : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                                            }`}
                                        onClick={resetMobileMenu}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </nav>
    )
}
