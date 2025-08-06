import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { 
  Clock, 
  BookOpen, 
  XCircle, 
  HeartPulse, 
  Calculator, 
  BookMarked, 
  KanbanSquare, 
  Microscope 
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTestPrep } from '@/hooks/test-prep-store';
import { TipCard } from '@/components/TipCard';
import { TestPrepCategory } from '@/types';

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: TestPrepCategory }>();
  const router = useRouter();
  const {
    getTipsByCategory,
    toggleFavorite,
    addToRecentlyViewed,
    isFavorite,
  } = useTestPrep();

  const tips = getTipsByCategory(category);

  const getCategoryTitle = (category: TestPrepCategory): string => {
    switch (category) {
      case 'time-management':
        return 'Time Management';
      case 'question-patterns':
        return 'Question Patterns';
      case 'elimination-strategies':
        return 'Elimination Strategies';
      case 'stress-reduction':
        return 'Stress Reduction';
      case 'math-formulas':
        return 'Math Formulas';
      case 'reading-strategies':
        return 'Reading Strategies';
      case 'grammar-rules':
        return 'Grammar Rules';
      case 'science-strategies':
        return 'Science Strategies';
      default:
        return 'Tips';
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'time-management':
        return <Clock size={24} color={Colors.primary} />;
      case 'question-patterns':
        return <BookOpen size={24} color={Colors.primary} />;
      case 'elimination-strategies':
        return <XCircle size={24} color={Colors.primary} />;
      case 'stress-reduction':
        return <HeartPulse size={24} color={Colors.primary} />;
      case 'math-formulas':
        return <Calculator size={24} color={Colors.primary} />;
      case 'reading-strategies':
        return <BookMarked size={24} color={Colors.primary} />;
      case 'grammar-rules':
        return <KanbanSquare size={24} color={Colors.primary} />;
      case 'science-strategies':
        return <Microscope size={24} color={Colors.primary} />;
      default:
        return <BookOpen size={24} color={Colors.primary} />;
    }
  };

  const handleTipPress = (tipId: string) => {
    addToRecentlyViewed(tipId);
    router.push({
      pathname: '/testprep/tip',
      params: { id: tipId },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: getCategoryTitle(category),
          headerRight: () => (
            <View style={styles.headerIcon}>
              {getCategoryIcon()}
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        <FlatList
          data={tips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TipCard
              tip={item}
              onPress={() => handleTipPress(item.id)}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              testID={`tip-${item.id}`}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tips found for this category</Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
  },
  headerIcon: {
    marginRight: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});