import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/hooks/auth-store";

export default function LoginScreen() {
  const router = useRouter();
  const { login, error } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }
    
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        router.replace("/(tabs)");
      } else {
        // Error message is handled by the auth store
        Alert.alert(
          "Login Failed",
          error || "Invalid email or password. Please try again."
        );
      }
    } catch {
      Alert.alert(
        "Login Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@example.com");
    setPassword("password");
    
    setIsLoading(true);
    
    try {
      const success = await login("demo@example.com", "password");
      
      if (success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Demo Login Failed",
          error || "Could not log in with demo account. Please try again."
        );
      }
    } catch {
      Alert.alert(
        "Login Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Log in to continue your test prep journey
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={formErrors.email}
            testID="email-input"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={formErrors.password}
            testID="password-input"
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Log In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            size="large"
            testID="login-button"
          />

          <Button
            title="Use Demo Account"
            onPress={handleDemoLogin}
            variant="outline"
            loading={isLoading}
            disabled={isLoading}
            style={styles.demoButton}
            testID="demo-button"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  form: {
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
  },
  button: {
    marginBottom: 16,
  },
  demoButton: {
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
});