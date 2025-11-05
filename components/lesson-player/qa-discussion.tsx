"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { MessageSquare, ThumbsUp, Reply } from "lucide-react"

interface Comment {
  id: string
  author: string
  avatar?: string
  content: string
  timestamp: string
  likes: number
  replies: Comment[]
}

interface QADiscussionProps {
  courseId: string
  lessonId: string
}

export function QADiscussion({ courseId, lessonId }: QADiscussionProps) {
  const [newQuestion, setNewQuestion] = useState("")
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Ahmed Hassan",
      content: "Great explanation! Could you provide more examples of this concept in real-world applications?",
      timestamp: "2 hours ago",
      likes: 5,
      replies: [
        {
          id: "1-1",
          author: "Instructor",
          content: "In the next lesson, we'll cover several industry examples. Stay tuned!",
          timestamp: "1 hour ago",
          likes: 3,
          replies: [],
        },
      ],
    },
    {
      id: "2",
      author: "Sara Mohamed",
      content: "I'm having trouble understanding the third step. Can someone clarify?",
      timestamp: "5 hours ago",
      likes: 2,
      replies: [],
    },
  ])

  const handleSubmit = () => {
    if (!newQuestion.trim()) return

    const newComment: Comment = {
      id: Date.now().toString(),
      author: "You",
      content: newQuestion,
      timestamp: "Just now",
      likes: 0,
      replies: [],
    }

    setComments([newComment, ...comments])
    setNewQuestion("")
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <Card className={`p-4 ${isReply ? "ml-12 mt-3" : "mb-4"}`}>
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.avatar || "/placeholder.svg"} />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
          </div>
          <p className="text-sm mb-3">{comment.content}</p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <ThumbsUp className="h-3 w-3 mr-1" />
              {comment.likes}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          </div>
        </div>
      </div>
      {comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Questions & Answers
        </h3>
        <Card className="p-4">
          <Textarea
            placeholder="Ask a question about this lesson..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="mb-3 min-h-[100px]"
          />
          <Button onClick={handleSubmit} disabled={!newQuestion.trim()}>
            Post Question
          </Button>
        </Card>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-4 text-muted-foreground">
          {comments.length} {comments.length === 1 ? "Question" : "Questions"}
        </h4>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
