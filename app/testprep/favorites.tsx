import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { BookmarkCheck } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTestPrep } from '@/hooks/test-prep-store';
import { TipCard } from '@/components/TipCard';

export default function FavoritesScreen() {
  const router = useRouter();
  const {
    getFavoriteTips,
    toggleFavorite,
    addToRecentlyViewed,
    isFavorite,
  } = useTestPrep();
  
  const favoriteTips = getFavoriteTips();

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
          title: 'Favorite Tips',
          headerRight: () => (
            <View style={styles.headerIcon}>
              <BookmarkCheck size={24} color={Colors.primary} />
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        <FlatList
          data={favoriteTips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TipCard
              tip={item}
              onPress={() => handleTipPress(item.id)}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(item.id)}
              testID={`favorite-tip-${item.id}`}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                You haven&apos;t saved any tips as favorites yet.
              </Text>
              <Text style={styles.emptySubtext}>
                Tap the bookmark icon on any tip to add it to your favorites.
              </Text>
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
  headerIcon: {
    marginRight: 16,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});