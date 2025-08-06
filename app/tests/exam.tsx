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
import { useTests } from "@/hooks/tests-store";
import { useQuestions } from "@/hooks/questions-store";
import { QuestionCard } from "@/components/QuestionCard";
import { Timer } from "@/components/Timer";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";

export default function TestExamScreen() {
  const router = useRouter();
  const { testId } = useLocalSearchParams<{ testId: string }>();
  const { currentTest, answerQuestion, finishTest } = useTests();
  const { getQuestionById } = useQuestions();
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [sectionTime, setSectionTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!currentTest) {
      Alert.alert(
        "Test Error",
        "Could not find the test session. Please try again.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/tests"),
          },
        ]
      );
      return;
    }
    
    // Reset question start time when changing questions
    setQuestionStartTime(Date.now());
    
    // Reset UI state when changing questions
    setSelectedAnswer(null);
    
    // Scroll to top when changing questions
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
    
    // Load the answer if already answered
    if (currentTest) {
      const section = currentTest.test.sections[currentSectionIndex];
      const questionId = section.questions[currentQuestionIndex];
      const answer = currentTest.result.answers.find(a => a.questionId === questionId);
      
      if (answer && answer.userAnswer !== null) {
        setSelectedAnswer(answer.userAnswer);
      }
    }
  }, [currentSectionIndex, currentQuestionIndex, currentTest]);

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
      "Exit Test",
      "Are you sure you want to exit? Your progress will be saved, but the test will be marked as incomplete.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Exit",
          style: "destructive",
          onPress: () => router.replace("/tests"),
        },
      ]
    );
    return true;
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    
    // Save the answer
    if (currentTest) {
      const section = currentTest.test.sections[currentSectionIndex];
      const questionId = section.questions[currentQuestionIndex];
      const question = getQuestionById(questionId);
      
      if (question) {
        const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
        const isCorrect = index === question.correctAnswer;
        
        answerQuestion(
          currentSectionIndex,
          currentQuestionIndex,
          questionId,
          index,
          isCorrect,
          timeSpent
        );
        
        // Update time tracking
        setSectionTime(prev => prev + timeSpent);
        setTotalTime(prev => prev + timeSpent);
        setQuestionStartTime(Date.now());
      }
    }
  };

  const handleNextQuestion = () => {
    if (!currentTest) return;
    
    const section = currentTest.test.sections[currentSectionIndex];
    
    // If not answered, record as skipped
    if (selectedAnswer === null) {
      const questionId = section.questions[currentQuestionIndex];
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      
      answerQuestion(
        currentSectionIndex,
        currentQuestionIndex,
        questionId,
        null,
        false,
        timeSpent
      );
      
      // Update time tracking
      setSectionTime(prev => prev + timeSpent);
      setTotalTime(prev => prev + timeSpent);
      setQuestionStartTime(Date.now());
    }
    
    // Move to next question or section
    if (currentQuestionIndex < section.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentSectionIndex < currentTest.test.sections.length - 1) {
      // End of section
      Alert.alert(
        "Section Complete",
        `You've completed the ${getSubjectTitle(section.subject)} section. Ready to move to the next section?`,
        [
          {
            text: "Continue",
            onPress: () => {
              setCurrentSectionIndex(prev => prev + 1);
              setCurrentQuestionIndex(0);
              setSectionTime(0);
            },
          },
        ]
      );
    } else {
      // End of test
      handleFinishTest();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      if (currentTest) {
        const prevSection = currentTest.test.sections[currentSectionIndex - 1];
        setCurrentQuestionIndex(prevSection.questions.length - 1);
      }
    }
  };

  const handleFinishTest = async () => {
    if (!currentTest) return;
    
    Alert.alert(
      "Finish Test",
      "Are you sure you want to finish the test? You won't be able to change your answers after submitting.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Finish",
          onPress: async () => {
            setIsSubmitting(true);
            
            try {
              // Calculate time spent on last question if not already recorded
              const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
              const finalTotalTime = totalTime + timeSpent;
              
              // Finish the test
              const result = await finishTest(finalTotalTime);
              
              if (result) {
                router.replace({
                  pathname: "/tests/results",
                  params: { id: result.id },
                });
              } else {
                Alert.alert(
                  "Error",
                  "Failed to save test results. Please try again."
                );
              }
            } catch (error) {
              console.error("Error finishing test:", error);
              Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
              );
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const getSubjectTitle = (subject: string): string => {
    switch (subject) {
      case "SAT_Reading":
        return "Reading";
      case "SAT_Writing":
        return "Writing";
      case "SAT_Math_No_Calc":
        return "Math (No Calculator)";
      case "SAT_Math_Calc":
        return "Math (Calculator)";
      case "ACT_English":
        return "English";
      case "ACT_Math":
        return "Math";
      case "ACT_Reading":
        return "Reading";
      case "ACT_Science":
        return "Science";
      default:
        return subject;
    }
  };

  if (!currentTest) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading test...</Text>
      </View>
    );
  }

  const section = currentTest.test.sections[currentSectionIndex];
  const questionId = section.questions[currentQuestionIndex];
  const question = getQuestionById(questionId);
  const sectionProgress = (currentQuestionIndex + 1) / section.questions.length;

  if (!question) {
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
          title: `${getSubjectTitle(section.subject)} - Q${currentQuestionIndex + 1}/${section.questions.length}`,
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
                initialTime={section.duration * 60} // Convert minutes to seconds
                size="small"
                showControls={false}
              />
            </View>
          ),
        }}
      />
      
      <View style={styles.progressContainer}>
        <ProgressBar progress={sectionProgress} height={6} />
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <QuestionCard
          question={question}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          showExplanation={false}
        />
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              (currentSectionIndex === 0 && currentQuestionIndex === 0) && styles.disabledNavButton,
            ]}
            onPress={handlePrevQuestion}
            disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
          >
            <ArrowLeft
              size={20}
              color={
                (currentSectionIndex === 0 && currentQuestionIndex === 0)
                  ? Colors.mediumGray
                  : Colors.primary
              }
            />
            <Text
              style={[
                styles.navButtonText,
                (currentSectionIndex === 0 && currentQuestionIndex === 0) && styles.disabledNavButtonText,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>
          
          {currentSectionIndex === currentTest.test.sections.length - 1 &&
          currentQuestionIndex === section.questions.length - 1 ? (
            <Button
              title="Finish Test"
              onPress={handleFinishTest}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.finishButton}
            />
          ) : (
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNextQuestion}
            >
              <Text style={styles.navButtonText}>
                {selectedAnswer === null ? "Skip" : "Next"}
              </Text>
              <ArrowRight size={20} color={Colors.primary} />
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