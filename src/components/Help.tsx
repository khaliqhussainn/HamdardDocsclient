import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const Help = () => {
  const handleContactPress = () => {
    Linking.openURL("mailto:khaliquehussain7@gmail.com").catch((err) =>
      console.error("Failed to open email:", err)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#62B1DD", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Help & Support</Text>
            <Text style={styles.subtitle}>
              Get assistance and learn how to use the app
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="book-outline" size={24} color="#62B1DD" />
                </View>
                <Text style={styles.sectionTitle}>How to Use the App</Text>
              </View>
              <Text style={styles.description}>
                Welcome to our app! Here are some tips to get you started:
              </Text>
              <View style={styles.stepContainer}>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <Text style={styles.stepText}>
                    Navigate through the Courses section to access free notes and
                    previous year question papers.
                  </Text>
                </View>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <Text style={styles.stepText}>
                    Use the settings to customize your experience.
                  </Text>
                </View>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <Text style={styles.stepText}>
                    If you need help, visit this help section.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="help-circle-outline"
                    size={24}
                    color="#62B1DD"
                  />
                </View>
                <Text style={styles.sectionTitle}>
                  Frequently Asked Questions
                </Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>
                  How do I change my profile picture?
                </Text>
                <Text style={styles.faqAnswer}>
                  Go to Profile Settings in the Settings menu and tap on your
                  profile image to update it.
                </Text>
              </View>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>
                  How can I access course materials?
                </Text>
                <Text style={styles.faqAnswer}>
                  Navigate to the Courses tab and select your desired course to
                  view available materials.
                </Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.contactCard,
                pressed && styles.cardPressed,
              ]}
              onPress={handleContactPress}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, styles.contactIcon]}>
                  <Ionicons name="mail-outline" size={24} color="#62B1DD" />
                </View>
                <Text style={styles.sectionTitle}>Contact Support</Text>
              </View>
              <Text style={styles.description}>
                Need additional help? Feel free to reach out to our support team.
              </Text>
              <View style={styles.emailContainer}>
                <Ionicons name="mail" size={20} color="#62B1DD" />
                <Text style={styles.emailText}>khaliquehussain7@gmail.com</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#e1e5ee",
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(98, 177, 221, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactIcon: {
    backgroundColor: "rgba(98, 177, 221, 0.3)",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  description: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 16,
    lineHeight: 24,
  },
  stepContainer: {
    gap: 16,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#62B1DD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
  },
  faqItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "rgba(98, 177, 221, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(98, 177, 221, 0.2)",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
  },
  contactCard: {
    borderWidth: 1,
    borderColor: "rgba(98, 177, 221, 0.2)",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(98, 177, 221, 0.1)",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  emailText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
});

export default Help;
