import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { BookmarkPlus, BookmarkCheck, Share2 } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTestPrep } from '@/hooks/test-prep-store';

export default function TipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    tips,
    isFavorite,
    toggleFavorite,
    addToRecentlyViewed,
    getTipsByCategory,
  } = useTestPrep();

  const tip = tips.find((t) => t.id === id);

  useEffect(() => {
    if (tip) {
      addToRecentlyViewed(tip.id);
    }
  }, [tip, addToRecentlyViewed]);

  if (!tip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Tip not found</Text>
      </View>
    );
  }

  const relatedTips = getTipsByCategory(tip.category)
    .filter((t) => t.id !== tip.id)
    .slice(0, 3);

  return (
    <>
      <Stack.Screen
        options={{
          title: tip.title,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => toggleFavorite(tip.id)}
              >
                {isFavorite(tip.id) ? (
                  <BookmarkCheck size={24} color={Colors.primary} />
                ) : (
                  <BookmarkPlus size={24} color={Colors.primary} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Share2 size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.metaContainer}>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>{tip.examType}</Text>
            {tip.section && (
              <Text style={styles.tag}>
                {tip.section.replace('_', ' ').replace('SAT ', 'SAT: ').replace('ACT ', 'ACT: ')}
              </Text>
            )}
            {tip.difficulty && (
              <Text style={[styles.tag, { backgroundColor: Colors.lightSecondary, color: Colors.secondary }]}>
                {tip.difficulty}
              </Text>
            )}
          </View>
          <Text style={styles.category}>
            {tip.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Text>
        </View>

        {tip.imageUrl && (
          <Image
            source={{ uri: tip.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <Text style={styles.content}>{tip.content}</Text>

        {relatedTips.length > 0 && (
          <View style={styles.relatedContainer}>
            <Text style={styles.relatedTitle}>Related Tips</Text>
            {relatedTips.map((relatedTip) => (
              <TouchableOpacity
                key={relatedTip.id}
                style={styles.relatedTip}
                onPress={() => {
                  router.push({
                    pathname: '/testprep/tip',
                    params: { id: relatedTip.id },
                  });
                }}
              >
                <Text style={styles.relatedTipTitle}>{relatedTip.title}</Text>
                <Text style={styles.relatedTipPreview} numberOfLines={1}>
                  {relatedTip.content}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  metaContainer: {
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: Colors.lightPrimary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    overflow: 'hidden',
  },
  category: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  relatedContainer: {
    marginTop: 32,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  relatedTip: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  relatedTipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  relatedTipPreview: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
});