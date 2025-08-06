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
import { Clock, Award, BarChart2 } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useTests } from "@/hooks/tests-store";
import { TestCard } from "@/components/TestCard";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TestType } from "@/types";

export default function TestsScreen() {
  const router = useRouter();
  const { tests, results, getTestsByType, getHighestScore } = useTests();
  
  const [activeTab, setActiveTab] = useState<"sat" | "act">("sat");
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getCompletedTests = () => {
    const testIds = results
      .filter(r => r.completed)
      .map(r => r.testId);
    
    return tests.filter(test => 
      testIds.includes(test.id) && 
      test.testType === activeTab.toUpperCase()
    );
  };

  const getAvailableTests = () => {
    const completedIds = results
      .filter(r => r.completed)
      .map(r => r.testId);
    
    return getTestsByType(activeTab.toUpperCase() as TestType)
      .filter(test => !completedIds.includes(test.id));
  };

  const getTestScore = (testId: string) => {
    const result = results.find(r => r.testId === testId && r.completed);
    return result ? result.score.overall : undefined;
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
        <Text style={styles.title}>Practice Tests</Text>
        <Text style={styles.subtitle}>
          Full-length {activeTab.toUpperCase()} practice exams
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

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Award size={24} color={Colors.secondary} />
          <Text style={styles.statValue}>
            {getHighestScore(activeTab.toUpperCase() as TestType) || "N/A"}
          </Text>
          <Text style={styles.statLabel}>Highest Score</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <BarChart2 size={24} color={Colors.primary} />
          <Text style={styles.statValue}>
            {getCompletedTests().length}
          </Text>
          <Text style={styles.statLabel}>Tests Completed</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Clock size={24} color={Colors.accent} />
          <Text style={styles.statValue}>
            {getAvailableTests().length}
          </Text>
          <Text style={styles.statLabel}>Tests Available</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Tests</Text>
        </View>

        {getAvailableTests().length > 0 ? (
          getAvailableTests().map((test, index) => (
            <TestCard
              key={index}
              test={test}
              onPress={() =>
                router.push({
                  pathname: "/tests/details",
                  params: { id: test.id },
                })
              }
            />
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              You&apos;ve completed all available {activeTab.toUpperCase()} tests!
            </Text>
            <Button
              title="View Completed Tests"
              onPress={() => {}}
              style={styles.emptyButton}
            />
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Completed Tests</Text>
        </View>

        {getCompletedTests().length > 0 ? (
          getCompletedTests().map((test, index) => (
            <TestCard
              key={index}
              test={test}
              completed
              score={getTestScore(test.id)}
              onPress={() =>
                router.push({
                  pathname: "/tests/details",
                  params: { id: test.id, completed: "true" },
                })
              }
            />
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              You haven&apos;t completed any {activeTab.toUpperCase()} tests yet.
            </Text>
            <Button
              title="Start a Test"
              onPress={() => {}}
              style={styles.emptyButton}
            />
          </Card>
        )}
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
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