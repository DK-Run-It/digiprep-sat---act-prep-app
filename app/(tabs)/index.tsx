import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  BarChart2,
  ArrowRight,
} from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { useUserProfile } from "@/hooks/user-profile-store";
import { useAdaptiveAlgorithm } from "@/hooks/adaptive-algorithm";
import { usePractice } from "@/hooks/practice-store";
import { useTests } from "@/hooks/tests-store";
import { Card } from "@/components/Card";
import { ProgressBar } from "@/components/ProgressBar";
import { StatCard } from "@/components/StatCard";
import { SubjectCard } from "@/components/SubjectCard";
import { TestCard } from "@/components/TestCard";
import { SubjectArea } from "@/types";

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { recommendedSubjects, performances } = useAdaptiveAlgorithm();
  const { getAverageScore, getTotalPracticeTime, getRecentSessions } = usePractice();
  const { getHighestScore, tests, getRecentResults } = useTests();
  
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

  const formatStudyTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.name?.split(" ")[0] || "Student"}!
          </Text>
          <Text style={styles.subGreeting}>Ready to study today?</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          title="Study Streak"
          value={profile?.studyStreak || 0}
          subtitle="days"
          icon={<TrendingUp size={20} color={Colors.primary} />}
          testID="streak-stat"
        />
        <StatCard
          title="Study Time"
          value={formatStudyTime(profile?.totalStudyTime || 0)}
          subtitle="total"
          icon={<Clock size={20} color={Colors.secondary} />}
          color={Colors.secondary}
          testID="time-stat"
        />
        <StatCard
          title="Best Score"
          value={getHighestScore("SAT") || "N/A"}
          subtitle="SAT"
          icon={<Award size={20} color={Colors.accent} />}
          color={Colors.accent}
          testID="score-stat"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended Practice</Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => router.push("/practice")}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ArrowRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendedContainer}
        >
          {recommendedSubjects.slice(0, 3).map((subject, index) => (
            <SubjectCard
              key={index}
              subject={subject}
              progress={getSubjectProgress(subject)}
              onPress={() =>
                router.push({
                  pathname: "/practice/subject" as any,
                  params: { subject },
                })
              }
              testID={`subject-card-${index}`}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Practice Tests</Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => router.push("/tests")}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ArrowRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.testsContainer}
        >
          {tests.slice(0, 3).map((test, index) => (
            <TestCard
              key={index}
              test={test}
              onPress={() =>
                router.push({
                  pathname: "/tests/details" as any,
                  params: { id: test.id },
                })
              }
              testID={`test-card-${index}`}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/practice")}
          >
            <BookOpen size={24} color={Colors.primary} />
            <Text style={styles.actionTitle}>Practice</Text>
            <Text style={styles.actionSubtitle}>
              Targeted questions for your weak areas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/tests")}
          >
            <BarChart2 size={24} color={Colors.secondary} />
            <Text style={[styles.actionTitle, { color: Colors.secondary }]}>
              Full Tests
            </Text>
            <Text style={styles.actionSubtitle}>
              Complete SAT/ACT practice exams
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
        </View>

        <Card style={styles.progressCard}>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <ProgressBar
            progress={getAverageScore() / 100}
            height={10}
            progressColor={Colors.secondary}
            showPercentage
            label="Average Score"
          />

          <View style={styles.divider} />

          <Text style={styles.progressTitle}>SAT Progress</Text>
          <View style={styles.subjectProgress}>
            <Text style={styles.subjectName}>Reading</Text>
            <ProgressBar
              progress={getSubjectProgress("SAT_Reading")}
              height={8}
              progressColor={Colors.primary}
              style={{ flex: 1 }}
            />
          </View>
          <View style={styles.subjectProgress}>
            <Text style={styles.subjectName}>Writing</Text>
            <ProgressBar
              progress={getSubjectProgress("SAT_Writing")}
              height={8}
              progressColor={Colors.primary}
              style={{ flex: 1 }}
            />
          </View>
          <View style={styles.subjectProgress}>
            <Text style={styles.subjectName}>Math</Text>
            <ProgressBar
              progress={
                (getSubjectProgress("SAT_Math_No_Calc") +
                  getSubjectProgress("SAT_Math_Calc")) /
                2
              }
              height={8}
              progressColor={Colors.primary}
              style={{ flex: 1 }}
            />
          </View>
        </Card>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  subGreeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
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
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  recommendedContainer: {
    paddingRight: 16,
  },
  testsContainer: {
    paddingRight: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    width: "48%",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  progressCard: {
    padding: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: 16,
  },
  subjectProgress: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  subjectName: {
    width: 70,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});