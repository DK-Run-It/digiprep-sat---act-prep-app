import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { BookOpen, Clock, BarChart2, Target } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useAdaptiveAlgorithm } from "@/hooks/adaptive-algorithm";
import { usePractice } from "@/hooks/practice-store";
import { Card } from "@/components/Card";
import { SubjectCard } from "@/components/SubjectCard";
import { Button } from "@/components/Button";
import { SubjectArea, TestType } from "@/types";

export default function PracticeScreen() {
  const router = useRouter();
  const { performances, recommendedSubjects } = useAdaptiveAlgorithm();
  const { getRecentSessions, getAverageScore } = usePractice();
  
  const [activeTab, setActiveTab] = useState<"sat" | "act">("sat");
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getSubjectProgress = (subject: SubjectArea): number => {
    const performance = performances.find(p => p.subject === subject);
    if (!performance || performance.questionsAnswered === 0) return 0;
    return performance.correctRate;
  };

  const getFilteredSubjects = (): SubjectArea[] => {
    const prefix = activeTab.toUpperCase() as TestType;
    return performances
      .filter(p => p.subject.startsWith(prefix))
      .map(p => p.subject);
  };

  const getRecommendedFilteredSubjects = (): SubjectArea[] => {
    const prefix = activeTab.toUpperCase() as TestType;
    return recommendedSubjects.filter(subject => 
      subject.startsWith(prefix)
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Practice</Text>
        <Text style={styles.subtitle}>
          Focus on specific areas to improve your score
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "sat" && styles.activeTab]}
          onPress={() => setActiveTab("sat")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "sat" && styles.activeTabText,
            ]}
          >
            SAT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "act" && styles.activeTab]}
          onPress={() => setActiveTab("act")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "act" && styles.activeTabText,
            ]}
          >
            ACT
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended Practice</Text>
        </View>

        <View style={styles.recommendedContainer}>
          {getRecommendedFilteredSubjects().length > 0 ? (
            getRecommendedFilteredSubjects().map((subject, index) => (
              <SubjectCard
                key={index}
                subject={subject}
                progress={getSubjectProgress(subject)}
                onPress={() =>
                  router.push({
                    pathname: "/practice/subject",
                    params: { subject },
                  })
                }
              />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Complete some practice questions to get personalized recommendations
              </Text>
              <Button
                title="Start Practice"
                onPress={() =>
                  router.push({
                    pathname: "/practice/subject",
                    params: { subject: getFilteredSubjects()[0] },
                  })
                }
                style={styles.emptyButton}
              />
            </Card>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Subjects</Text>
        </View>

        <View style={styles.subjectsContainer}>
          {getFilteredSubjects().map((subject, index) => (
            <SubjectCard
              key={index}
              subject={subject}
              progress={getSubjectProgress(subject)}
              onPress={() =>
                router.push({
                  pathname: "/practice/subject",
                  params: { subject },
                })
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Practice Options</Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() =>
              router.push({
                pathname: "/practice/adaptive",
                params: { testType: activeTab.toUpperCase() },
              })
            }
          >
            <Target size={24} color={Colors.primary} />
            <Text style={styles.optionTitle}>Adaptive Practice</Text>
            <Text style={styles.optionDescription}>
              Questions tailored to your skill level
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() =>
              router.push({
                pathname: "/practice/timed",
                params: { testType: activeTab.toUpperCase() },
              })
            }
          >
            <Clock size={24} color={Colors.secondary} />
            <Text style={[styles.optionTitle, { color: Colors.secondary }]}>
              Timed Practice
            </Text>
            <Text style={styles.optionDescription}>
              45-minute focused practice sessions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() =>
              router.push({
                pathname: "/practice/weak-areas",
                params: { testType: activeTab.toUpperCase() },
              })
            }
          >
            <BarChart2 size={24} color={Colors.accent} />
            <Text style={[styles.optionTitle, { color: Colors.accent }]}>
              Weak Areas
            </Text>
            <Text style={styles.optionDescription}>
              Focus on your lowest-scoring topics
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  recommendedContainer: {
    marginBottom: 8,
  },
  subjectsContainer: {
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyCard: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  emptyButton: {
    width: "60%",
  },
});