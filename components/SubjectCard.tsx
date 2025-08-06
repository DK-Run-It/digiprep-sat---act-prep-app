import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BookOpen, Calculator, Flag, FileText } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { SubjectArea } from "@/types";
import { ProgressBar } from "./ProgressBar";

interface SubjectCardProps {
  subject: SubjectArea;
  progress: number;
  onPress: () => void;
  testID?: string;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  progress,
  onPress,
  testID,
}) => {
  const getSubjectInfo = () => {
    switch (subject) {
      case "SAT_Reading":
        return {
          title: "SAT Reading",
          icon: <BookOpen size={24} color={Colors.primary} />,
          color: "#e3f2fd",
        };
      case "SAT_Writing":
        return {
          title: "SAT Writing",
          icon: <FileText size={24} color={Colors.primary} />,
          color: "#e8f5e9",
        };
      case "SAT_Math_No_Calc":
        return {
          title: "SAT Math (No Calc)",
          icon: <Calculator size={24} color={Colors.primary} />,
          color: "#f3e5f5",
        };
      case "SAT_Math_Calc":
        return {
          title: "SAT Math (Calculator)",
          icon: <Calculator size={24} color={Colors.primary} />,
          color: "#fff3e0",
        };
      case "ACT_English":
        return {
          title: "ACT English",
          icon: <FileText size={24} color={Colors.primary} />,
          color: "#e0f7fa",
        };
      case "ACT_Math":
        return {
          title: "ACT Math",
          icon: <Calculator size={24} color={Colors.primary} />,
          color: "#f1f8e9",
        };
      case "ACT_Reading":
        return {
          title: "ACT Reading",
          icon: <BookOpen size={24} color={Colors.primary} />,
          color: "#fff8e1",
        };
      case "ACT_Science":
        return {
          title: "ACT Science",
          icon: <Flag size={24} color={Colors.primary} />,
          color: "#fce4ec",
        };
      default:
        return {
          title: subject,
          icon: <BookOpen size={24} color={Colors.primary} />,
          color: "#f5f5f5",
        };
    }
  };

  const { title, icon, color } = getSubjectInfo();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: color }]}
      onPress={onPress}
      testID={testID}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <ProgressBar
        progress={progress}
        progressColor={Colors.secondary}
        showPercentage
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    flex: 1,
  },
});