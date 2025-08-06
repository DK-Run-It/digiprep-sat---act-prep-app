import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft, Award, Clock, CheckCircle, XCircle } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { usePractice } from "@/hooks/practice-store";
import { useQuestions } from "@/hooks/questions-store";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { PracticeSession, SubjectArea } from "@/types";

export default function PracticeResultsScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { getSessionById } = usePractice();
  const { getQuestionById } = useQuestions();
  
  const [session, setSession] = useState<PracticeSession | null>(null);

  useEffect(() => {
    if (sessionId) {
      const practiceSession = getSessionById(sessionId);
      if (practiceSession) {
        setSession(practiceSession);
      }
    }
  }, [sessionId]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

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

  const handleContinuePractice = () => {
    if (!session) return;
    
    router.push({
      pathname: "/practice/subject",
      params: { subject: session.subjectAreas[0] },
    });
  };

  const handleGoToDashboard = () => {
    router.replace("/(tabs)");
  };

  if (!session) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading results...</Text>
      </View>
    );
  }

  const correctAnswers = session.questions.filter(q => q.isCorrect).length;
  const incorrectAnswers = session.questions.filter(q => !q.isCorrect && q.userAnswer !== null).length;
  const skippedAnswers = session.questions.filter(q => q.userAnswer === null).length;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Practice Results",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              style={styles.headerButton}
            >
              <ArrowLeft size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Award size={40} color={Colors.secondary} />
          <Text style={styles.scoreText}>{session.score}%</Text>
          <Text style={styles.subtitle}>
            {session.subjectAreas.map(subject => getSubjectTitle(subject)).join(", ")}
          </Text>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Clock size={20} color={Colors.primary} />
              <Text style={styles.statLabel}>Time</Text>
              <Text style={styles.statValue}>{formatTime(session.duration)}</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <CheckCircle size={20} color={Colors.success} />
              <Text style={styles.statLabel}>Correct</Text>
              <Text style={styles.statValue}>{correctAnswers}</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <XCircle size={20} color={Colors.error} />
              <Text style={styles.statLabel}>Incorrect</Text>
              <Text style={styles.statValue}>{incorrectAnswers}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <Card style={styles.performanceCard}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Correct</Text>
              <View style={styles.performanceBarContainer}>
                <ProgressBar
                  progress={correctAnswers / session.totalQuestions}
                  progressColor={Colors.success}
                  height={12}
                />
                <Text style={styles.performanceValue}>
                  {correctAnswers} / {session.totalQuestions}
                </Text>
              </View>
            </View>
            
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Incorrect</Text>
              <View style={styles.performanceBarContainer}>
                <ProgressBar
                  progress={incorrectAnswers / session.totalQuestions}
                  progressColor={Colors.error}
                  height={12}
                />
                <Text style={styles.performanceValue}>
                  {incorrectAnswers} / {session.totalQuestions}
                </Text>
              </View>
            </View>
            
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Skipped</Text>
              <View style={styles.performanceBarContainer}>
                <ProgressBar
                  progress={skippedAnswers / session.totalQuestions}
                  progressColor={Colors.mediumGray}
                  height={12}
                />
                <Text style={styles.performanceValue}>
                  {skippedAnswers} / {session.totalQuestions}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Question Analysis</Text>
          <Card style={styles.analysisCard}>
            {session.questions.map((question, index) => {
              const q = getQuestionById(question.questionId);
              if (!q) return null;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.questionItem}
                  onPress={() =>
                    router.push({
                      pathname: "/practice/session" as any,
                      params: { questionId: question.questionId },
                    })
                  }
                >
                  <View style={styles.questionNumber}>
                    <Text style={styles.questionNumberText}>{index + 1}</Text>
                  </View>
                  
                  <View style={styles.questionContent}>
                    <Text style={styles.questionText} numberOfLines={2}>
                      {q.content}
                    </Text>
                    <Text style={styles.questionTopic}>
                      {q.topics[0]}
                    </Text>
                  </View>
                  
                  <View
                    style={[
                      styles.questionStatus,
                      question.isCorrect
                        ? styles.correctStatus
                        : question.userAnswer === null
                        ? styles.skippedStatus
                        : styles.incorrectStatus,
                    ]}
                  >
                    {question.isCorrect ? (
                      <CheckCircle size={20} color={Colors.white} />
                    ) : question.userAnswer === null ? (
                      <Text style={styles.statusText}>Skip</Text>
                    ) : (
                      <XCircle size={20} color={Colors.white} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </Card>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Continue Practice"
            onPress={handleContinuePractice}
            style={styles.continueButton}
          />
          <Button
            title="Go to Dashboard"
            onPress={handleGoToDashboard}
            variant="outline"
            style={styles.dashboardButton}
          />
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.secondary,
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  statsCard: {
    marginBottom: 24,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.lightGray,
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
  performanceCard: {
    padding: 16,
  },
  performanceItem: {
    marginBottom: 16,
  },
  performanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  performanceBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginLeft: 12,
    width: 60,
  },
  analysisCard: {
    padding: 0,
  },
  questionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  questionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  questionContent: {
    flex: 1,
  },
  questionText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  questionTopic: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  questionStatus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  correctStatus: {
    backgroundColor: Colors.success,
  },
  incorrectStatus: {
    backgroundColor: Colors.error,
  },
  skippedStatus: {
    backgroundColor: Colors.mediumGray,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.white,
  },
  buttonContainer: {
    marginTop: 16,
  },
  continueButton: {
    marginBottom: 12,
  },
  dashboardButton: {},
});