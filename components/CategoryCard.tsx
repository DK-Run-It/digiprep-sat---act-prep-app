import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
import { TestPrepCategory } from '@/types';

interface CategoryCardProps {
  category: TestPrepCategory;
  title: string;
  count: number;
  onPress: () => void;
  testID?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  title,
  count,
  onPress,
  testID,
}) => {
  const getCategoryIcon = () => {
    switch (category) {
      case 'time-management':
        return <Clock size={24} color={Colors.white} />;
      case 'question-patterns':
        return <BookOpen size={24} color={Colors.white} />;
      case 'elimination-strategies':
        return <XCircle size={24} color={Colors.white} />;
      case 'stress-reduction':
        return <HeartPulse size={24} color={Colors.white} />;
      case 'math-formulas':
        return <Calculator size={24} color={Colors.white} />;
      case 'reading-strategies':
        return <BookMarked size={24} color={Colors.white} />;
      case 'grammar-rules':
        return <KanbanSquare size={24} color={Colors.white} />;
      case 'science-strategies':
        return <Microscope size={24} color={Colors.white} />;
      default:
        return <BookOpen size={24} color={Colors.white} />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'time-management':
        return Colors.primary;
      case 'question-patterns':
        return Colors.secondary;
      case 'elimination-strategies':
        return '#FF6B6B';
      case 'stress-reduction':
        return '#4ECDC4';
      case 'math-formulas':
        return '#FFD166';
      case 'reading-strategies':
        return '#6A0572';
      case 'grammar-rules':
        return '#1A535C';
      case 'science-strategies':
        return '#3D5A80';
      default:
        return Colors.primary;
    }
  };

  const backgroundColor = getCategoryColor();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={onPress}
      testID={testID}
    >
      <View style={styles.iconContainer}>
        {getCategoryIcon()}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count} tips</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 16,
    justifyContent: 'space-between',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginTop: 8,
  },
  count: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});