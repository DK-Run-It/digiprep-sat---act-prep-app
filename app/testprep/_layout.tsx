import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function TestPrepLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen
        name="tip"
        options={{
          title: 'Test Prep Tip',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="category"
        options={{
          title: 'Category',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="flashcards"
        options={{
          title: 'Flashcards',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          title: 'Search Tips',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="favorites"
        options={{
          title: 'Favorite Tips',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="exam-guide"
        options={{
          title: 'Exam Guide',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}