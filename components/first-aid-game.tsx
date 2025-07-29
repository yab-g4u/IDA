"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "@/hooks/use-auth"
import {
  Heart,
  Trophy,
  Clock,
  ArrowRight,
  Repeat,
  Award,
  Medal,
  Crown,
  Sparkles,
  Zap,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

// First aid scenarios with questions and answers
const firstAidScenarios = [
  {
    id: 1,
    scenario: "Someone is choking and cannot speak or breathe. What should you do first?",
    options: [
      { id: "a", text: "Give them water to drink" },
      { id: "b", text: "Perform abdominal thrusts (Heimlich maneuver)" },
      { id: "c", text: "Slap them on the back gently" },
      { id: "d", text: "Tell them to cough harder" },
    ],
    correctAnswer: "b",
    explanation:
      "When someone is choking and cannot speak or breathe, perform abdominal thrusts (Heimlich maneuver) to dislodge the object blocking their airway.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    scenario: "A person has collapsed and is unresponsive. What is the first step you should take?",
    options: [
      { id: "a", text: "Start chest compressions immediately" },
      { id: "b", text: "Give rescue breaths" },
      { id: "c", text: "Check for responsiveness and call for emergency help" },
      { id: "d", text: "Put them in the recovery position" },
    ],
    correctAnswer: "c",
    explanation:
      "Always check for responsiveness first and call for emergency help before starting CPR or other interventions.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    scenario: "Someone has a deep cut that is bleeding heavily. What should you do?",
    options: [
      { id: "a", text: "Apply direct pressure to the wound with a clean cloth" },
      { id: "b", text: "Apply a tourniquet immediately" },
      { id: "c", text: "Rinse the wound with water first" },
      { id: "d", text: "Apply antibiotic ointment" },
    ],
    correctAnswer: "a",
    explanation:
      "For heavy bleeding, apply direct pressure to the wound with a clean cloth or bandage to help stop the bleeding.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    scenario: "Someone is having a seizure. What should you do?",
    options: [
      { id: "a", text: "Hold them down to stop the shaking" },
      { id: "b", text: "Put something in their mouth to prevent them from biting their tongue" },
      { id: "c", text: "Clear the area around them and protect their head" },
      { id: "d", text: "Give them water immediately after the seizure" },
    ],
    correctAnswer: "c",
    explanation:
      "During a seizure, clear the area of dangerous objects and gently protect their head with something soft. Never restrain them or put anything in their mouth.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    scenario: "Someone has been stung by a bee and is having difficulty breathing. What might this indicate?",
    options: [
      { id: "a", text: "They're just anxious about the sting" },
      { id: "b", text: "They have a severe allergic reaction (anaphylaxis)" },
      { id: "c", text: "The bee venom is mildly toxic to everyone" },
      { id: "d", text: "They have asthma unrelated to the sting" },
    ],
    correctAnswer: "b",
    explanation:
      "Difficulty breathing after a bee sting may indicate anaphylaxis, a severe allergic reaction that requires immediate emergency medical attention.",
    image: "/placeholder.svg?height=200&width=300",
  },
]

// Game difficulty levels
const difficultyLevels = {
  easy: { questions: 5, timePerQuestion: 20, pointsPerCorrect: 10 },
  medium: { questions: 8, timePerQuestion: 15, pointsPerCorrect: 15 },
  hard: { questions: 10, timePerQuestion: 10, pointsPerCorrect: 20 },
}

// Leaderboard type
interface LeaderboardEntry {
  id: string
  user_id: string
  username: string
  score: number
  difficulty: string
  created_at: string
}

export default function FirstAidGame() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "result">("menu")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameQuestions, setGameQuestions] = useState<typeof firstAidScenarios>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const [gameCompleted, setGameCompleted] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [showAnimation, setShowAnimation] = useState(false)

  // Get username from localStorage or generate one
  useEffect(() => {
    const storedUsername = localStorage.getItem("gameUsername")
    if (storedUsername) {
      setUsername(storedUsername)
    } else if (user) {
      // Use email prefix as username if logged in
      const emailPrefix = user.email?.split("@")[0]
      const newUsername = emailPrefix || `Player${Math.floor(Math.random() * 10000)}`
      setUsername(newUsername)
      localStorage.setItem("gameUsername", newUsername)
    } else {
      // Generate random username if not logged in
      const newUsername = `Player${Math.floor(Math.random() * 10000)}`
      setUsername(newUsername)
      localStorage.setItem("gameUsername", newUsername)
    }
  }, [user])

  // Load leaderboard with better error handling
  const loadLeaderboard = useCallback(async () => {
    try {
      setIsLoadingLeaderboard(true)
      setLeaderboardError(null)

      // Retry logic with exponential backoff
      let retries = 3
      let delay = 1000

      while (retries > 0) {
        try {
          const { data, error } = await supabase
            .from("game_scores")
            .select("*")
            .order("score", { ascending: false })
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
      setLeaderboardError("Unable to load leaderboard")
      setLeaderboard([])
    } finally {
      setIsLoadingLeaderboard(false)
    }
  }, [])

  // Load leaderboard on mount
  useEffect(() => {
    loadLeaderboard()
  }, [loadLeaderboard])

  // Start a new game
  const startGame = () => {
    // Shuffle and select questions based on difficulty
    const shuffled = [...firstAidScenarios].sort(() => 0.5 - Math.random())
    const selectedQuestions = shuffled.slice(0, difficultyLevels[difficulty].questions)

    setGameQuestions(selectedQuestions)
    setCurrentQuestionIndex(0)
    setScore(0)
    setTimeLeft(difficultyLevels[difficulty].timePerQuestion)
    setGameState("playing")
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    setGameCompleted(false)
    setFeedbackMessage("")
    setShowAnimation(false)
  }

  // Handle timer
  useEffect(() => {
    if (gameState === "playing" && !isAnswerSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setIsAnswerSubmitted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [gameState, currentQuestionIndex, isAnswerSubmitted])

  // Handle answer selection
  const handleAnswerSelect = (answerId: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answerId)
    }
  }

  // Submit answer
  const handleAnswerSubmit = () => {
    if (!selectedAnswer || isAnswerSubmitted) return

    const currentQuestion = gameQuestions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    if (isCorrect) {
      // Calculate points based on time left and difficulty
      const timeBonus = Math.floor(timeLeft / 2)
      const pointsEarned = difficultyLevels[difficulty].pointsPerCorrect + timeBonus
      setScore((prev) => prev + pointsEarned)

      toast({
        title: "Correct!",
        description: `+${pointsEarned} points (${difficultyLevels[difficulty].pointsPerCorrect} base + ${timeBonus} time bonus)`,
        variant: "default",
      })
    } else {
      toast({
        title: "Incorrect",
        description: "The correct answer is highlighted in green.",
        variant: "destructive",
      })
    }

    setIsAnswerSubmitted(true)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  // Move to next question or end game
  const handleNextQuestion = () => {
    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswerSubmitted(false)
      setTimeLeft(difficultyLevels[difficulty].timePerQuestion)
    } else {
      // Game over
      setGameState("result")

      // Save score to database if user is logged in
      if (user) {
        saveScore()
      }

      // Trigger confetti for scores above threshold
      if (score > difficultyLevels[difficulty].pointsPerCorrect * 3) {
        triggerConfetti()
      }
    }
  }

  // Save score to database with better error handling
  const saveScore = useCallback(async () => {
    if (!user) return

    try {
      const { error } = await supabase.from("game_scores").insert([
        {
          user_id: user.id,
          username: user.email?.split("@")[0] || "Anonymous",
          score: score,
          difficulty: difficulty,
        },
      ])

      if (error) throw error

      toast({
        title: "Score saved!",
        description: "Your score has been added to the leaderboard.",
      })

      loadLeaderboard()
    } catch (error) {
      console.error("Error saving score:", error)
      toast({
        title: "Score Not Saved",
        description: "Unable to save your score. Please check your connection.",
        variant: "destructive",
      })
    }
  }, [user, score, difficulty, toast, loadLeaderboard])

  // Trigger confetti animation
  const triggerConfetti = () => {
    if (typeof window !== "undefined" && window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  // Get current question
  const currentQuestion = gameQuestions[currentQuestionIndex]

  // Render game menu
  const renderGameMenu = () => (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold flex items-center justify-center">
          <Heart className="h-8 w-8 text-red-500 mr-2" />
          First Aid Challenge
        </CardTitle>
        <CardDescription className="text-lg">Test your emergency response knowledge and save lives!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            Top Scores
          </h3>
          {isLoadingLeaderboard ? (
            <div className="text-center py-4">Loading leaderboard...</div>
          ) : leaderboardError ? (
            <div className="text-center py-4 text-muted-foreground">
              <p>{leaderboardError}</p>
              <Button variant="outline" size="sm" onClick={loadLeaderboard} className="mt-2 bg-transparent">
                Retry
              </Button>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div key={entry.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {index === 0 && <Crown className="h-4 w-4 text-yellow-500 mr-1" />}
                    {index === 1 && <Medal className="h-4 w-4 text-gray-400 mr-1" />}
                    {index === 2 && <Award className="h-4 w-4 text-amber-700 mr-1" />}
                    <span className="font-medium">{entry.username}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold">{entry.score}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {entry.difficulty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-muted-foreground">No scores yet. Be the first!</div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Select Difficulty:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant={difficulty === "easy" ? "default" : "outline"}
              className={`h-auto py-4 ${difficulty === "easy" ? "border-2 border-green-500" : ""}`}
              onClick={() => setDifficulty("easy")}
            >
              <div className="flex flex-col items-center">
                <span className="font-bold">Easy</span>
                <span className="text-xs mt-1">{difficultyLevels.easy.questions} questions</span>
                <span className="text-xs">{difficultyLevels.easy.timePerQuestion}s per question</span>
              </div>
            </Button>
            <Button
              variant={difficulty === "medium" ? "default" : "outline"}
              className={`h-auto py-4 ${difficulty === "medium" ? "border-2 border-yellow-500" : ""}`}
              onClick={() => setDifficulty("medium")}
            >
              <div className="flex flex-col items-center">
                <span className="font-bold">Medium</span>
                <span className="text-xs mt-1">{difficultyLevels.medium.questions} questions</span>
                <span className="text-xs">{difficultyLevels.medium.timePerQuestion}s per question</span>
              </div>
            </Button>
            <Button
              variant={difficulty === "hard" ? "default" : "outline"}
              className={`h-auto py-4 ${difficulty === "hard" ? "border-2 border-red-500" : ""}`}
              onClick={() => setDifficulty("hard")}
            >
              <div className="flex flex-col items-center">
                <span className="font-bold">Hard</span>
                <span className="text-xs mt-1">{difficultyLevels.hard.questions} questions</span>
                <span className="text-xs">{difficultyLevels.hard.timePerQuestion}s per question</span>
              </div>
            </Button>
          </div>
        </div>

        <div className="bg-primary/10 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            Why Play?
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <Zap className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
              Learn life-saving first aid skills that could help you save someone's life
            </li>
            <li className="flex items-start">
              <Zap className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
              Test your knowledge with Ethiopia-specific emergency scenarios
            </li>
            <li className="flex items-start">
              <Zap className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
              Compete with others and track your progress over time
            </li>
            <li className="flex items-start">
              <Zap className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
              Earn IDT tokens for high scores when logged in
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={startGame} className="w-full" size="lg">
          Start Game
        </Button>
      </CardFooter>
    </Card>
  )

  // Render game play
  const renderGamePlay = () => {
    if (!currentQuestion) return null

    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline">
              Question {currentQuestionIndex + 1}/{gameQuestions.length}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Score: {score}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm font-medium">{timeLeft}s remaining</span>
              </div>
              <Badge
                variant={difficulty === "easy" ? "secondary" : difficulty === "medium" ? "default" : "destructive"}
              >
                {difficulty}
              </Badge>
            </div>
            <Progress value={(timeLeft / difficultyLevels[difficulty].timePerQuestion) * 100} />
          </div>
          <CardTitle className="text-xl mt-4">{currentQuestion.scenario}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className={`h-auto py-3 px-4 justify-start text-left ${
                  selectedAnswer === option.id ? "border-2 border-primary" : ""
                } ${
                  isAnswerSubmitted && option.id === currentQuestion.correctAnswer
                    ? "bg-green-100 border-green-500 dark:bg-green-900/20"
                    : ""
                } ${
                  isAnswerSubmitted && selectedAnswer === option.id && option.id !== currentQuestion.correctAnswer
                    ? "bg-red-100 border-red-500 dark:bg-red-900/20"
                    : ""
                }`}
                onClick={() => handleAnswerSelect(option.id)}
                disabled={isAnswerSubmitted}
              >
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center mr-3 flex-shrink-0">
                    {option.id.toUpperCase()}
                  </div>
                  <span>{option.text}</span>
                </div>
              </Button>
            ))}
          </div>

          {isAnswerSubmitted && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-muted p-4 rounded-lg mt-4"
              >
                <h4 className="font-semibold mb-2">Explanation:</h4>
                <p>{currentQuestion.explanation}</p>
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isAnswerSubmitted ? (
            <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="w-full">
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="w-full">
              {currentQuestionIndex < gameQuestions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "See Results"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  // Render game results
  const renderGameResults = () => (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Game Complete!</CardTitle>
        <CardDescription>
          You scored {score} points on {difficulty} difficulty
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -top-2 -right-2 bg-primary text-white text-lg font-bold h-10 w-10 rounded-full flex items-center justify-center"
            >
              {score}
            </motion.div>
          </div>

          <h3 className="text-xl font-bold mt-2">
            {score > difficultyLevels[difficulty].pointsPerCorrect * (gameQuestions.length * 0.7)
              ? "Excellent! You're a first aid expert!"
              : score > difficultyLevels[difficulty].pointsPerCorrect * (gameQuestions.length * 0.4)
                ? "Good job! Keep practicing!"
                : "Nice try! Study up and try again!"}
          </h3>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Performance Summary:</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Difficulty:</span>
              <Badge
                variant={difficulty === "easy" ? "secondary" : difficulty === "medium" ? "default" : "destructive"}
              >
                {difficulty}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Total Questions:</span>
              <span className="font-medium">{gameQuestions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Points per Correct Answer:</span>
              <span className="font-medium">{difficultyLevels[difficulty].pointsPerCorrect} + time bonus</span>
            </div>
            <div className="flex justify-between">
              <span>Final Score:</span>
              <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>

        {user ? (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="mr-3 flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-400">Score Saved!</h4>
                <p className="text-sm text-green-700 dark:text-green-500">
                  Your score has been saved to the leaderboard as {username}.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="mr-3 flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-400">Sign in to save your score!</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-500">
                  Create an account or sign in to save your scores to the leaderboard and earn IDT tokens.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-primary/10 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">First Aid Tips:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <Zap className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
              Always ensure your safety first before helping others
            </li>
            <li className="flex items-start">
              <Zap className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
              Call emergency services early when in doubt
            </li>
            <li className="flex items-start">
              <Zap className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
              Learn CPR and basic first aid - it could save someone's life
            </li>
            <li className="flex items-start">
              <Zap className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
              Keep a first aid kit at home, in your car, and at work
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => setGameState("menu")} variant="outline" className="w-full">
          Back to Menu
        </Button>
        <Button onClick={startGame} className="w-full">
          <Repeat className="mr-2 h-4 w-4" />
          Play Again
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">First Aid Game</h2>
        <p className="text-muted-foreground">Test your emergency response skills and save lives!</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {gameState === "menu" && renderGameMenu()}
          {gameState === "playing" && renderGamePlay()}
          {gameState === "result" && renderGameResults()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
