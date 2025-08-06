import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTestPrep } from '@/hooks/test-prep-store';
import { FlashCard } from '@/components/FlashCard';
import { TestPrepCategory, ExamType } from '@/types';

const { width } = Dimensions.get('window');

export default function FlashcardsScreen() {
  const { flashCards } = useTestPrep();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<TestPrepCategory | null>(null);
  const [selectedExamType, setSelectedExamType] = useState<ExamType | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredCards = flashCards.filter(card => {
    if (selectedCategory && card.category !== selectedCategory) {
      return false;
    }
    if (selectedExamType && card.examType !== selectedExamType && card.examType !== 'both') {
      return false;
    }
    return true;
  });

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const categories: { id: TestPrepCategory; title: string }[] = [
    { id: 'time-management', title: 'Time Management' },
    { id: 'question-patterns', title: 'Question Patterns' },
    { id: 'elimination-strategies', title: 'Elimination Strategies' },
    { id: 'stress-reduction', title: 'Stress Reduction' },
    { id: 'math-formulas', title: 'Math Formulas' },
    { id: 'reading-strategies', title: 'Reading Strategies' },
    { id: 'grammar-rules', title: 'Grammar Rules' },
    { id: 'science-strategies', title: 'Science Strategies' },
  ];

  const examTypes: { id: ExamType; title: string }[] = [
    { id: 'SAT', title: 'SAT' },
    { id: 'ACT', title: 'ACT' },
    { id: 'both', title: 'Both' },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Flashcards',
          headerRight: () => (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.container}>
        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filterTitle}>Categories</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedCategory === null && styles.filterOptionSelected,
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedCategory === null && styles.filterOptionTextSelected,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterOption,
                    selectedCategory === category.id && styles.filterOptionSelected,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedCategory === category.id && styles.filterOptionTextSelected,
                    ]}
                  >
                    {category.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterTitle}>Exam Type</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedExamType === null && styles.filterOptionSelected,
                ]}
                onPress={() => setSelectedExamType(null)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedExamType === null && styles.filterOptionTextSelected,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {examTypes.map((examType) => (
                <TouchableOpacity
                  key={examType.id}
                  style={[
                    styles.filterOption,
                    selectedExamType === examType.id && styles.filterOptionSelected,
                  ]}
                  onPress={() => setSelectedExamType(examType.id)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedExamType === examType.id && styles.filterOptionTextSelected,
                    ]}
                  >
                    {examType.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {filteredCards.length > 0 ? (
          <View style={styles.cardContainer}>
            <FlashCard
              card={filteredCards[currentIndex]}
              testID={`flashcard-${filteredCards[currentIndex].id}`}
            />

            <View style={styles.navigation}>
              <TouchableOpacity
                style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                onPress={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft
                  size={24}
                  color={currentIndex === 0 ? Colors.lightGray : Colors.primary}
                />
                <Text
                  style={[
                    styles.navButtonText,
                    currentIndex === 0 && styles.navButtonTextDisabled,
                  ]}
                >
                  Previous
                </Text>
              </TouchableOpacity>

              <Text style={styles.counter}>
                {currentIndex + 1} / {filteredCards.length}
              </Text>

              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentIndex === filteredCards.length - 1 && styles.navButtonDisabled,
                ]}
                onPress={handleNext}
                disabled={currentIndex === filteredCards.length - 1}
              >
                <Text
                  style={[
                    styles.navButtonText,
                    currentIndex === filteredCards.length - 1 && styles.navButtonTextDisabled,
                  ]}
                >
                  Next
                </Text>
                <ChevronRight
                  size={24}
                  color={
                    currentIndex === filteredCards.length - 1
                      ? Colors.lightGray
                      : Colors.primary
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No flashcards match your filters</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSelectedCategory(null);
                setSelectedExamType(null);
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  filterButton: {
    marginRight: 16,
  },
  filtersContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  filterOption: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  filterOptionTextSelected: {
    color: Colors.white,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: Colors.primary,
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: Colors.lightGray,
  },
  counter: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '600',
  },
});