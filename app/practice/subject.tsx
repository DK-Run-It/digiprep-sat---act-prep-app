import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft, BookOpen, Clock, Target } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useQuestions } from "@/hooks/questions-store";
import { usePractice } from "@/hooks/practice-store";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { SubjectArea } from "@/types";

export default function SubjectScreen() {
  const router = useRouter();
  const { subject } = useLocalSearchParams<{ subject: SubjectArea }>();
  const { getQuestionsBySubject, getAdaptiveQuestions } = useQuestions();
  const { startSession } = usePractice();
  
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getSubjectTitle = (subject: SubjectArea): string => {
    switch (subject) {
      case "SAT_Reading":
        return "SAT Reading";
      case "SAT_Writing":
        return "SAT Writing";
      case "SAT_Math_No_Calc":
        return "SAT Math (No Calculator)";
      case "SAT_Math_Calc":
        return "SAT Math (Calculator)";
      case "ACT_English":
        return "ACT English";
      case "ACT_Math":
        return "ACT Math";
      case "ACT_Reading":
        return "ACT Reading";
      case "ACT_Science":
        return "ACT Science";
      default:
        return subject;
    }
  };

  const handleStartPractice = () => {
    setIsLoading(true);
    
    try {
      // Get adaptive questions for this subject
      const questions = getAdaptiveQuestions(subject, questionCount);
      
      if (questions.length === 0) {
        Alert.alert(
          "No Questions Available",
          "There are no questions available for this subject. Please try another subject."
        );
        setIsLoading(false);
        return;
      }
      
      // Start a new practice session
      const session = startSession([subject], questions);
      
      // Navigate to the practice session
      router.push({
        pathname: "/practice/session",
        params: { sessionId: session.id },
      });
    } catch (error) {
      console.error("Error starting practice:", error);
      Alert.alert(
        "Error",
        "Failed to start practice session. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: getSubjectTitle(subject),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{getSubjectTitle(subject)}</Text>
          <Text style={styles.subtitle}>
            Practice questions focused on this subject area
          </Text>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <BookOpen size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              {getQuestionsBySubject(subject).length} questions available
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Target size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              Adaptive difficulty based on your performance
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              Recommended practice time: 45 minutes
            </Text>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of Questions</Text>
          <View style={styles.questionCountContainer}>
            {[5, 10, 15, 20].map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.countButton,
                  questionCount === count && styles.selectedCountButton,
                ]}
                onPress={() => setQuestionCount(count)}
              >
                <Text
                  style={[
                    styles.countText,
                    questionCount === count && styles.selectedCountText,
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimated Time</Text>
          <Text style={styles.timeEstimate}>
            {Math.round(questionCount * 2.5)} minutes
          </Text>
        </View>

        <Button
          title="Start Practice"
          onPress={handleStartPractice}
          loading={isLoading}
          disabled={isLoading}
          style={styles.startButton}
          size="large"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  infoCard: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  questionCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  countButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  selectedCountButton: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  countText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  selectedCountText: {
    color: Colors.white,
  },
  timeEstimate: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.secondary,
  },
  startButton: {
    marginTop: 16,
  },
});