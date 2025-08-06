import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookmarkPlus, BookmarkCheck, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { TestPrepTip } from '@/types';

interface TipCardProps {
  tip: TestPrepTip;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  testID?: string;
}

export const TipCard: React.FC<TipCardProps> = ({
  tip,
  onPress,
  isFavorite,
  onToggleFavorite,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      testID={testID}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{tip.title}</Text>
        <Text style={styles.preview} numberOfLines={2}>
          {tip.content}
        </Text>
        <View style={styles.meta}>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>{tip.examType}</Text>
            {tip.section && (
              <Text style={styles.tag}>
                {tip.section.replace('_', ' ').replace('SAT ', 'SAT: ').replace('ACT ', 'ACT: ')}
              </Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
          testID={`${testID}-favorite`}
        >
          {isFavorite ? (
            <BookmarkCheck size={20} color={Colors.primary} />
          ) : (
            <BookmarkPlus size={20} color={Colors.textSecondary} />
          )}
        </TouchableOpacity>
        <ChevronRight size={20} color={Colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  preview: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: Colors.lightPrimary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
    overflow: 'hidden',
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  favoriteButton: {
    padding: 4,
  },
});