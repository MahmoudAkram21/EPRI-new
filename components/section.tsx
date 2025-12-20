import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  id?: string
}

export function Section({ children, className, containerClassName, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-8 md:py-10", className)}>
      <div className={cn("container mx-auto px-4", containerClassName)}>{children}</div>
    </section>
  )
}
