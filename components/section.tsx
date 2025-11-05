import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: ReactNode
  className?: string
  containerClassName?: string
}

export function Section({ children, className, containerClassName }: SectionProps) {
  return (
    <section className={cn("py-10 md:py-18", className)}>
      <div className={cn("container mx-auto px-4", containerClassName)}>{children}</div>
    </section>
  )
}
