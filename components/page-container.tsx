import type { ReactNode } from "react"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return <div className={`min-h-screen flex flex-col ${className}`}>{children}</div>
}
