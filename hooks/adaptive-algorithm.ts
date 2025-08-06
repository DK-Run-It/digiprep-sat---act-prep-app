import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useAuth } from "./auth-store";
import { useUserProfile } from "./user-profile-store";
import { SubjectArea, Question, QuestionDifficulty, TestType } from "@/types";

interface SubjectPerformance {
  subject: SubjectArea;
  correctRate: number;
  questionsAnswered: number;
  lastImprovement: string;
  level: QuestionDifficulty;
}

interface AdaptiveState {
  performances: SubjectPerformance[];
  recommendedSubjects: SubjectArea[];
  isLoading: boolean;
  error: string | null;
}

export const [AdaptiveProvider, useAdaptiveAlgorithm] = createContextHook(() => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [state, setState] = useState<AdaptiveState>({
    performances: [],
    recommendedSubjects: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (user) {
      loadPerformanceData();
    }
  }, [user]);

  const loadPerformanceData = async () => {
    if (!user) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const performanceJson = await AsyncStorage.getItem(`performance-${user.id}`);
      
      if (performanceJson) {
        const performances = JSON.parse(performanceJson);
        const recommended = calculateRecommendedSubjects(performances);
        
        setState({
          performances,
          recommendedSubjects: recommended,
          isLoading: false,
          error: null,
        });
      } else {
        // Initialize with default performance data for all subjects
        const defaultPerformances = initializePerformances();
        await AsyncStorage.setItem(
          `performance-${user.id}`,
          JSON.stringify(defaultPerformances)
        );
        
        setState({
          performances: defaultPerformances,
          recommendedSubjects: calculateRecommendedSubjects(defaultPerformances),
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Error loading performance data:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to load performance data",
      }));
    }
  };

  const initializePerformances = (): SubjectPerformance[] => {
    const subjects: SubjectArea[] = [
      "SAT_Reading",
      "SAT_Writing",
      "SAT_Math_No_Calc",
      "SAT_Math_Calc",
      "ACT_English",
      "ACT_Math",
      "ACT_Reading",
      "ACT_Science",
    ];
    
    return subjects.map(subject => ({
      subject,
      correctRate: 0,
      questionsAnswered: 0,
      lastImprovement: new Date().toISOString(),
      level: "medium",
    }));
  };

  const calculateRecommendedSubjects = (
    performances: SubjectPerformance[]
  ): SubjectArea[] => {
    // Filter to subjects with data
    const withData = performances.filter(p => p.questionsAnswered > 0);
    
    if (withData.length === 0) {
      // If no data, recommend all subjects
      return performances.map(p => p.subject);
    }
    
    // Sort by correct rate (ascending) to focus on weakest areas
    const sorted = [...withData].sort((a, b) => a.correctRate - b.correctRate);
    
    // Return the 3 weakest subjects
    return sorted.slice(0, 3).map(p => p.subject);
  };

  const updatePerformance = async (
    subject: SubjectArea,
    correct: boolean
  ) => {
    if (!user) return;
    
    try {
      const performances = [...state.performances];
      const index = performances.findIndex(p => p.subject === subject);
      
      if (index === -1) return;
      
      const performance = performances[index];
      const newQuestionsAnswered = performance.questionsAnswered + 1;
      const newCorrectCount = performance.correctRate * performance.questionsAnswered + (correct ? 1 : 0);
      const newCorrectRate = newCorrectCount / newQuestionsAnswered;
      
      // Update difficulty level based on performance
      let newLevel: QuestionDifficulty = performance.level;
      if (newCorrectRate > 0.8 && performance.questionsAnswered >= 5) {
        newLevel = "hard";
      } else if (newCorrectRate < 0.4 && performance.questionsAnswered >= 5) {
        newLevel = "easy";
      } else {
        newLevel = "medium";
      }
      
      performances[index] = {
        ...performance,
        correctRate: newCorrectRate,
        questionsAnswered: newQuestionsAnswered,
        lastImprovement: correct ? new Date().toISOString() : performance.lastImprovement,
        level: newLevel,
      };
      
      await AsyncStorage.setItem(
        `performance-${user.id}`,
        JSON.stringify(performances)
      );
      
      const recommendedSubjects = calculateRecommendedSubjects(performances);
      
      setState({
        performances,
        recommendedSubjects,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error updating performance:", error);
      setState(prev => ({
        ...prev,
        error: "Failed to update performance data",
      }));
    }
  };

  const getRecommendedQuestionDifficulty = (subject: SubjectArea): QuestionDifficulty => {
    const performance = state.performances.find(p => p.subject === subject);
    return performance?.level || "medium";
  };

  const getSubjectPerformance = (subject: SubjectArea): SubjectPerformance | undefined => {
    return state.performances.find(p => p.subject === subject);
  };

  const getWeakestSubjects = (testType: TestType, limit: number = 3): SubjectArea[] => {
    const filteredPerformances = state.performances.filter(p => 
      p.subject.startsWith(testType) && p.questionsAnswered > 0
    );
    
    if (filteredPerformances.length === 0) {
      // If no data for this test type, return all subjects for this test
      return state.performances
        .filter(p => p.subject.startsWith(testType))
        .slice(0, limit)
        .map(p => p.subject);
    }
    
    // Sort by correct rate (ascending)
    return filteredPerformances
      .sort((a, b) => a.correctRate - b.correctRate)
      .slice(0, limit)
      .map(p => p.subject);
  };

  return {
    performances: state.performances,
    recommendedSubjects: state.recommendedSubjects,
    isLoading: state.isLoading,
    error: state.error,
    updatePerformance,
    getRecommendedQuestionDifficulty,
    getSubjectPerformance,
    getWeakestSubjects,
  };
});