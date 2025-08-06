import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { User, UserType } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: "Failed to load user data",
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login - in a real app, this would be an API call
      if (email === "demo@example.com" && password === "password") {
        const user: User = {
          id: "user-1",
          email,
          name: "Demo User",
          userType: "student",
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };
        
        await AsyncStorage.setItem("user", JSON.stringify(user));
        
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        
        return true;
      } else {
        setState({
          ...state,
          isLoading: false,
          error: "Invalid email or password",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setState({
        ...state,
        isLoading: false,
        error: "Login failed. Please try again.",
      });
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    userType: UserType
  ) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock signup - in a real app, this would be an API call
      const user: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        userType,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem("user", JSON.stringify(user));
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      setState({
        ...state,
        isLoading: false,
        error: "Signup failed. Please try again.",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
      setState({
        ...state,
        error: "Logout failed. Please try again.",
      });
    }
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    login,
    signup,
    logout,
  };
});