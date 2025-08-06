import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Clock, Award } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { FullTest, TestType } from "@/types";

interface TestCardProps {
  test: FullTest;
  completed?: boolean;
  score?: number;
  onPress: () => void;
  testID?: string;
}

export const TestCard: React.FC<TestCardProps> = ({
  test,
  completed = false,
  score,
  onPress,
  testID,
}) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTestTypeColor = (type: TestType) => {
    return type === "SAT" ? Colors.primary : Colors.accent;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      testID={testID}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.badge,
            { backgroundColor: getTestTypeColor(test.testType) },
          ]}
        >
          <Text style={styles.badgeText}>{test.testType}</Text>
        </View>
        {completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{test.name}</Text>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Clock size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            {formatDuration(test.totalDuration)}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>
            {test.sections.length} sections
          </Text>
        </View>
      </View>
      {completed && score !== undefined && (
        <View style={styles.scoreContainer}>
          <Award size={18} color={Colors.secondary} />
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  completedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
    marginLeft: 8,
  },
});