import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '@/constants/colors';
import { FlashCard as FlashCardType } from '@/types';

interface FlashCardProps {
  card: FlashCardType;
  testID?: string;
}

export const FlashCard: React.FC<FlashCardProps> = ({ card, testID }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const flipCard = () => {
    if (isFlipped) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 180,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={flipCard}
      testID={testID}
      style={styles.container}
    >
      <View style={styles.cardContainer}>
        <Animated.View 
          style={[styles.card, styles.frontCard, frontAnimatedStyle, { opacity: isFlipped ? 0 : 1 }]}
          pointerEvents={isFlipped ? 'none' : 'auto'}
        >
          <Text style={styles.frontTitle}>{card.front}</Text>
          <Text style={styles.tapHint}>Tap to flip</Text>
        </Animated.View>
        
        <Animated.View 
          style={[styles.card, styles.backCard, backAnimatedStyle, { opacity: isFlipped ? 1 : 0 }]}
          pointerEvents={isFlipped ? 'auto' : 'none'}
        >
          <Text style={styles.backText}>{card.back}</Text>
          <Text style={styles.tapHint}>Tap to flip back</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 200,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: 20,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  frontCard: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backCard: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  frontTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  backText: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  tapHint: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    fontSize: 12,
    color: Colors.textSecondary,
    opacity: 0.7,
  },
});