import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({ children, style, testID }) => {
  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
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
});