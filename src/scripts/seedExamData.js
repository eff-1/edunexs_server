import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Exam from '../models/Exam.js'
import Question from '../models/Question.js'
import User from '../models/User.js'

dotenv.config()

const examData = [
  // Nigeria
  {
    name: 'Joint Admissions and Matriculation Board',
    code: 'JAMB',
    country: 'Nigeria',
    description: 'Unified Tertiary Matriculation Examination (UTME) for admission into Nigerian universities',
    subjects: [
      { name: 'Mathematics', code: 'MTH', duration: 60, totalQuestions: 40 },
      { name: 'English Language', code: 'ENG', duration: 60, totalQuestions: 40 },
      { name: 'Physics', code: 'PHY', duration: 60, totalQuestions: 40 },
      { name: 'Chemistry', code: 'CHE', duration: 60, totalQuestions: 40 },
      { name: 'Biology', code: 'BIO', duration: 60, totalQuestions: 40 },
      { name: 'Economics', code: 'ECO', duration: 60, totalQuestions: 40 },
      { name: 'Government', code: 'GOV', duration: 60, totalQuestions: 40 },
      { name: 'Literature in English', code: 'LIT', duration: 60, totalQuestions: 40 }
    ],
    examType: 'CBT',
    duration: 180, // 3 hours
    passingScore: 50,
    examBody: 'JAMB',
    officialWebsite: 'https://www.jamb.gov.ng'
  },
  {
    name: 'West African Examinations Council',
    code: 'WAEC',
    country: 'Nigeria',
    description: 'West African Senior School Certificate Examination (WASSCE)',
    subjects: [
      { name: 'Mathematics', code: 'MTH', duration: 180, totalQuestions: 50 },
      { name: 'English Language', code: 'ENG', duration: 180, totalQuestions: 50 },
      { name: 'Physics', code: 'PHY', duration: 180, totalQuestions: 50 },
      { name: 'Chemistry', code: 'CHE', duration: 180, totalQuestions: 50 },
      { name: 'Biology', code: 'BIO', duration: 180, totalQuestions: 50 }
    ],
    examType: 'Both',
    duration: 180,
    passingScore: 50,
    examBody: 'WAEC',
    officialWebsite: 'https://www.waecnigeria.org'
  },
  {
    name: 'National Examinations Council',
    code: 'NECO',
    country: 'Nigeria',
    description: 'Senior Secondary Certificate Examination (SSCE)',
    subjects: [
      { name: 'Mathematics', code: 'MTH', duration: 180, totalQuestions: 50 },
      { name: 'English Language', code: 'ENG', duration: 180, totalQuestions: 50 },
      { name: 'Physics', code: 'PHY', duration: 180, totalQuestions: 50 },
      { name: 'Chemistry', code: 'CHE', duration: 180, totalQuestions: 50 }
    ],
    examType: 'Both',
    duration: 180,
    passingScore: 50,
    examBody: 'NECO',
    officialWebsite: 'https://www.neco.gov.ng'
  },

  // Ghana
  {
    name: 'West African Senior School Certificate Examination',
    code: 'WASSCE',
    country: 'Ghana',
    description: 'West African Senior School Certificate Examination for Ghana',
    subjects: [
      { name: 'Core Mathematics', code: 'MTH', duration: 180, totalQuestions: 50 },
      { name: 'English Language', code: 'ENG', duration: 180, totalQuestions: 50 },
      { name: 'Integrated Science', code: 'SCI', duration: 180, totalQuestions: 50 },
      { name: 'Social Studies', code: 'SOC', duration: 180, totalQuestions: 50 }
    ],
    examType: 'Both',
    duration: 180,
    passingScore: 50,
    examBody: 'WAEC Ghana',
    officialWebsite: 'https://www.waecgh.org'
  },
  {
    name: 'Basic Education Certificate Examination',
    code: 'BECE',
    country: 'Ghana',
    description: 'Basic Education Certificate Examination for Junior High School completion',
    subjects: [
      { name: 'Mathematics', code: 'MTH', duration: 120, totalQuestions: 40 },
      { name: 'English Language', code: 'ENG', duration: 120, totalQuestions: 40 },
      { name: 'Integrated Science', code: 'SCI', duration: 120, totalQuestions: 40 },
      { name: 'Social Studies', code: 'SOC', duration: 120, totalQuestions: 40 }
    ],
    examType: 'Both',
    duration: 120,
    passingScore: 50,
    examBody: 'WAEC Ghana',
    officialWebsite: 'https://www.waecgh.org'
  },

  // United Kingdom
  {
    name: 'General Certificate of Secondary Education',
    code: 'GCSE',
    country: 'United Kingdom',
    description: 'General Certificate of Secondary Education for students aged 14-16',
    subjects: [
      { name: 'Mathematics', code: 'MTH', duration: 90, totalQuestions: 30 },
      { name: 'English Language', code: 'ENG', duration: 105, totalQuestions: 40 },
      { name: 'English Literature', code: 'LIT', duration: 105, totalQuestions: 30 },
      { name: 'Physics', code: 'PHY', duration: 105, totalQuestions: 35 },
      { name: 'Chemistry', code: 'CHE', duration: 105, totalQuestions: 35 },
      { name: 'Biology', code: 'BIO', duration: 105, totalQuestions: 35 }
    ],
    examType: 'Both',
    duration: 105,
    passingScore: 40,
    examBody: 'Various (AQA, Edexcel, OCR)',
    officialWebsite: 'https://www.gov.uk/what-different-qualification-levels-mean'
  },
  {
    name: 'Advanced Level',
    code: 'A-LEVEL',
    country: 'United Kingdom',
    description: 'Advanced Level qualifications for students aged 16-18',
    subjects: [
      { name: 'Mathematics', code: 'MTH', duration: 120, totalQuestions: 40 },
      { name: 'Further Mathematics', code: 'FMT', duration: 120, totalQuestions: 40 },
      { name: 'Physics', code: 'PHY', duration: 120, totalQuestions: 40 },
      { name: 'Chemistry', code: 'CHE', duration: 120, totalQuestions: 40 },
      { name: 'Biology', code: 'BIO', duration: 120, totalQuestions: 40 }
    ],
    examType: 'Both',
    duration: 120,
    passingScore: 40,
    examBody: 'Various (AQA, Edexcel, OCR)',
    officialWebsite: 'https://www.gov.uk/what-different-qualification-levels-mean'
  },

  // United States
  {
    name: 'Scholastic Assessment Test',
    code: 'SAT',
    country: 'United States',
    description: 'Standardized test for college admissions in the United States',
    subjects: [
      { name: 'Evidence-Based Reading and Writing', code: 'ERW', duration: 65, totalQuestions: 52 },
      { name: 'Mathematics', code: 'MTH', duration: 80, totalQuestions: 58 }
    ],
    examType: 'Both',
    duration: 180, // 3 hours
    passingScore: 50,
    examBody: 'College Board',
    officialWebsite: 'https://www.collegeboard.org'
  },
  {
    name: 'American College Testing',
    code: 'ACT',
    country: 'United States',
    description: 'Standardized test for college admissions in the United States',
    subjects: [
      { name: 'English', code: 'ENG', duration: 45, totalQuestions: 75 },
      { name: 'Mathematics', code: 'MTH', duration: 60, totalQuestions: 60 },
      { name: 'Reading', code: 'REA', duration: 35, totalQuestions: 40 },
      { name: 'Science', code: 'SCI', duration: 35, totalQuestions: 40 }
    ],
    examType: 'Both',
    duration: 175,
    passingScore: 50,
    examBody: 'ACT Inc.',
    officialWebsite: 'https://www.act.org'
  }
]

// Sample questions for JAMB Mathematics
const sampleQuestions = [
  {
    examCode: 'JAMB',
    subject: 'Mathematics',
    year: 2024,
    questionText: 'If 2x + 3y = 12 and x - y = 1, find the value of x.',
    questionType: 'multiple-choice',
    options: [
      { label: 'A', text: '2', isCorrect: false },
      { label: 'B', text: '3', isCorrect: true },
      { label: 'C', text: '4', isCorrect: false },
      { label: 'D', text: '5', isCorrect: false }
    ],
    correctAnswer: 'B',
    explanation: 'From x - y = 1, we get x = y + 1. Substituting into 2x + 3y = 12: 2(y + 1) + 3y = 12, which gives 5y = 10, so y = 2 and x = 3.',
    difficulty: 'Medium',
    topic: 'Simultaneous Equations',
    subtopic: 'Linear Equations',
    points: 1,
    timeAllocation: 90,
    source: 'JAMB 2024 Practice',
    isVerified: true,
    tags: ['algebra', 'equations']
  },
  {
    examCode: 'JAMB',
    subject: 'Mathematics',
    year: 2024,
    questionText: 'What is the value of log₂ 8?',
    questionType: 'multiple-choice',
    options: [
      { label: 'A', text: '2', isCorrect: false },
      { label: 'B', text: '3', isCorrect: true },
      { label: 'C', text: '4', isCorrect: false },
      { label: 'D', text: '8', isCorrect: false }
    ],
    correctAnswer: 'B',
    explanation: 'log₂ 8 = log₂ 2³ = 3',
    difficulty: 'Easy',
    topic: 'Logarithms',
    subtopic: 'Basic Logarithms',
    points: 1,
    timeAllocation: 60,
    source: 'JAMB 2024 Practice',
    isVerified: true,
    tags: ['logarithms', 'indices']
  }
]

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('📦 MongoDB Connected for seeding')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

const seedData = async () => {
  try {
    await connectDB()

    // Clear existing data
    console.log('🗑️  Clearing existing exam data...')
    await Exam.deleteMany({})
    await Question.deleteMany({})

    // Insert exam data
    console.log('📝 Inserting exam data...')
    const insertedExams = await Exam.insertMany(examData)
    console.log(`✅ Inserted ${insertedExams.length} exams`)

    // Insert sample questions
    console.log('❓ Inserting sample questions...')
    const insertedQuestions = await Question.insertMany(sampleQuestions)
    console.log(`✅ Inserted ${insertedQuestions.length} sample questions`)

    // Create sample admin user
    const adminExists = await User.findOne({ email: 'admin@edunexs.com' })
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@edunexs.com',
        password: 'admin123',
        role: 'admin',
        country: 'Nigeria',
        academicLevel: 'University',
        isEmailVerified: true
      })
      await adminUser.save()
      console.log('✅ Created admin user: admin@edunexs.com / admin123')
    }

    // Create sample student user
    const studentExists = await User.findOne({ email: 'student@demo.com' })
    if (!studentExists) {
      const studentUser = new User({
        name: 'Demo Student',
        email: 'student@demo.com',
        password: 'demo123',
        role: 'student',
        country: 'Nigeria',
        academicLevel: 'Secondary',
        targetExams: [
          {
            examCode: 'JAMB',
            subjects: ['Mathematics', 'Physics', 'Chemistry', 'English Language'],
            targetYear: 2024,
            priority: 'high'
          }
        ],
        isEmailVerified: true
      })
      await studentUser.save()
      console.log('✅ Created student user: student@demo.com / demo123')
    }

    console.log('🎉 Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedData()