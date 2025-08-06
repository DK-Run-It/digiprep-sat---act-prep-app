import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useAuth } from "./auth-store";
import { useUserProfile } from "./user-profile-store";
import { useAdaptiveAlgorithm } from "./adaptive-algorithm";
import { PracticeSession, SubjectArea, Question } from "@/types";

export const [PracticeProvider, usePractice] = createContextHook(() => {
  const { user } = useAuth();
  const { addCompletedPractice, addStudyTime } = useUserProfile();
  const { updatePerformance } = useAdaptiveAlgorithm();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const sessionsJson = await AsyncStorage.getItem(`practice-sessions-${user.id}`);
      
      if (sessionsJson) {
        setSessions(JSON.parse(sessionsJson));
      } else {
        setSessions([]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading practice sessions:", error);
      setError("Failed to load practice sessions");
      setIsLoading(false);
    }
  };

  const startSession = (
    subjectAreas: SubjectArea[],
    questions: Question[]
  ): PracticeSession => {
    if (!user) {
      throw new Error("User must be logged in to start a practice session");
    }
    
    const session: PracticeSession = {
      id: `practice-${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString(),
      duration: 0,
      subjectAreas,
      questions: questions.map(q => ({
        questionId: q.id,
        userAnswer: null,
        isCorrect: false,
        timeSpent: 0,
      })),
      score: 0,
      totalQuestions: questions.length,
    };
    
    setCurrentSession(session);
    return session;
  };

  const answerQuestion = (
    questionIndex: number,
    answer: number,
    timeSpent: number,
    isCorrect: boolean
  ) => {
    if (!currentSession) return;
    
    const updatedQuestions = [...currentSession.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      userAnswer: answer,
      isCorrect,
      timeSpent,
    };
    
    const correctCount = updatedQuestions.filter(q => q.isCorrect).length;
    const score = Math.round((correctCount / updatedQuestions.length) * 100);
    
    setCurrentSession({
      ...currentSession,
      questions: updatedQuestions,
      score,
    });
  };

  const finishSession = async (totalDuration: number) => {
    if (!currentSession || !user) return null;
    
    try {
      const finishedSession: PracticeSession = {
        ...currentSession,
        duration: totalDuration,
      };
      
      const updatedSessions = [...sessions, finishedSession];
      
      await AsyncStorage.setItem(
        `practice-sessions-${user.id}`,
        JSON.stringify(updatedSessions)
      );
      
      setSessions(updatedSessions);
      
      // Update user profile
      await addCompletedPractice(finishedSession.id);
      await addStudyTime(Math.ceil(totalDuration / 60));
      
      // Update adaptive algorithm with results
      for (const question of finishedSession.questions) {
        if (question.userAnswer !== null) {
          // Find the subject for this question
          const subjectArea = finishedSession.subjectAreas[0]; // Simplified - in real app would get from question
          await updatePerformance(subjectArea, question.isCorrect);
        }
      }
      
      setCurrentSession(null);
      return finishedSession;
    } catch (error) {
      console.error("Error finishing practice session:", error);
      setError("Failed to save practice session");
      return null;
    }
  };

  const getSessionById = (id: string): PracticeSession | undefined => {
    return sessions.find(s => s.id === id);
  };

  const getRecentSessions = (limit: number = 5): PracticeSession[] => {
    return [...sessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getSessionsBySubject = (subject: SubjectArea): PracticeSession[] => {
    return sessions.filter(s => s.subjectAreas.includes(subject));
  };

  const getAverageScore = (): number => {
    if (sessions.length === 0) return 0;
    const sum = sessions.reduce((total, session) => total + session.score, 0);
    return Math.round(sum / sessions.length);
  };

  const getTotalPracticeTime = (): number => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  return {
    sessions,
    currentSession,
    isLoading,
    error,
    startSession,
    answerQuestion,
    finishSession,
    getSessionById,
    getRecentSessions,
    getSessionsBySubject,
    getAverageScore,
    getTotalPracticeTime,
  };
});