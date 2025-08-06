import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useAuth } from "./auth-store";
import { UserProfile, SubjectArea, TestType } from "@/types";

export const [UserProfileProvider, useUserProfile] = createContextHook(() => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const profileJson = await AsyncStorage.getItem(`profile-${user.id}`);
      
      if (profileJson) {
        setProfile(JSON.parse(profileJson));
      } else {
        // Create default profile if none exists
        const defaultProfile: UserProfile = {
          ...user,
          targetScore: {},
          weakAreas: [],
          completedTests: [],
          completedPractice: [],
          studyStreak: 0,
          totalStudyTime: 0,
        };
        
        await AsyncStorage.setItem(
          `profile-${user.id}`,
          JSON.stringify(defaultProfile)
        );
        
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile || !user) return false;
    
    try {
      const updatedProfile = { ...profile, ...updates };
      await AsyncStorage.setItem(
        `profile-${user.id}`,
        JSON.stringify(updatedProfile)
      );
      setProfile(updatedProfile);
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
      return false;
    }
  };

  const setTargetScore = async (testType: TestType, score: number) => {
    if (!profile) return false;
    
    return updateProfile({
      targetScore: {
        ...profile.targetScore,
        [testType.toLowerCase()]: score,
      },
    });
  };

  const updateWeakAreas = async (areas: string[]) => {
    if (!profile) return false;
    return updateProfile({ weakAreas: areas });
  };

  const addCompletedTest = async (testId: string) => {
    if (!profile) return false;
    
    const completedTests = [...profile.completedTests];
    if (!completedTests.includes(testId)) {
      completedTests.push(testId);
      return updateProfile({ completedTests });
    }
    
    return true;
  };

  const addCompletedPractice = async (practiceId: string) => {
    if (!profile) return false;
    
    const completedPractice = [...profile.completedPractice];
    if (!completedPractice.includes(practiceId)) {
      completedPractice.push(practiceId);
      return updateProfile({ completedPractice });
    }
    
    return true;
  };

  const incrementStudyStreak = async () => {
    if (!profile) return false;
    return updateProfile({ studyStreak: profile.studyStreak + 1 });
  };

  const addStudyTime = async (minutes: number) => {
    if (!profile) return false;
    return updateProfile({ totalStudyTime: profile.totalStudyTime + minutes });
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    setTargetScore,
    updateWeakAreas,
    addCompletedTest,
    addCompletedPractice,
    incrementStudyStreak,
    addStudyTime,
  };
});