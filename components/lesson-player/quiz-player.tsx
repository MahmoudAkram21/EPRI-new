"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Quiz } from "@/lib/data"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizPlayerProps {
  quiz: Quiz
  onComplete: () => void
}

export function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const question = quiz.questions[currentQuestion]
  const isLastQuestion = currentQuestion === quiz.questions.length - 1

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    setShowFeedback(true)
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (isLastQuestion) {
      setIsComplete(true)
      onComplete()
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }

  if (isComplete) {
    const percentage = Math.round((score / quiz.questions.length) * 100)
    return (
      <Card className="p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-muted-foreground mb-4">
          You scored {score} out of {quiz.questions.length} ({percentage}%)
        </p>
        <Button onClick={() => window.location.reload()}>Retake Quiz</Button>
      </Card>
    )
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-medium">Score: {score}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-6">{question.question}</h3>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === question.correctAnswer
          const showCorrect = showFeedback && isCorrect
          const showIncorrect = showFeedback && isSelected && !isCorrect

          return (
            <button
              key={index}
              onClick={() => !showFeedback && setSelectedAnswer(index)}
              disabled={showFeedback}
              className={cn(
                "w-full p-4 text-left rounded-lg border-2 transition-all",
                isSelected && !showFeedback && "border-primary bg-primary/5",
                !isSelected && !showFeedback && "border-border hover:border-primary/50",
                showCorrect && "border-green-600 bg-green-50 dark:bg-green-950",
                showIncorrect && "border-red-600 bg-red-50 dark:bg-red-950",
                showFeedback && "cursor-not-allowed",
              )}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                {showIncorrect && <XCircle className="h-5 w-5 text-red-600" />}
              </div>
            </button>
          )
        })}
      </div>

      {showFeedback && question.explanation && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-1">Explanation:</p>
          <p className="text-sm text-muted-foreground">{question.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!showFeedback ? (
          <Button onClick={handleSubmit} disabled={selectedAnswer === null}>
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>{isLastQuestion ? "Finish Quiz" : "Next Question"}</Button>
        )}
      </div>
    </Card>
  )
}
