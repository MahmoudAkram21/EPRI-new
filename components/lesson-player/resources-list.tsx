"use client"

import { Download, FileText, ImageIcon, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Resource } from "@/lib/data"

interface ResourcesListProps {
  resources: Resource[]
}

export function ResourcesList({ resources }: ResourcesListProps) {
  const getIcon = (type: Resource["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5" />
      case "image":
        return <ImageIcon className="h-5 w-5" />
      case "document":
        return <File className="h-5 w-5" />
    }
  }

  if (resources.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <p>No resources available for this lesson.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Downloadable Resources</h3>
      {resources.map((resource, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">{getIcon(resource.type)}</div>
              <span className="font-medium">{resource.name}</span>
            </div>
            <Button size="sm" variant="outline" asChild>
              <a href={resource.url} download>
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
