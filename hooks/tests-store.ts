import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useAuth } from "./auth-store";
import { useUserProfile } from "./user-profile-store";
import { FullTest, TestResult, SubjectArea, TestType } from "@/types";
import { mockTests } from "@/mocks/tests";

export const [TestsProvider, useTests] = createContextHook(() => {
  const { user } = useAuth();
  const { addCompletedTest, addStudyTime } = useUserProfile();
  const [tests, setTests] = useState<FullTest[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<{
    test: FullTest;
    result: TestResult;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTests();
    if (user) {
      loadResults();
    }
  }, [user]);

  const loadTests = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      // For this demo, we'll use mock data
      setTests(mockTests);
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading tests:", error);
      setError("Failed to load tests");
      setIsLoading(false);
    }
  };

  const loadResults = async () => {
    if (!user) return;
    
    try {
      const resultsJson = await AsyncStorage.getItem(`test-results-${user.id}`);
      
      if (resultsJson) {
        setResults(JSON.parse(resultsJson));
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error loading test results:", error);
      setError("Failed to load test results");
    }
  };

  const startTest = (testId: string): { test: FullTest; result: TestResult } | null => {
    if (!user) {
      setError("User must be logged in to start a test");
      return null;
    }
    
    const test = tests.find(t => t.id === testId);
    
    if (!test) {
      setError("Test not found");
      return null;
    }
    
    // Create a new result object
    const result: TestResult = {
      id: `result-${Date.now()}`,
      userId: user.id,
      testId,
      date: new Date().toISOString(),
      completed: false,
      score: {
        overall: 0,
        bySection: {},
      },
      answers: [],
      weakTopics: [],
      duration: 0,
    };
    
    const testSession = { test, result };
    setCurrentTest(testSession);
    return testSession;
  };

  const answerQuestion = (
    sectionIndex: number,
    questionIndex: number,
    questionId: string,
    answer: number | null,
    isCorrect: boolean,
    timeSpent: number
  ) => {
    if (!currentTest) return;
    
    const updatedResult = { ...currentTest.result };
    
    // Add or update the answer
    const existingAnswerIndex = updatedResult.answers.findIndex(
      a => a.questionId === questionId
    );
    
    if (existingAnswerIndex >= 0) {
      updatedResult.answers[existingAnswerIndex] = {
        questionId,
        userAnswer: answer,
        isCorrect,
        timeSpent,
      };
    } else {
      updatedResult.answers.push({
        questionId,
        userAnswer: answer,
        isCorrect,
        timeSpent,
      });
    }
    
    setCurrentTest({
      ...currentTest,
      result: updatedResult,
    });
  };

  const finishTest = async (totalDuration: number): Promise<TestResult | null> => {
    if (!currentTest || !user) return null;
    
    try {
      // Calculate scores
      const { test, result } = currentTest;
      const sectionScores: { [key in SubjectArea]?: { raw: number; scaled: number } } = {};
      
      // Simple scoring algorithm - in a real app this would be more sophisticated
      test.sections.forEach(section => {
        const sectionAnswers = result.answers.filter(a => 
          section.questions.includes(a.questionId)
        );
        
        const correctCount = sectionAnswers.filter(a => a.isCorrect).length;
        const totalQuestions = section.questions.length;
        const rawScore = correctCount;
        
        // Simple scaled score calculation (would be more complex in real app)
        const scaledScore = Math.round((correctCount / totalQuestions) * 200 + 200);
        
        sectionScores[section.subject] = {
          raw: rawScore,
          scaled: scaledScore,
        };
      });
      
      // Calculate overall score
      const totalScaled = Object.values(sectionScores).reduce(
        (sum, score) => sum + (score?.scaled || 0),
        0
      );
      const overallScore = Math.round(totalScaled / Object.keys(sectionScores).length);
      
      // Identify weak topics (simplified)
      const weakTopics: string[] = [];
      // In a real app, this would analyze answers to identify specific weak topics
      
      const completedResult: TestResult = {
        ...result,
        completed: true,
        score: {
          overall: overallScore,
          bySection: sectionScores,
        },
        weakTopics,
        duration: totalDuration,
      };
      
      const updatedResults = [...results, completedResult];
      
      await AsyncStorage.setItem(
        `test-results-${user.id}`,
        JSON.stringify(updatedResults)
      );
      
      setResults(updatedResults);
      setCurrentTest(null);
      
      // Update user profile
      await addCompletedTest(test.id);
      await addStudyTime(Math.ceil(totalDuration / 60));
      
      return completedResult;
    } catch (error) {
      console.error("Error finishing test:", error);
      setError("Failed to save test results");
      return null;
    }
  };

  const getTestById = (id: string): FullTest | undefined => {
    return tests.find(t => t.id === id);
  };

  const getResultById = (id: string): TestResult | undefined => {
    return results.find(r => r.id === id);
  };

  const getResultsForTest = (testId: string): TestResult[] => {
    return results.filter(r => r.testId === testId);
  };

  const getTestsByType = (testType: TestType): FullTest[] => {
    return tests.filter(t => t.testType === testType);
  };

  const getRecentResults = (limit: number = 5): TestResult[] => {
    return [...results]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getHighestScore = (testType: TestType): number => {
    const typeResults = results.filter(r => {
      const test = tests.find(t => t.id === r.testId);
      return test?.testType === testType && r.completed;
    });
    
    if (typeResults.length === 0) return 0;
    
    return Math.max(...typeResults.map(r => r.score.overall));
  };

  return {
    tests,
    results,
    currentTest,
    isLoading,
    error,
    startTest,
    answerQuestion,
    finishTest,
    getTestById,
    getResultById,
    getResultsForTest,
    getTestsByType,
    getRecentResults,
    getHighestScore,
  };
});