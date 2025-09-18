import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Question from '../models/Question.js'

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('📦 MongoDB Connected for adding questions')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

const moreQuestions = [
  // JAMB Mathematics - Science Department
  {
    examCode: 'JAMB',
    subject: 'Mathematics',
    year: 2024,
    questionText: 'Find the value of x in the equation 3x + 7 = 22',
    questionType: 'multiple-choice',
    options: [
      { label: 'A', text: '3', isCorrect: false },
      { label: 'B', text: '5', isCorrect: true },
      { label: 'C', text: '7', isCorrect: false },
      { label: 'D', text: '9', isCorrect: false }
    ],
    correctAnswer: 'B',
    explanation: '3x + 7 = 22, so 3x = 15, therefore x = 5',
    difficulty: 'Easy',
    topic: 'Linear Equations',
    subtopic: 'Simple Equations',
    points: 1,
    timeAllocation: 60,
    source: 'JAMB 2024 Practice',
    isVerified: true,
    tags: ['algebra', 'equations']
  },
  {
    examCode: 'JAMB',
    subject: 'Physics',
    year: 2024,
    questionText: 'What is the SI unit of force?',
    questionType: 'multiple-choice',
    options: [
      { label: 'A', text: 'Joule', isCorrect: false },
      { label: 'B', text: 'Newton', isCorrect: true },
      { label: 'C', text: 'Watt', isCorrect: false },
      { label: 'D', text: 'Pascal', isCorrect: false }
    ],
    correctAnswer: 'B',
    explanation: 'The SI unit of force is Newton (N), named after Sir Isaac Newton',
    difficulty: 'Easy',
    topic: 'Units and Measurements',
    subtopic: 'SI Units',
    points: 1,
    timeAllocation: 45,
    source: 'JAMB 2024 Practice',
    isVerified: true,
    tags: ['units', 'measurements']
  },
  {
    examCode: 'JAMB',
    subject: 'Chemistry',
    year: 2024,
    questionText: 'What is the atomic number of Carbon?',
    questionType: 'multiple-choice',
    options: [
      { label: 'A', text: '4', isCorrect: false },
      { label: 'B', text: '6', isCorrect: true },
      { label: 'C', text: '8', isCorrect: false },
      { label: 'D', text: '12', isCorrect: false }
    ],
    correctAnswer: 'B',
    explanation: 'Carbon has 6 protons, so its atomic number is 6',
    difficulty: 'Easy',
    topic: 'Atomic Structure',
    subtopic: 'Atomic Number',
    points: 1,
    timeAllocation: 45,
    source: 'JAMB 2024 Practice',
    isVerified: true,
    tags: ['atoms', 'periodic table']
  },
  {
    examCode: 'JAMB',
    subject: 'Biology',
    year: 2024,
    questionText: 'Which organelle is known as the powerhouse of the cell?',
    questionType: 'multiple-choice',
    options: [
      { label: 'A', text: 'Nucleus', isCorrect: false },
      { label: 'B', text: 'Ribosome', isCorrect: false },
      { label: 'C', text: 'Mitochondria', isCorrect: true },
      { label: 'D', text: 'Chloroplast', isCorrect: false }
    ],
    correctAnswer: 'C',
    explanation: 'Mitochondria produces ATP (energy) for the cell, hence called the powerhouse',
    difficulty: 'Easy',
    topic: 'Cell Biology',
    subtopic: 'Cell Organelles',
    points: 1,
    timeAllocation: 60,
    source: 'JAMB 2024 Practice',
    isVerified: true,
    tags: ['cell', 'organelles']
  },
  {
    examCode: 'JAMB',
    subject: 'English Language',
    year: 2024,
    questionText: 'Choose the correct spelling:',
    questionType: 'multiple-choice',
    options: [
      { label: 'A', text: 'Recieve', isCorrect: false },
      { label: 'B', text: 'Receive', isCorrect: true },
      { label: 'C', text: 'Receve', isCorrect: false },
      { label: 'D', text: 'Receeve', isCorrect: false }
    ],
    correctAnswer: 'B',
    explanation: 'The correct spelling is "Receive" - remember "i before e except after c"',
    difficulty: 'Easy',
    topic: 'Spelling',
    subtopic: 'Common Words',
    points: 1,
    timeAllocation: 30,
    source: 'JAMB 2024 Practice',
    isVerified: true,
    tags: ['spelling', 'grammar']
  },

  // JAMB Commercial Department
  {
    examCode: 'JAMB',
    subject: 'Economics',
    year: 2024,
    questionText: 'What is the basic economic problem?',
    questionType: 'multiple-choice',
    options: [
      { label: 'A', text: 'Inflation', isCorrect: false },
      { label: 'B', text: 'Unemployment', isCorrect: false },
      { label: 'C', text: 'Scarcity', isCorrect: true },
      { label: 'D', text: 'Poverty', isCorrect: false }
    ],
    correctAnswer: 'C',
    explanation: 'Scarcity is the fundamental economic problem - unlimited wants but limited resources',
    difficulty: 'Easy',
    topic: 'Basic Economic Concepts',
    subtopic: 'Economic Problems',
    points: 1,
    timeAllocation: 60,
    source: 'JAMB 2024 Practice',
    isVerified: true,
    tags: ['economics', 'scarcity']
  },
  {
    examCode: 'JAMB',
    subject: 'Accounting',
    year: 2024,
    questionText: 'Which of the following is an asset?',
    questionType: 'multiple-choice',
    options: [
      { label: 'A', text: 'Loan', isCorrect: false },
      { label: 'B', text: 'Cash', isCorrect: true },
      { label: 'C', text: 'Capital', isCorrect: false },
      { label: 'D', text: 'Creditors', isCorrect: false }
    ],
    correctAnswer: 'B',
    explanation: 'Cash is an asset - something owned by the business that has value',
    difficulty: 'Easy',
    topic: 'Basic Accounting',
    subtopic: 'Assets and Liabilities',
    points: 1,
    timeAllocation: 45,
    source: 'JAMB 2024 Practice',
    isVerified: true,
    tags: ['accounting', 'assets']
  },

  // JAMB Arts Department
  {
    examCode: 'JAMB',
    subject: 'Literature in English',
    year: 2024,
    questionText: 'Who wrote the novel "Things Fall Apart"?',
    questionType: 'multiple-choice',
    options: [
      { label: 'A', text: 'Wole Soyinka', isCorrect: false },
      { label: 'B', text: 'Chinua Achebe', isCorrect: true },
      { label: 'C', text: 'Cyprian Ekwensi', isCorrect: false },
      { label: 'D', text: 'Amos Tutuola', isCorrect: false }
    ],
    correctAnswer: 'B',
    explanation: 'Chinua Achebe wrote "Things Fall Apart" in 1958',
    difficulty: 'Easy',
    topic: 'African Literature',
    subtopic: 'Nigerian Authors',
    points: 1,
    timeAllocation: 45,
    source: 'JAMB 2024 Practice',
    isVerified: true,
    tags: ['literature', 'african authors']
  },
  {
    examCode: 'JAMB',
    subject: 'Government',
    year: 2024,
    questionText: 'What is democracy?',
    questionType: 'multiple-choice',
    options: [
      { label: 'A', text: 'Rule by the military', isCorrect: false },
      { label: 'B', text: 'Rule by the people', isCorrect: true },
      { label: 'C', text: 'Rule by one person', isCorrect: false },
      { label: 'D', text: 'Rule by the rich', isCorrect: false }
    ],
    correctAnswer: 'B',
    explanation: 'Democracy means government by the people, for the people',
    difficulty: 'Easy',
    topic: 'Forms of Government',
    subtopic: 'Democracy',
    points: 1,
    timeAllocation: 45,
    source: 'JAMB 2024 Practice',
    isVerified: true,
    tags: ['government', 'democracy']
  },

  // WAEC Questions
  {
    examCode: 'WAEC',
    subject: 'Mathematics',
    year: 2024,
    questionText: 'Simplify: 2x + 3x - x',
    questionType: 'multiple-choice',
    options: [
      { label: 'A', text: '4x', isCorrect: true },
      { label: 'B', text: '5x', isCorrect: false },
      { label: 'C', text: '6x', isCorrect: false },
      { label: 'D', text: '3x', isCorrect: false }
    ],
    correctAnswer: 'A',
    explanation: '2x + 3x - x = 5x - x = 4x',
    difficulty: 'Easy',
    topic: 'Algebra',
    subtopic: 'Simplification',
    points: 1,
    timeAllocation: 60,
    source: 'WAEC 2024 Practice',
    isVerified: true,
    tags: ['algebra', 'simplification']
  }
]

const addQuestions = async () => {
  try {
    await connectDB()

    console.log('📝 Adding more practice questions...')
    const insertedQuestions = await Question.insertMany(moreQuestions)
    console.log(`✅ Added ${insertedQuestions.length} new questions`)

    console.log('🎉 Questions added successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Adding questions failed:', error)
    process.exit(1)
  }
}

addQuestions()