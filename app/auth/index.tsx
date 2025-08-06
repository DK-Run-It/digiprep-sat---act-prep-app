import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/colors";
import { Button } from "@/components/Button";

export default function AuthScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://r2-pub.rork.com/attachments/3b0chrmw5x62zltjmdyhk",
          }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Welcome to DigiPrep</Text>
      <Text style={styles.subtitle}>
        Your personalized SAT & ACT prep solution
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Sign Up"
          onPress={() => router.push("/auth/signup" as any)}
          style={styles.button}
          size="large"
        />
        <Button
          title="Log In"
          onPress={() => router.push("/auth/login" as any)}
          style={styles.button}
          variant="outline"
          size="large"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 40,
  },
  button: {
    marginBottom: 16,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});