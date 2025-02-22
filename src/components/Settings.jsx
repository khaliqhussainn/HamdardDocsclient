import React, { useContext } from "react";
import { View, Text, Switch, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeContext } from "../context/ThemeContext";

const Settings = () => {
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const toggleNotifications = () => {
    setNotificationsEnabled((prevState) => !prevState);
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ["#000000", "#1a1a1a"] : ["#0070F0", "#62B1DD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <LinearGradient
            colors={
              isDarkMode ? ["#000000", "#1a1a1a"] : ["#0070F0", "#62B1DD"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionIconContainer}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={isDarkMode ? "#ffffff" : "#FFF"}
            />
          </LinearGradient>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <Text style={styles.sectionDescription}>
              Manage your notifications
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#0070F0", true: "#62B1DD" }}
            thumbColor={notificationsEnabled ? "#0070F0" : "#224690"}
            style={styles.switch}
          />
        </View>

        <Pressable
          style={styles.section}
          onPress={() => navigation.navigate("Profile")}
          android_ripple={{ color: "rgba(232, 28, 255, 0.1)" }}
        >
          <LinearGradient
            colors={
              isDarkMode ? ["#000000", "#1a1a1a"] : ["#0070F0", "#62B1DD"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionIconContainer}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={isDarkMode ? "#ffffff" : "#FFF"}
            />
          </LinearGradient>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Profile Settings</Text>
            <Text style={styles.sectionDescription}>Manage your profile</Text>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={isDarkMode ? "#ffffff" : "#0070F0"}
          />
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Help")}>
          <View style={styles.section}>
            <LinearGradient
              colors={
                isDarkMode ? ["#000000", "#1a1a1a"] : ["#0070F0", "#62B1DD"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sectionIconContainer}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={isDarkMode ? "#ffffff" : "#FFF"}
              />
            </LinearGradient>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>App Settings</Text>
              <Text style={styles.sectionDescription}>
                Customize your experience
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={isDarkMode ? "#ffffff" : "#0070F0"}
            />
          </View>
        </Pressable>

        <View style={styles.section}>
          <LinearGradient
            colors={
              isDarkMode ? ["#000000", "#1a1a1a"] : ["#0070F0", "#62B1DD"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionIconContainer}
          >
            <Ionicons
              name="moon-outline"
              size={24}
              color={isDarkMode ? "#ffffff" : "#FFF"}
            />
          </LinearGradient>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Dark Mode</Text>
            <Text style={styles.sectionDescription}>Enable dark mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#0070F0", true: "#62B1DD" }}
            thumbColor={notificationsEnabled ? "#0070F0" : "#224690"}
            style={styles.switch}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#0070F0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#64748b",
  },
  switch: {
    transform: [{ scale: 0.9 }],
  },
});

export default Settings;
