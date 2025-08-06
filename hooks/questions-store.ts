import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useAuth } from "./auth-store";
import { useAdaptiveAlgorithm } from "./adaptive-algorithm";
import { Question, SubjectArea, QuestionDifficulty, TestType } from "@/types";
import { mockQuestions } from "@/mocks/questions";

export const [QuestionsProvider, useQuestions] = createContextHook(() => {
  const { user } = useAuth();
  const { getRecommendedQuestionDifficulty } = useAdaptiveAlgorithm();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // For this demo, we'll use mock data
      setQuestions(mockQuestions);
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading questions:", error);
      setError("Failed to load questions");
      setIsLoading(false);
    }
  };

  const getQuestionsBySubject = (subject: SubjectArea): Question[] => {
    return questions.filter(q => q.subject === subject);
  };

  const getQuestionsByTestType = (testType: TestType): Question[] => {
    return questions.filter(q => q.testType === testType);
  };

  const getQuestionsByDifficulty = (difficulty: QuestionDifficulty): Question[] => {
    return questions.filter(q => q.difficulty === difficulty);
  };

  const getQuestionById = (id: string): Question | undefined => {
    return questions.find(q => q.id === id);
  };

  const getAdaptiveQuestions = (
    subject: SubjectArea,
    count: number = 10
  ): Question[] => {
    const difficulty = getRecommendedQuestionDifficulty(subject);
    const subjectQuestions = getQuestionsBySubject(subject);
    
    // Filter by recommended difficulty
    let filteredQuestions = subjectQuestions.filter(
      q => q.difficulty === difficulty
    );
    
    // If not enough questions at the recommended difficulty, add questions from other difficulties
    if (filteredQuestions.length < count) {
      const otherQuestions = subjectQuestions.filter(
        q => q.difficulty !== difficulty
      );
      filteredQuestions = [...filteredQuestions, ...otherQuestions];
    }
    
    // Shuffle and limit to requested count
    return shuffleArray(filteredQuestions).slice(0, count);
  };

  const getQuestionsByTopic = (topic: string): Question[] => {
    return questions.filter(q => q.topics.includes(topic));
  };

  // Helper function to shuffle an array
  const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  return {
    questions,
    isLoading,
    error,
    getQuestionsBySubject,
    getQuestionsByTestType,
    getQuestionsByDifficulty,
    getQuestionById,
    getAdaptiveQuestions,
    getQuestionsByTopic,
  };
});