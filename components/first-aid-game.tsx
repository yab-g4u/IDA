"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Clock, Heart, AlertTriangle, CheckCircle, XCircle, Star, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface LeaderboardEntry {
  id: string
  user_email: string
  score: number
  time_taken: number
  completed_at: string
}

const firstAidQuestions: Question[] = [
  {
    id: 1,
    question: "What is the first step in treating a severe bleeding wound?",
    options: [
      "Apply a tourniquet immediately",
      "Apply direct pressure to the wound",
      "Elevate the injured area",
      "Clean the wound with water",
    ],
    correct: 1,
    explanation:
      "Direct pressure is the most effective first step to control bleeding. Apply firm, steady pressure directly on the wound.",
  },
  {
    id: 2,
    question: "What should you do if someone is choking and cannot speak or cough?",
    options: [
      "Give them water to drink",
      "Perform the Heimlich maneuver",
      "Have them lie down",
      "Pat their back gently",
    ],
    correct: 1,
    explanation:
      "The Heimlich maneuver (abdominal thrusts) is the correct technique for a conscious choking victim who cannot speak or cough.",
  },
  {
    id: 3,
    question: "What is the correct ratio of chest compressions to rescue breaths in CPR for adults?",
    options: ["15:2", "30:2", "20:1", "10:1"],
    correct: 1,
    explanation: "The current guidelines recommend 30 chest compressions followed by 2 rescue breaths for adult CPR.",
  },
  {
    id: 4,
    question: "How should you treat a minor burn?",
    options: [
      "Apply ice directly to the burn",
      "Use butter or oil on the burn",
      "Run cool water over the burn for 10-20 minutes",
      "Pop any blisters that form",
    ],
    correct: 2,
    explanation:
      "Cool running water helps reduce pain and prevent further tissue damage. Never use ice, butter, or pop blisters.",
  },
  {
    id: 5,
    question: "What are the signs of a heart attack?",
    options: [
      "Only chest pain",
      "Chest pain, shortness of breath, nausea, sweating",
      "Only arm pain",
      "Only dizziness",
    ],
    correct: 1,
    explanation:
      "Heart attack symptoms can include chest pain, shortness of breath, nausea, sweating, and pain in arms, neck, or jaw.",
  },
  {
    id: 6,
    question: "What should you do if someone has a seizure?",
    options: [
      "Hold them down to stop the shaking",
      "Put something in their mouth",
      "Clear the area and protect their head",
      "Give them water",
    ],
    correct: 2,
    explanation:
      "Clear the area of dangerous objects, cushion their head, and time the seizure. Never restrain them or put anything in their mouth.",
  },
  {
    id: 7,
    question: "How do you treat a sprained ankle?",
    options: [
      "Apply heat immediately",
      "Walk on it to test the injury",
      "Use the RICE method (Rest, Ice, Compression, Elevation)",
      "Massage the injured area",
    ],
    correct: 2,
    explanation:
      "RICE (Rest, Ice, Compression, Elevation) is the standard treatment for sprains to reduce swelling and pain.",
  },
  {
    id: 8,
    question: "What should you do if someone is having an allergic reaction?",
    options: [
      "Give them water",
      "Use their EpiPen if available and call emergency services",
      "Have them lie down",
      "Give them antihistamines only",
    ],
    correct: 1,
    explanation:
      "For severe allergic reactions, use an EpiPen if available and call emergency services immediately. Time is critical.",
  },
  {
    id: 9,
    question: "How should you help someone who is hyperventilating?",
    options: [
      "Have them breathe into a paper bag",
      "Tell them to hold their breath",
      "Help them breathe slowly and calmly",
      "Give them oxygen",
    ],
    correct: 2,
    explanation:
      "Help them slow their breathing by breathing with them calmly. Paper bags are no longer recommended as they can be dangerous.",
  },
  {
    id: 10,
    question: "What is the recovery position used for?",
    options: [
      "Someone who is conscious and alert",
      "Someone who is unconscious but breathing",
      "Someone having a heart attack",
      "Someone with a broken bone",
    ],
    correct: 1,
    explanation:
      "The recovery position keeps an unconscious but breathing person's airway clear and prevents choking on vomit.",
  },
]

export function FirstAidGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    setIsLoadingLeaderboard(true)
    try {
      // Retry logic with exponential backoff
      let retries = 3
      let delay = 1000

      while (retries > 0) {
        try {
          const { data, error } = await supabase
            .from("first_aid_scores")
            .select("*")
            .order("score", { ascending: false })
            .order("time_taken", { ascending: true })
            .limit(10)

          if (error) throw error

          setLeaderboard(data || [])
          break
        } catch (error) {
          retries--
          if (retries === 0) throw error

          console.log(`Retrying leaderboard load in ${delay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          delay *= 2 // Exponential backoff
        }
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error)
      // Don't show error to user, just log it
      setLeaderboard([])
    } finally {
      setIsLoadingLeaderboard(false)
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setStartTime(Date.now())
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setGameCompleted(false)
    setEndTime(null)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowExplanation(true)

    if (answerIndex === firstAidQuestions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < firstAidQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      completeGame()
    }
  }

  const completeGame = async () => {
    const endTime = Date.now()
    setEndTime(endTime)
    setGameCompleted(true)

    if (user && startTime) {
      const timeTaken = Math.round((endTime - startTime) / 1000)

      try {
        const { error } = await supabase.from("first_aid_scores").insert([
          {
            user_id: user.id,
            user_email: user.email,
            score: score,
            time_taken: timeTaken,
            completed_at: new Date().toISOString(),
          },
        ])

        if (error) throw error

        toast({
          title: "Score Saved!",
          description: `Your score of ${score}/${firstAidQuestions.length} has been saved to the leaderboard.`,
        })

        // Reload leaderboard
        loadLeaderboard()
      } catch (error) {
        console.error("Error saving score:", error)
        toast({
          title: "Score Not Saved",
          description: "There was an error saving your score, but you can still see your results.",
          variant: "destructive",
        })
      }
    }
  }

  const resetGame = () => {
    setGameStarted(false)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowExplanation(false)
    setGameCompleted(false)
    setStartTime(null)
    setEndTime(null)
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return { text: "Expert", color: "bg-green-500" }
    if (percentage >= 80) return { text: "Advanced", color: "bg-blue-500" }
    if (percentage >= 70) return { text: "Good", color: "bg-yellow-500" }
    if (percentage >= 60) return { text: "Fair", color: "bg-orange-500" }
    return { text: "Needs Practice", color: "bg-red-500" }
  }

  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            First Aid Knowledge Quiz
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Test your first aid knowledge with this interactive quiz
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Quiz Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span>{firstAidQuestions.length} questions</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>No time limit</span>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Compete on the leaderboard</span>
              </div>
              <Button onClick={startGame} className="w-full mt-4" size="lg">
                Start Quiz
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Leaderboard
                {isLoadingLeaderboard && <Loader2 className="w-4 h-4 animate-spin" />}
              </CardTitle>
              <CardDescription>Top 10 scores</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLeaderboard ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading leaderboard...</span>
                </div>
              ) : leaderboard.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">#{index + 1}</span>
                        <div>
                          <div className="font-medium">{entry.user_email}</div>
                          <div className="text-sm text-gray-500">{entry.time_taken}s</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold">
                          {entry.score}/{firstAidQuestions.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No scores yet. Be the first to play!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (gameCompleted) {
    const timeTaken = startTime && endTime ? Math.round((endTime - startTime) / 1000) : 0
    const badge = getScoreBadge(score, firstAidQuestions.length)

    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Quiz Completed!</CardTitle>
            <div className="space-y-4">
              <div className={`text-6xl font-bold ${getScoreColor(score, firstAidQuestions.length)}`}>
                {score}/{firstAidQuestions.length}
              </div>
              <Badge className={`${badge.color} text-white px-4 py-2 text-lg`}>{badge.text}</Badge>
              <div className="flex items-center justify-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{timeTaken} seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span>{Math.round((score / firstAidQuestions.length) * 100)}%</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              {score >= 8
                ? "Excellent! You have strong first aid knowledge."
                : score >= 6
                  ? "Good job! Consider reviewing some first aid techniques."
                  : "Keep learning! First aid knowledge can save lives."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={resetGame} variant="outline">
                Play Again
              </Button>
              <Button onClick={loadLeaderboard}>View Leaderboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = firstAidQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / firstAidQuestions.length) * 100

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Question {currentQuestion + 1} of {firstAidQuestions.length}
          </span>
          <span className="text-sm font-medium">Score: {score}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  selectedAnswer === null
                    ? "outline"
                    : index === question.correct
                      ? "default"
                      : selectedAnswer === index
                        ? "destructive"
                        : "outline"
                }
                className={`p-4 h-auto text-left justify-start ${
                  selectedAnswer !== null && index === question.correct
                    ? "bg-green-500 hover:bg-green-600"
                    : selectedAnswer === index && index !== question.correct
                      ? "bg-red-500 hover:bg-red-600"
                      : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
              >
                <div className="flex items-center gap-3">
                  {selectedAnswer !== null &&
                    (index === question.correct ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : selectedAnswer === index ? (
                      <XCircle className="w-5 h-5" />
                    ) : null)}
                  <span>{option}</span>
                </div>
              </Button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-500" />
                Explanation
              </h4>
              <p className="text-gray-700 dark:text-gray-300">{question.explanation}</p>
            </div>
          )}

          {showExplanation && (
            <Button onClick={nextQuestion} className="w-full mt-4">
              {currentQuestion < firstAidQuestions.length - 1 ? "Next Question" : "Complete Quiz"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
