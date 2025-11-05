"use client"

interface ArticleContentProps {
  content: string
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div className="bg-card rounded-lg p-8 border">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )
}
