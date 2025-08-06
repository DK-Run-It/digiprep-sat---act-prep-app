import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Search, 
  BookOpen, 
  Lightbulb, 
  BookmarkCheck, 
  Clock,
  ArrowRight,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTestPrep } from '@/hooks/test-prep-store';
import { TipCard } from '@/components/TipCard';
import { CategoryCard } from '@/components/CategoryCard';
import { FlashCard } from '@/components/FlashCard';
import { TestPrepCategory } from '@/types';

export default function TestPrepScreen() {
  const router = useRouter();
  const {
    tips,
    flashCards,
    isLoading,
    toggleFavorite,
    addToRecentlyViewed,
    getTipsByCategory,
    getFavoriteTips,
    getRecentlyViewedTips,
    isFavorite,
  } = useTestPrep();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

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

  const handleTipPress = (tipId: string) => {
    addToRecentlyViewed(tipId);
    router.push({
      pathname: '/testprep/tip',
      params: { id: tipId },
    });
  };

  const handleCategoryPress = (category: TestPrepCategory) => {
    router.push({
      pathname: '/testprep/category',
      params: { category },
    });
  };

  const handleFlashcardsPress = () => {
    router.push('/testprep/flashcards');
  };

  const recentlyViewedTips = getRecentlyViewedTips();
  const favoriteTips = getFavoriteTips();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Test Prep Hub</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => router.push('/testprep/search')}
        >
          <Search size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Study Categories</Text>
        </View>

        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category.id}
              title={category.title}
              count={getTipsByCategory(category.id).length}
              onPress={() => handleCategoryPress(category.id)}
              testID={`category-${category.id}`}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Flashcards</Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={handleFlashcardsPress}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ArrowRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flashcardsContainer}
        >
          {flashCards.slice(0, 5).map((card) => (
            <FlashCard
              key={card.id}
              card={card}
              testID={`flashcard-${card.id}`}
            />
          ))}
        </ScrollView>
      </View>

      {recentlyViewedTips.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Clock size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Recently Viewed</Text>
            </View>
          </View>

          {recentlyViewedTips.slice(0, 3).map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              onPress={() => handleTipPress(tip.id)}
              isFavorite={isFavorite(tip.id)}
              onToggleFavorite={() => toggleFavorite(tip.id)}
              testID={`recent-tip-${tip.id}`}
            />
          ))}
        </View>
      )}

      {favoriteTips.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <BookmarkCheck size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Favorites</Text>
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push('/testprep/favorites')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <ArrowRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {favoriteTips.slice(0, 3).map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              onPress={() => handleTipPress(tip.id)}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(tip.id)}
              testID={`favorite-tip-${tip.id}`}
            />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Lightbulb size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Featured Tips</Text>
          </View>
        </View>

        {tips.slice(0, 5).map((tip) => (
          <TipCard
            key={tip.id}
            tip={tip}
            onPress={() => handleTipPress(tip.id)}
            isFavorite={isFavorite(tip.id)}
            onToggleFavorite={() => toggleFavorite(tip.id)}
            testID={`featured-tip-${tip.id}`}
          />
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <BookOpen size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Exam Guides</Text>
          </View>
        </View>

        <View style={styles.examGuides}>
          <TouchableOpacity
            style={[styles.examGuideCard, { backgroundColor: Colors.primary }]}
            onPress={() => router.push({
              pathname: '/testprep/exam-guide',
              params: { exam: 'SAT' },
            })}
          >
            <Text style={styles.examGuideTitle}>SAT Guide</Text>
            <Text style={styles.examGuideSubtitle}>
              Complete overview of the SAT exam structure, scoring, and strategies
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.examGuideCard, { backgroundColor: Colors.secondary }]}
            onPress={() => router.push({
              pathname: '/testprep/exam-guide',
              params: { exam: 'ACT' },
            })}
          >
            <Text style={styles.examGuideTitle}>ACT Guide</Text>
            <Text style={styles.examGuideSubtitle}>
              Complete overview of the ACT exam structure, scoring, and strategies
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  flashcardsContainer: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  examGuides: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  examGuideCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  examGuideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  examGuideSubtitle: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.9,
  },
});