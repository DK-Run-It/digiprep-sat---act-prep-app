import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTestPrep } from '@/hooks/test-prep-store';
import { TipCard } from '@/components/TipCard';
import { TestPrepTip } from '@/types';

export default function SearchScreen() {
  const router = useRouter();
  const {
    tips,
    toggleFavorite,
    addToRecentlyViewed,
    isFavorite,
  } = useTestPrep();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TestPrepTip[]>([]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const results = tips.filter(
        (tip) =>
          tip.title.toLowerCase().includes(query) ||
          tip.content.toLowerCase().includes(query) ||
          tip.category.toLowerCase().includes(query) ||
          (tip.section && tip.section.toLowerCase().includes(query))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, tips]);

  const handleTipPress = (tipId: string) => {
    addToRecentlyViewed(tipId);
    router.push({
      pathname: '/testprep/tip',
      params: { id: tipId },
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Search Tips',
          headerShown: true,
        }}
      />

      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tips, topics, categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            clearButtonMode="while-editing"
            returnKeyType="search"
            testID="search-input"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {searchQuery.length > 0 && (
          <Text style={styles.resultsCount}>
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
          </Text>
        )}

        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TipCard
              tip={item}
              onPress={() => handleTipPress(item.id)}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              testID={`search-tip-${item.id}`}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tips found for &quot;{searchQuery}&quot;</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Start typing to search for tips</Text>
              </View>
            )
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
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