import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { Card } from "./Card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  testID?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = Colors.primary,
  testID,
}) => {
  return (
    <Card style={styles.card} testID={testID}>
      <View style={styles.header}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    margin: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});