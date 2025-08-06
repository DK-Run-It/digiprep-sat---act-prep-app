import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { Button } from "@/components/Button";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth" as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?q=80&w=1000",
        }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        >
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: "https://r2-pub.rork.com/attachments/3b0chrmw5x62zltjmdyhk",
              }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>Ace Your College Entrance Exams</Text>
            <Text style={styles.subtitle}>
              Personalized SAT & ACT prep with adaptive learning technology
            </Text>

            <View style={styles.features}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>1000+</Text>
                </View>
                <Text style={styles.featureText}>Practice Questions</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>AI</Text>
                </View>
                <Text style={styles.featureText}>Adaptive Learning</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>Full</Text>
                </View>
                <Text style={styles.featureText}>Practice Tests</Text>
              </View>
            </View>

            <Button
              title="Get Started"
              onPress={handleGetStarted}
              style={styles.button}
              variant="secondary"
              size="large"
            />

            <TouchableOpacity
              style={styles.learnMoreButton}
              onPress={() => router.push("/auth/login" as any)}
            >
              <Text style={styles.learnMoreText}>Already have an account?</Text>
              <ArrowRight size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  logo: {
    width: width * 0.8,
    height: 100,
  },
  contentContainer: {
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.white,
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.9,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  featureItem: {
    alignItems: "center",
    width: width / 3 - 30,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featureIconText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  featureText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 14,
  },
  button: {
    marginBottom: 16,
  },
  learnMoreButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  learnMoreText: {
    color: Colors.white,
    marginRight: 8,
    fontSize: 16,
  },
});