export type UserType = "student" | "parent" | "tutor";

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  createdAt: string;
  lastActive: string;
}

export interface UserProfile extends User {
  targetScore: {
    sat?: number;
    act?: number;
  };
  weakAreas: string[];
  completedTests: string[];
  completedPractice: string[];
  studyStreak: number;
  totalStudyTime: number;
}

export type TestType = "SAT" | "ACT";

export type SubjectArea = 
  | "SAT_Reading" 
  | "SAT_Writing" 
  | "SAT_Math_No_Calc" 
  | "SAT_Math_Calc"
  | "ACT_English"
  | "ACT_Math"
  | "ACT_Reading"
  | "ACT_Science";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  testType: TestType;
  subject: SubjectArea;
  difficulty: QuestionDifficulty;
  content: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topics: string[];
  imageUrl?: string;
}

export interface PracticeSession {
  id: string;
  userId: string;
  date: string;
  duration: number;
  subjectAreas: SubjectArea[];
  questions: {
    questionId: string;
    userAnswer: number | null;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  score: number;
  totalQuestions: number;
}

export interface FullTest {
  id: string;
  testType: TestType;
  name: string;
  sections: {
    subject: SubjectArea;
    duration: number;
    questions: string[];
  }[];
  totalDuration: number;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  date: string;
  completed: boolean;
  score: {
    overall: number;
    bySection: {
      [key in SubjectArea]?: {
        raw: number;
        scaled: number;
      };
    };
  };
  answers: {
    questionId: string;
    userAnswer: number | null;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  weakTopics: string[];
  duration: number;
}

export interface StudyPlan {
  id: string;
  userId: string;
  targetDate: string;
  targetScore: number;
  recommendedSessions: {
    date: string;
    duration: number;
    focus: SubjectArea[];
    completed: boolean;
  }[];
  progress: number;
}