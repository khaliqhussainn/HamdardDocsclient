import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Linking,
  ScrollView,
  Animated,
} from "react-native";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";

const LeftSidebar = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [activeLink, setActiveLink] = useState("Profile");
  const [showQuickStats, setShowQuickStats] = useState(false);

  // Animation value for quick stats
  const quickStatsAnim = new Animated.Value(0);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
        imageUrl:
          currentUser.photoURL || "../../assets/icons/profile-placeholder.svg",
        role: "Student", // You can fetch this from your user data
        joinDate: "Jan 2024", // You can fetch this from your user data
      });
    }
  }, [auth.currentUser]);

  const toggleQuickStats = () => {
    setShowQuickStats(!showQuickStats);
    Animated.timing(quickStatsAnim, {
      toValue: showQuickStats ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSocialMediaPress = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const quickStats = [
    { icon: "time-outline", label: "Study Time", value: "12h 30m" },
    { icon: "trophy-outline", label: "Achievements", value: "15" },
    { icon: "star-outline", label: "Rating", value: "4.8" },
  ];

  return (
    <LinearGradient
      colors={["#6b2488", "#151537", "#1a2c6b"]}
      locations={[0, 0.3, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.sidebar}
      >
        {/* Logo and App Name */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/logo.jpg")}
              style={styles.logo}
              alt="App Logo"
            />
          </View>
          <Text style={styles.appName}>Prep Notes</Text>
        </View>

        {/* User Profile Section */}
        {user && (
          <Pressable onPress={toggleQuickStats}>
            <LinearGradient
              colors={["rgba(107, 36, 136, 0.3)", "rgba(21, 21, 55, 0.3)"]}
              style={styles.userInfo}
            >
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: user.imageUrl }}
                  style={styles.profileImage}
                  alt="profile"
                />
                <View style={styles.statusIndicator} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userRole}>
                  {user.role} • Since {user.joinDate}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        )}

        {/* Quick Stats Section */}
        <Animated.View
          style={[
            styles.quickStats,
            {
              height: quickStatsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 120],
              }),
              opacity: quickStatsAnim,
            },
          ]}
        >
          {quickStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Ionicons name={stat.icon} size={24} color="#F4EBD0" />
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Navigation Links */}
        <View style={styles.navLinksContainer}>
          {[
            { name: "Profile", icon: "person-outline" },
            { name: "Settings", icon: "settings-outline" },
            { name: "Help", icon: "help-circle-outline" },
          ].map((link) => (
            <Pressable
              key={link.name}
              style={({ pressed }) => [
                styles.navLink,
                activeLink === link.name && styles.navLinkActive,
                pressed && styles.navLinkPressed,
              ]}
              onPress={() => {
                setActiveLink(link.name);
                navigation.navigate(link.name);
              }}
            >
              <Ionicons name={link.icon} size={24} color="#F4EBD0" />
              <Text style={styles.navLinkText}>{link.name}</Text>
              {link.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{link.badge}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Developer Mention Section */}
        <View style={styles.footer}>
          <LinearGradient
            colors={["rgba(107, 36, 136, 0.2)", "rgba(21, 21, 55, 0.2)"]}
            style={styles.footerContent}
          >
            <Text style={styles.footerText}>Developed by Khalique Hussain</Text>
            <Text style={styles.footerSubtext}>
              for any queries contact me at-
            </Text>

            {/* Social Media Icons */}
            <View style={styles.socialMediaIcons}>
              {[
                {
                  name: "facebook",
                  color: "#3b5998",
                  url: "https://facebook.com",
                },
                {
                  name: "twitter",
                  color: "#1da1f2",
                  url: "https://x.com/KhaliqHussainnn",
                },
                {
                  name: "instagram",
                  color: "#e1306c",
                  url: "https://www.instagram.com/khaliqhussain_/",
                },
                {
                  name: "linkedin",
                  color: "#0077b5",
                  url: "http://linkedin.com/in/khaliquehussain7",
                },
              ].map((social, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.socialIcon,
                    { backgroundColor: `${social.color}20` },
                  ]}
                  onPress={() => handleSocialMediaPress(social.url)}
                >
                  <FontAwesome
                    name={social.name}
                    size={24}
                    color={social.color}
                  />
                </Pressable>
              ))}
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingBottom: 80,
  },
  sidebar: {
    flex: 1,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 64, // Increased padding to ensure bottom content is visible
    flexGrow: 1,
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoWrapper: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F4EBD0",
    marginTop: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  profileImageContainer: {
    position: "relative",
    padding: 3,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#151537",
  },
  userDetails: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F4EBD0",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(244, 235, 208, 0.7)",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    color: "rgba(244, 235, 208, 0.5)",
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    overflow: "hidden",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(244, 235, 208, 0.7)",
    marginTop: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F4EBD0",
  },
  navLinksContainer: {
    gap: 12,
    marginBottom: 36,
  },
  navLink: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  navLinkActive: {
    backgroundColor: "rgba(107, 36, 136, 0.3)",
    borderColor: "#6b2488",
  },
  navLinkPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    transform: [{ scale: 0.98 }],
  },
  navLinkText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F4EBD0",
    marginLeft: 12,
    flex: 1,
  },
  badge: {
    backgroundColor: "#6b2488",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    position: "absolute",
    right: 16,
  },
  badgeText: {
    color: "#F4EBD0",
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 24,
  },
  footerContent: {
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
  },
  footerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F4EBD0",
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: "rgba(244, 235, 208, 0.7)",
    marginBottom: 16,
  },
  socialMediaIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialIcon: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
});

export default LeftSidebar;
