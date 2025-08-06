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
import { UserType } from "@/types";

export default function SignupScreen() {
  const router = useRouter();
  const { signup, error } = useAuth();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("student");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!name) {
      errors.name = "Name is required";
    }
    
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
    
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await signup(email, password, name, userType);
      
      if (success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Signup Failed",
          error || "Could not create account. Please try again."
        );
      }
    } catch (error) {
      Alert.alert(
        "Signup Error",
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join DigiPrep and start preparing for your exams
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            error={formErrors.name}
            testID="name-input"
          />

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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={formErrors.password}
            testID="password-input"
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={formErrors.confirmPassword}
            testID="confirm-password-input"
          />

          <Text style={styles.sectionTitle}>I am a:</Text>
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === "student" && styles.selectedUserType,
              ]}
              onPress={() => setUserType("student")}
            >
              <Text
                style={[
                  styles.userTypeText,
                  userType === "student" && styles.selectedUserTypeText,
                ]}
              >
                Student
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === "parent" && styles.selectedUserType,
              ]}
              onPress={() => setUserType("parent")}
            >
              <Text
                style={[
                  styles.userTypeText,
                  userType === "parent" && styles.selectedUserTypeText,
                ]}
              >
                Parent
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === "tutor" && styles.selectedUserType,
              ]}
              onPress={() => setUserType("tutor")}
            >
              <Text
                style={[
                  styles.userTypeText,
                  userType === "tutor" && styles.selectedUserTypeText,
                ]}
              >
                Tutor
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Sign Up"
            onPress={handleSignup}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            size="large"
            testID="signup-button"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.footerLink}>Log In</Text>
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
    marginBottom: 30,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  userTypeContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: "center",
    marginRight: 8,
    borderRadius: 8,
  },
  selectedUserType: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  userTypeText: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  selectedUserTypeText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
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