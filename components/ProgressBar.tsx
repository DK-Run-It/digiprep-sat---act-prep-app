import React from "react";
import { View, StyleSheet, Text, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";

interface ProgressBarProps {
  progress: number;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  showPercentage?: boolean;
  style?: ViewStyle;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = Colors.lightGray,
  progressColor = Colors.secondary,
  showPercentage = false,
  style,
  label,
}) => {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(clampedProgress * 100);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.progressContainer,
          { backgroundColor, height },
        ]}
      >
        <View
          style={[
            styles.progressBar,
            {
              width: `${percentage}%`,
              backgroundColor: progressColor,
              height,
            },
          ]}
        />
      </View>
      {showPercentage && <Text style={styles.percentage}>{percentage}%</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  progressContainer: {
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
  },
  progressBar: {
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: "right",
  },
});