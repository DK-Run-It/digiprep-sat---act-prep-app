import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  User,
  Settings,
  LogOut,
  Bell,
  Moon,
  HelpCircle,
  ChevronRight,
  Award,
  Target,
} from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { useUserProfile } from "@/hooks/user-profile-store";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TestType } from "@/types";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile } = useUserProfile();
  
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/welcome");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.userType}>
          {user?.userType.charAt(0).toUpperCase() + user?.userType.slice(1)}
        </Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.studyStreak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {profile?.completedTests.length || 0}
            </Text>
            <Text style={styles.statLabel}>Tests</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {profile?.completedPractice.length || 0}
            </Text>
            <Text style={styles.statLabel}>Practice</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Goals</Text>
        <Card style={styles.goalsCard}>
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Award size={20} color={Colors.primary} />
              <Text style={styles.goalTitle}>SAT Target Score</Text>
            </View>
            <View style={styles.goalContent}>
              <Text style={styles.goalValue}>
                {profile?.targetScore?.sat || "Not set"}
              </Text>
              <TouchableOpacity style={styles.goalEditButton}>
                <Text style={styles.goalEditText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.goalDivider} />
          
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Award size={20} color={Colors.accent} />
              <Text style={styles.goalTitle}>ACT Target Score</Text>
            </View>
            <View style={styles.goalContent}>
              <Text style={styles.goalValue}>
                {profile?.targetScore?.act || "Not set"}
              </Text>
              <TouchableOpacity style={styles.goalEditButton}>
                <Text style={styles.goalEditText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <Card style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <User size={20} color={Colors.primary} />
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <ChevronRight size={20} color={Colors.mediumGray} />
          </TouchableOpacity>
          
          <View style={styles.settingDivider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={Colors.primary} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
              thumbColor={Colors.white}
            />
          </View>
          
          <View style={styles.settingDivider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Moon size={20} color={Colors.primary} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
              thumbColor={Colors.white}
            />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <Card style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color={Colors.primary} />
              <Text style={styles.settingText}>Help & FAQ</Text>
            </View>
            <ChevronRight size={20} color={Colors.mediumGray} />
          </TouchableOpacity>
          
          <View style={styles.settingDivider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Settings size={20} color={Colors.primary} />
              <Text style={styles.settingText}>App Settings</Text>
            </View>
            <ChevronRight size={20} color={Colors.mediumGray} />
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.logoutSection}>
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
          testID="logout-button"
        />
        
        <Text style={styles.versionText}>DigiPrep v1.0.0</Text>
        <Text style={styles.joinedText}>
          Joined {formatDate(user?.createdAt || new Date().toISOString())}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.secondary,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: Colors.lightGray,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  goalsCard: {
    padding: 0,
  },
  goalItem: {
    padding: 16,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  goalContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 28,
  },
  goalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  goalEditButton: {
    backgroundColor: `${Colors.primary}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  goalEditText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  goalDivider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 16,
  },
  settingsCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  settingDivider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 16,
  },
  logoutSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoutButton: {
    marginBottom: 16,
    borderColor: Colors.error,
  },
  logoutButtonText: {
    color: Colors.error,
  },
  versionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  joinedText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});