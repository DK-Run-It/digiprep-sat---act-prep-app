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
import { ArrowLeft, Clock, Award, BookOpen } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useTests } from "@/hooks/tests-store";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { FullTest, SubjectArea } from "@/types";

export default function TestDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTestById, getResultsForTest, startTest } = useTests();
  
  const [test, setTest] = useState<FullTest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const testData = getTestById(id);
      if (testData) {
        setTest(testData);
      } else {
        Alert.alert(
          "Test Not Found",
          "The requested test could not be found.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    }
  }, [id, getTestById, router]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getSubjectTitle = (subject: SubjectArea): string => {
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

  const handleStartTest = async () => {
    if (!test) return;
    
    setIsLoading(true);
    
    try {
      const testSession = startTest(test.id);
      
      if (testSession) {
        router.push({
          pathname: "/tests/exam",
          params: { testId: test.id },
        });
      } else {
        Alert.alert(
          "Error",
          "Failed to start the test. Please try again."
        );
      }
    } catch (error) {
      console.error("Error starting test:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!test) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading test details...</Text>
      </View>
    );
  }

  const results = getResultsForTest(test.id);
  const hasCompletedTest = results.some(r => r.completed);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: test.name,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ArrowLeft size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.testTypeBadge}>
            <Text style={styles.testTypeText}>{test.testType}</Text>
          </View>
          <Text style={styles.title}>{test.name}</Text>
          <Text style={styles.subtitle}>
            Full-length {test.testType} practice exam
          </Text>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Clock size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              Total Time: {formatDuration(test.totalDuration)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <BookOpen size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              {test.sections.reduce((sum, section) => sum + section.questions.length, 0)} questions across {test.sections.length} sections
            </Text>
          </View>
          {hasCompletedTest && (
            <View style={styles.infoRow}>
              <Award size={20} color={Colors.primary} />
              <Text style={styles.infoText}>
                Highest Score: {Math.max(...results.filter(r => r.completed).map(r => r.score.overall))}
              </Text>
            </View>
          )}
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Sections</Text>
          {test.sections.map((section, index) => (
            <Card key={index} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionName}>
                  {getSubjectTitle(section.subject)}
                </Text>
                <Text style={styles.sectionTime}>
                  {formatDuration(section.duration)}
                </Text>
              </View>
              <View style={styles.sectionDetails}>
                <Text style={styles.sectionQuestions}>
                  {section.questions.length} questions
                </Text>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Card style={styles.instructionsCard}>
            <Text style={styles.instructionsText}>
              • This is a full-length {test.testType} practice test.
            </Text>
            <Text style={styles.instructionsText}>
              • You will have {formatDuration(test.totalDuration)} to complete all sections.
            </Text>
            <Text style={styles.instructionsText}>
              • Each section is timed separately according to official {test.testType} guidelines.
            </Text>
            <Text style={styles.instructionsText}>
              • You can pause the test at any time, but the timer will continue running.
            </Text>
            <Text style={styles.instructionsText}>
              • After completing the test, you&apos;ll receive a detailed score report and analysis.
            </Text>
          </Card>
        </View>

        <Button
          title="Start Test"
          onPress={handleStartTest}
          loading={isLoading}
          disabled={isLoading}
          style={styles.startButton}
          size="large"
        />
        
        {hasCompletedTest && (
          <Button
            title="View Previous Results"
            onPress={() =>
              router.push({
                pathname: "/tests/results",
                params: { id: results[0].id },
              })
            }
            variant="outline"
            style={styles.resultsButton}
          />
        )}
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
  testTypeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  testTypeText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
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
  sectionCard: {
    marginBottom: 8,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  sectionTime: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  sectionDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionQuestions: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  instructionsCard: {
    padding: 16,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 8,
    lineHeight: 20,
  },
  startButton: {
    marginBottom: 12,
  },
  resultsButton: {},
});