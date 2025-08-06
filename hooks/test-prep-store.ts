import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { TestPrepTip, FlashCard, TestPrepCategory, ExamType, SubjectArea } from '@/types';
import { testPrepTips, flashCards } from '@/mocks/test-prep';

export const [TestPrepContext, useTestPrep] = createContextHook(() => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Fetch tips and favorites from storage
  const tipsQuery = useQuery({
    queryKey: ['testPrepTips'],
    queryFn: async () => {
      console.log('Fetching test prep tips');
      // In a real app, this would be an API call
      return testPrepTips;
    }
  });

  const flashCardsQuery = useQuery({
    queryKey: ['flashCards'],
    queryFn: async () => {
      console.log('Fetching flash cards');
      // In a real app, this would be an API call
      return flashCards;
    }
  });

  const favoritesQuery = useQuery({
    queryKey: ['testPrepFavorites'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem('testPrepFavorites');
      return stored ? JSON.parse(stored) : [];
    }
  });

  const recentlyViewedQuery = useQuery({
    queryKey: ['testPrepRecentlyViewed'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem('testPrepRecentlyViewed');
      return stored ? JSON.parse(stored) : [];
    }
  });

  // Save favorites to storage
  const saveFavoritesMutation = useMutation({
    mutationFn: async (favorites: string[]) => {
      await AsyncStorage.setItem('testPrepFavorites', JSON.stringify(favorites));
      return favorites;
    }
  });

  // Save recently viewed to storage
  const saveRecentlyViewedMutation = useMutation({
    mutationFn: async (recentlyViewed: string[]) => {
      await AsyncStorage.setItem('testPrepRecentlyViewed', JSON.stringify(recentlyViewed));
      return recentlyViewed;
    }
  });

  useEffect(() => {
    if (favoritesQuery.data) {
      setFavorites(favoritesQuery.data);
    }
  }, [favoritesQuery.data]);

  useEffect(() => {
    if (recentlyViewedQuery.data) {
      setRecentlyViewed(recentlyViewedQuery.data);
    }
  }, [recentlyViewedQuery.data]);

  const toggleFavorite = (tipId: string) => {
    const newFavorites = favorites.includes(tipId)
      ? favorites.filter(id => id !== tipId)
      : [...favorites, tipId];
    
    setFavorites(newFavorites);
    saveFavoritesMutation.mutate(newFavorites);
  };

  const addToRecentlyViewed = (tipId: string) => {
    // Remove if already exists to avoid duplicates
    const filtered = recentlyViewed.filter(id => id !== tipId);
    // Add to beginning of array (most recent first)
    const newRecentlyViewed = [tipId, ...filtered].slice(0, 10); // Keep only 10 most recent
    
    setRecentlyViewed(newRecentlyViewed);
    saveRecentlyViewedMutation.mutate(newRecentlyViewed);
  };

  const getTipsByCategory = (category: TestPrepCategory) => {
    return tipsQuery.data?.filter(tip => tip.category === category) || [];
  };

  const getTipsByExamType = (examType: ExamType) => {
    return tipsQuery.data?.filter(tip => tip.examType === examType || tip.examType === 'both') || [];
  };

  const getTipsBySection = (section: SubjectArea) => {
    return tipsQuery.data?.filter(tip => tip.section === section) || [];
  };

  const getFavoriteTips = () => {
    return tipsQuery.data?.filter(tip => favorites.includes(tip.id)) || [];
  };

  const getRecentlyViewedTips = () => {
    // Sort by the order in recentlyViewed array
    return recentlyViewed
      .map(id => tipsQuery.data?.find(tip => tip.id === id))
      .filter(Boolean) as TestPrepTip[];
  };

  const getFlashCardsByCategory = (category: TestPrepCategory) => {
    return flashCardsQuery.data?.filter(card => card.category === category) || [];
  };

  const getFlashCardsByExamType = (examType: ExamType) => {
    return flashCardsQuery.data?.filter(card => card.examType === examType || card.examType === 'both') || [];
  };

  return {
    tips: tipsQuery.data || [],
    flashCards: flashCardsQuery.data || [],
    favorites,
    recentlyViewed,
    isLoading: tipsQuery.isLoading || flashCardsQuery.isLoading,
    toggleFavorite,
    addToRecentlyViewed,
    getTipsByCategory,
    getTipsByExamType,
    getTipsBySection,
    getFavoriteTips,
    getRecentlyViewedTips,
    getFlashCardsByCategory,
    getFlashCardsByExamType,
    isFavorite: (tipId: string) => favorites.includes(tipId)
  };
});