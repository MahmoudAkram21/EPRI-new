"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on admin pages
  // Also check for locale prefix (e.g., /en/admin or /ar/admin)
  if (pathname?.includes("/admin")) {
    return null;
  }
  
  return <Header />;
}
