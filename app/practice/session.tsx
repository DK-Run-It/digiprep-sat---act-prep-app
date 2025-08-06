import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft, ArrowRight, X } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { usePractice } from "@/hooks/practice-store";
import { useQuestions } from "@/hooks/questions-store";
import { QuestionCard } from "@/components/QuestionCard";
import { Timer } from "@/components/Timer";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";

export default function PracticeSessionScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { currentSession, answerQuestion, finishSession } = usePractice();
  const { getQuestionById } = useQuestions();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!currentSession) {
      Alert.alert(
        "Session Error",
        "Could not find the practice session. Please try again.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/practice"),
          },
        ]
      );
      return;
    }
    
    // Reset question start time when changing questions
    setQuestionStartTime(Date.now());
    
    // Reset UI state when changing questions
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    // Scroll to top when changing questions
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [currentQuestionIndex, currentSession]);

  useEffect(() => {
    // Handle back button press
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    
    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    Alert.alert(
      "Exit Practice",
      "Are you sure you want to exit? Your progress will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Exit",
          style: "destructive",
          onPress: () => router.replace("/practice"),
        },
      ]
    );
    return true;
  };

  const handleSelectAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (!currentSession) return;
    
    // Calculate time spent on this question
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    
    // Get the current question
    const questionId = currentSession.questions[currentQuestionIndex].questionId;
    const question = getQuestionById(questionId);
    
    if (!question) return;
    
    // Check if the answer is correct
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    // Save the answer
    answerQuestion(currentQuestionIndex, selectedAnswer || 0, timeSpent, isCorrect);
    
    // Update session time
    setSessionTime(prev => prev + timeSpent);
    
    // If showing explanation, move to next question
    if (showExplanation) {
      if (currentQuestionIndex < currentSession.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        handleFinishSession();
      }
    } else {
      // Show explanation
      setShowExplanation(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinishSession = async () => {
    if (!currentSession) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate time spent on last question if not already recorded
      let finalSessionTime = sessionTime;
      if (!showExplanation) {
        const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
        finalSessionTime += timeSpent;
        
        // Save the answer for the last question
        const questionId = currentSession.questions[currentQuestionIndex].questionId;
        const question = getQuestionById(questionId);
        
        if (question && selectedAnswer !== null) {
          const isCorrect = selectedAnswer === question.correctAnswer;
          answerQuestion(currentQuestionIndex, selectedAnswer, timeSpent, isCorrect);
        }
      }
      
      // Finish the session
      const result = await finishSession(finalSessionTime);
      
      if (result) {
        router.replace({
          pathname: "/practice/results",
          params: { sessionId: result.id },
        });
      } else {
        Alert.alert(
          "Error",
          "Failed to save practice results. Please try again."
        );
      }
    } catch (error) {
      console.error("Error finishing session:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentSession) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading session...</Text>
      </View>
    );
  }

  const currentQuestionId = currentSession.questions[currentQuestionIndex].questionId;
  const currentQuestion = getQuestionById(currentQuestionId);
  const progress = (currentQuestionIndex + 1) / currentSession.questions.length;

  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Question not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Question ${currentQuestionIndex + 1}/${currentSession.questions.length}`,
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.headerButton}
            >
              <X size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.timerContainer}>
              <Timer
                initialTime={45 * 60} // 45 minutes in seconds
                size="small"
                showControls={false}
              />
            </View>
          ),
        }}
      />
      
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} height={6} />
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          showExplanation={showExplanation}
        />
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestionIndex === 0 && styles.disabledNavButton,
            ]}
            onPress={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft
              size={20}
              color={
                currentQuestionIndex === 0 ? Colors.mediumGray : Colors.primary
              }
            />
            <Text
              style={[
                styles.navButtonText,
                currentQuestionIndex === 0 && styles.disabledNavButtonText,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>
          
          {currentQuestionIndex === currentSession.questions.length - 1 &&
          showExplanation ? (
            <Button
              title="Finish"
              onPress={handleFinishSession}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.finishButton}
            />
          ) : (
            <TouchableOpacity
              style={[
                styles.navButton,
                selectedAnswer === null && !showExplanation && styles.disabledNavButton,
              ]}
              onPress={handleNextQuestion}
              disabled={selectedAnswer === null && !showExplanation}
            >
              <Text
                style={[
                  styles.navButtonText,
                  selectedAnswer === null &&
                    !showExplanation &&
                    styles.disabledNavButtonText,
                ]}
              >
                {showExplanation ? "Next" : "Check"}
              </Text>
              <ArrowRight
                size={20}
                color={
                  selectedAnswer === null && !showExplanation
                    ? Colors.mediumGray
                    : Colors.primary
                }
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 8,
  },
  timerContainer: {
    marginRight: 8,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    padding: 16,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  disabledNavButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginHorizontal: 4,
  },
  disabledNavButtonText: {
    color: Colors.mediumGray,
  },
  finishButton: {
    minWidth: 120,
  },
});