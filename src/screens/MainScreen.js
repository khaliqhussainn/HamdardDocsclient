import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

const CourseCard = ({ title, description, onPress, icon, isDarkMode }) => (
  <TouchableOpacity onPress={onPress} style={styles(isDarkMode).courseCard}>
    <LinearGradient
      colors={isDarkMode ? ["#0070F0", "#1A1A1A"] : ["#0070F0", "#62B1DD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles(isDarkMode).gradient}
    >
      <View style={styles(isDarkMode).cardHeader}>
        <LinearGradient
          colors={isDarkMode ? ["#000000", "#1A1A1A"] : ["#0070F0", "#62B1DD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles(isDarkMode).iconContainer}
        >
          <Ionicons name={icon} size={32} color={isDarkMode ? "#FFFFFF" : "#FFFFFF"} />
        </LinearGradient>
        <View style={styles(isDarkMode).cardBadge}>
          <Text style={styles(isDarkMode).badgeText}>Featured</Text>
        </View>
      </View>

      <View style={styles(isDarkMode).cardContent}>
        <Text style={styles(isDarkMode).courseTitle}>{title}</Text>
        <Text style={styles(isDarkMode).courseDescription}>{description}</Text>
      </View>

      <View style={styles(isDarkMode).statsContainer}>
        <View style={styles(isDarkMode).stat}>
          <Text style={styles(isDarkMode).statNumber}>3</Text>
          <Text style={styles(isDarkMode).statLabel}>Years</Text>
        </View>
        <View style={styles(isDarkMode).statDivider} />
        <View style={styles(isDarkMode).stat}>
          <Text style={styles(isDarkMode).statNumber}>6</Text>
          <Text style={styles(isDarkMode).statLabel}>Semesters</Text>
        </View>
        <TouchableOpacity>
          <LinearGradient
            colors={isDarkMode ? ["#3b82f6", "#60a5fa"] : ["#3b82f6", "#60a5fa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles(isDarkMode).learnMore}
          >
            <Text style={styles(isDarkMode).learnMoreText}>Open</Text>
            <Ionicons name="arrow-forward" size={16} color={isDarkMode ? "#FFFFFF" : "#FFFFFF"} style={styles(isDarkMode).learnMoreIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const MainScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const courses = [
    {
      title: "BCA",
      description: "Bachelor of Computer Applications",
      icon: "desktop-outline",
    },
    {
      title: "B.TECH",
      description: "Bachelor of Technology",
      icon: "construct-outline",
    },
    {
      title: "BSC",
      description: "Bachelor of Science",
      icon: "flask-outline",
    },
    {
      title: "MCA",
      description: "Master of Computer Applications",
      icon: "code-slash-outline",
    },
  ];

  return (
    <View style={styles(isDarkMode).container}>
      <LinearGradient
        colors={isDarkMode ? ['#000', '#000', 'rgba(59, 130, 246, 0.1)'] : ['rgba(59, 130, 246, 0.1)', 'rgba(255, 255, 255, 0)', 'rgba(59, 130, 246, 0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles(isDarkMode).backgroundGradient}
      />
      <View style={styles(isDarkMode).topDecoration} />
      <View style={styles(isDarkMode).bottomDecoration} />
      <SafeAreaView style={styles(isDarkMode).safeArea}>
        <LinearGradient
          colors={isDarkMode ? ['#1a365d', '#2563eb'] : ['#1a365d', '#2563eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles(isDarkMode).header}
        >
          <View style={styles(isDarkMode).headerTop}>
            <TouchableOpacity
              style={styles(isDarkMode).backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#FFFFFF" : "#FFFFFF"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles(isDarkMode).filterButton}>
              <Ionicons name="filter" size={24} color={isDarkMode ? "#FFFFFF" : "#FFFFFF"} />
            </TouchableOpacity>
          </View>
          <Text style={styles(isDarkMode).title}>Explore Courses</Text>
          <Text style={styles(isDarkMode).subtitle}>Find your perfect program</Text>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles(isDarkMode).scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              description={course.description}
              icon={course.icon}
              onPress={() => navigation.navigate(course.title)}
              isDarkMode={isDarkMode}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? "#1A1A1A" : '#f8fafc',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: isDark ? '#3b82f6' : '#3b82f6',
    opacity: 0.1,
    borderBottomRightRadius: width,
    transform: [{ translateX: -width * 0.3 }, { translateY: -width * 0.3 }],
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: isDark ? '#3b82f6' : '#3b82f6',
    opacity: 0.1,
    borderTopLeftRadius: width,
    transform: [{ translateX: width * 0.3 }, { translateY: width * 0.3 }],
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: isDark ? "#1e40af" : "#1e40af",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 12,
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.15)",
    borderRadius: 14,
  },
  filterButton: {
    padding: 12,
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.15)",
    borderRadius: 14,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: isDark ? "#FFFFFF" : "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? "#bfdbfe" : "#bfdbfe",
    marginBottom: 10,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
  },
  courseCard: {
    height: 320,
    marginBottom: 20,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: isDark ? "#1e40af" : "#1e40af",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    backgroundColor: isDark ? "#1A1A1A" : '#fff',
  },
  gradient: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.3)",
    shadowColor: isDark ? "#000" : "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.2)",
  },
  badgeText: {
    color: isDark ? "#FFFFFF" : "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  cardContent: {
    marginTop: 24,
  },
  courseTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: isDark ? "#FFFFFF" : "#FFFFFF",
    marginBottom: 8,
    textShadowColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  courseDescription: {
    fontSize: 16,
    color: isDark ? "#e0e7ff" : "#e0e7ff",
    lineHeight: 24,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.15)",
  },
  stat: {
    marginRight: 24,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.2)",
    marginRight: 24,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: isDark ? "#FFFFFF" : "#FFFFFF",
  },
  statLabel: {
    fontSize: 14,
    color: isDark ? "#e0e7ff" : "#e0e7ff",
    fontWeight: '500',
  },
  learnMore: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.2)",
  },
  learnMoreText: {
    color: isDark ? "#FFFFFF" : "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  learnMoreIcon: {
    marginLeft: 4,
  },
});

export default MainScreen;
