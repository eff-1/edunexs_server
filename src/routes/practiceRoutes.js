import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import Question from '../models/Question.js'
import PracticeSession from '../models/PracticeSession.js'
import Exam from '../models/Exam.js'
import User from '../models/User.js'

const router = express.Router()

// Subject departments for different exams
const subjectDepartments = {
  'JAMB': {
    'Science': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language'],
    'Commercial': ['Mathematics', 'Economics', 'Accounting', 'Commerce', 'English Language'],
    'Art': ['Mathematics', 'Literature in English', 'Government', 'History', 'English Language']
  },
  'WAEC': {
    'Science': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language'],
    'Commercial': ['Mathematics', 'Economics', 'Accounting', 'Commerce', 'English Language'],
    'Art': ['Mathematics', 'Literature in English', 'Government', 'History', 'English Language']
  },
  'NECO': {
    'Science': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language'],
    'Commercial': ['Mathematics', 'Economics', 'Accounting', 'Commerce', 'English Language'],
    'Art': ['Mathematics', 'Literature in English', 'Government', 'History', 'English Language']
  },
  'WASSCE': {
    'Science': ['Core Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language'],
    'Commercial': ['Core Mathematics', 'Economics', 'Accounting', 'Business Management', 'English Language'],
    'Art': ['Core Mathematics', 'Literature', 'Government', 'History', 'English Language']
  },
  'GCSE': {
    'Science': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language'],
    'Business': ['Mathematics', 'Business Studies', 'Economics', 'Accounting', 'English Language'],
    'Humanities': ['Mathematics', 'English Literature', 'History', 'Geography', 'English Language']
  },
  'SAT': {
    'General': ['Evidence-Based Reading and Writing', 'Mathematics']
  },
  'ACT': {
    'General': ['English', 'Mathematics', 'Reading', 'Science']
  }
}

// @desc    Get available exams and departments
// @route   GET /api/practice/exams
// @access  Private
export const getAvailableExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true })
    
    const examOptions = exams.map(exam => ({
      code: exam.code,
      name: exam.name,
      country: exam.country,
      departments: subjectDepartments[exam.code] || {},
      subjects: exam.subjects
    }))

    res.json({
      success: true,
      data: examOptions
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Start practice session
// @route   POST /api/practice/start
// @access  Private
export const startPracticeSession = async (req, res) => {
  try {
    const { examCode, department, subjects, questionCount = 20, timeLimit = 1800 } = req.body

    if (!examCode || !department || !subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide exam code, department, and subjects'
      })
    }

    // Get questions for the selected subjects
    const questions = await Question.aggregate([
      {
        $match: {
          examCode,
          subject: { $in: subjects },
          isVerified: true
        }
      },
      { $sample: { size: questionCount } }
    ])

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found for the selected subjects'
      })
    }

    // Create practice session
    const practiceSession = new PracticeSession({
      user: req.user._id,
      examCode,
      subject: subjects.join(', '),
      sessionType: 'practice',
      questions: questions.map(q => ({
        questionId: q._id,
        correctAnswer: q.correctAnswer
      })),
      totalQuestions: questions.length,
      timeLimit,
      difficulty: 'Mixed',
      topics: [...new Set(questions.map(q => q.topic))]
    })

    await practiceSession.save()

    // Return questions without correct answers
    const questionsForClient = questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options.map(opt => ({
        label: opt.label,
        text: opt.text
      })),
      subject: q.subject,
      topic: q.topic,
      timeAllocation: q.timeAllocation
    }))

    res.json({
      success: true,
      data: {
        sessionId: practiceSession._id,
        questions: questionsForClient,
        timeLimit,
        totalQuestions: questions.length
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Submit practice session
// @route   POST /api/practice/submit/:sessionId
// @access  Private
export const submitPracticeSession = async (req, res) => {
  try {
    const { sessionId } = req.params
    const { answers } = req.body

    const session = await PracticeSession.findById(sessionId).populate('questions.questionId')
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Practice session not found'
      })
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    // Process answers
    session.questions.forEach((q, index) => {
      const userAnswer = answers[q.questionId._id]
      if (userAnswer) {
        q.userAnswer = userAnswer.answer
        q.timeSpent = userAnswer.timeSpent || 0
        q.isCorrect = userAnswer.answer === q.correctAnswer
        q.skipped = false
      } else {
        q.skipped = true
        q.isCorrect = false
      }
    })

    // Calculate performance
    session.calculatePerformance()
    await session.save()

    // Update user statistics
    await updateUserStats(req.user._id, session)

    // Update question statistics
    for (const q of session.questions) {
      if (q.questionId) {
        q.questionId.updateStatistics(q.isCorrect, q.timeSpent)
        await q.questionId.save()
      }
    }

    res.json({
      success: true,
      data: {
        sessionId: session._id,
        score: session.score,
        correctAnswers: session.correctAnswers,
        wrongAnswers: session.wrongAnswers,
        skippedQuestions: session.skippedQuestions,
        totalTimeSpent: session.totalTimeSpent,
        performance: session.performance,
        results: session.questions.map(q => ({
          questionId: q.questionId._id,
          questionText: q.questionId.questionText,
          userAnswer: q.userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect: q.isCorrect,
          explanation: q.questionId.explanation,
          topic: q.questionId.topic
        }))
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Get user practice statistics
// @route   GET /api/practice/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const sessions = await PracticeSession.find({ 
      user: req.user._id,
      isCompleted: true 
    }).sort({ createdAt: -1 })

    const totalSessions = sessions.length
    const totalQuestions = sessions.reduce((sum, s) => sum + s.totalQuestions, 0)
    const averageScore = totalSessions > 0 
      ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions)
      : 0

    // Calculate study streak
    const studyStreak = calculateStudyStreak(sessions)

    // Get recent sessions
    const recentSessions = sessions.slice(0, 5).map(s => ({
      _id: s._id,
      examCode: s.examCode,
      subject: s.subject,
      score: s.score,
      totalQuestions: s.totalQuestions,
      timeSpent: s.totalTimeSpent,
      completedAt: s.completedAt,
      difficulty: s.difficulty
    }))

    // Analyze weak and strong topics
    const topicAnalysis = analyzeTopics(sessions)

    res.json({
      success: true,
      data: {
        practiceSessionsCompleted: totalSessions,
        totalQuestionsAnswered: totalQuestions,
        averageScore,
        studyStreak,
        recentSessions,
        weakTopics: topicAnalysis.weak,
        strongTopics: topicAnalysis.strong
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Helper function to update user statistics
const updateUserStats = async (userId, session) => {
  // This could update user's overall performance metrics
  // For now, we'll keep it simple
}

// Helper function to calculate study streak
const calculateStudyStreak = (sessions) => {
  if (sessions.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Group sessions by date
  const sessionsByDate = {}
  sessions.forEach(session => {
    const date = new Date(session.completedAt)
    date.setHours(0, 0, 0, 0)
    const dateKey = date.getTime()
    sessionsByDate[dateKey] = true
  })

  // Count consecutive days from today backwards
  let currentDate = new Date(today)
  while (sessionsByDate[currentDate.getTime()]) {
    streak++
    currentDate.setDate(currentDate.getDate() - 1)
  }

  return streak
}

// Helper function to analyze topics
const analyzeTopics = (sessions) => {
  const topicScores = {}

  sessions.forEach(session => {
    session.questions?.forEach(q => {
      if (q.questionId?.topic) {
        const topic = q.questionId.topic
        if (!topicScores[topic]) {
          topicScores[topic] = { correct: 0, total: 0 }
        }
        topicScores[topic].total++
        if (q.isCorrect) {
          topicScores[topic].correct++
        }
      }
    })
  })

  const topics = Object.entries(topicScores)
    .map(([topic, scores]) => ({
      topic,
      accuracy: (scores.correct / scores.total) * 100
    }))
    .filter(t => t.accuracy > 0)

  const sorted = topics.sort((a, b) => b.accuracy - a.accuracy)
  
  return {
    strong: sorted.slice(0, 3).filter(t => t.accuracy >= 70).map(t => t.topic),
    weak: sorted.slice(-3).filter(t => t.accuracy < 60).map(t => t.topic)
  }
}

// Routes
router.get('/exams', protect, getAvailableExams)
router.post('/start', protect, startPracticeSession)
router.post('/submit/:sessionId', protect, submitPracticeSession)
router.get('/stats', protect, getUserStats)

export default router