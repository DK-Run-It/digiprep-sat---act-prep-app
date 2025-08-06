import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/constants/colors";
import { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  showExplanation?: boolean;
  testID?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  showExplanation = false,
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.questionText}>{question.content}</Text>
      
      {question.imageUrl && (
        <Image
          source={{ uri: question.imageUrl }}
          style={styles.image}
          contentFit="contain"
        />
      )}
      
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === index && styles.selectedOption,
              showExplanation &&
                index === question.correctAnswer &&
                styles.correctOption,
              showExplanation &&
                selectedAnswer === index &&
                selectedAnswer !== question.correctAnswer &&
                styles.incorrectOption,
            ]}
            onPress={() => onSelectAnswer(index)}
            disabled={showExplanation}
          >
            <Text style={styles.optionLetter}>
              {String.fromCharCode(65 + index)}
            </Text>
            <Text
              style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText,
                showExplanation &&
                  index === question.correctAnswer &&
                  styles.correctOptionText,
                showExplanation &&
                  selectedAnswer === index &&
                  selectedAnswer !== question.correctAnswer &&
                  styles.incorrectOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {showExplanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>Explanation:</Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
          
          <View style={styles.topicsContainer}>
            {question.topics.map((topic, index) => (
              <View key={index} style={styles.topicBadge}>
                <Text style={styles.topicText}>{topic}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  questionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 16,
    lineHeight: 24,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  correctOption: {
    borderColor: Colors.success,
    backgroundColor: `${Colors.success}10`,
  },
  incorrectOption: {
    borderColor: Colors.error,
    backgroundColor: `${Colors.error}10`,
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    marginRight: 12,
    width: 20,
  },
  optionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  selectedOptionText: {
    color: Colors.primary,
  },
  correctOptionText: {
    color: Colors.success,
  },
  incorrectOptionText: {
    color: Colors.error,
  },
  explanationContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: `${Colors.info}10`,
    borderRadius: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.info,
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  topicsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  topicBadge: {
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  topicText: {
    fontSize: 12,
    color: Colors.primary,
  },
});