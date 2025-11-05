"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { reviews } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

interface ReviewListProps {
  courseId: string
  isEnrolled: boolean
}

export function ReviewList({ courseId, isEnrolled }: ReviewListProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const { toast } = useToast()

  const courseReviews = reviews.filter((review) => review.courseId === courseId)

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isEnrolled) {
      toast({
        title: "Enrollment Required",
        description: "You must be enrolled in this course to leave a review.",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please write a comment before submitting.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    })

    setRating(0)
    setComment("")
  }

  const averageRating =
    courseReviews.length > 0
      ? (courseReviews.reduce((acc, review) => acc + review.rating, 0) / courseReviews.length).toFixed(1)
      : "0.0"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold mb-2">Student Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(Number(averageRating)) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="font-semibold">{averageRating}</span>
          <span className="text-muted-foreground">({courseReviews.length} reviews)</span>
        </div>
      </div>

      {/* Review Form */}
      {isEnrolled && (
        <Card>
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="text-sm font-medium mb-2 block">
                  Your Review
                </label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this course..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit">Submit Review</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {courseReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No reviews yet. Be the first to review this course!</p>
            </CardContent>
          </Card>
        ) : (
          courseReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.author} />
                    <AvatarFallback>
                      {review.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{review.author}</h4>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
