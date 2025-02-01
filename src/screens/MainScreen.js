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

const { width } = Dimensions.get("window");

const CourseCard = ({ title, description, onPress, icon }) => (
  <TouchableOpacity onPress={onPress} style={styles.courseCard}>
    <LinearGradient
      colors={["#0070F0", "#62B1DD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.cardHeader}>
        <LinearGradient
          colors={["#0070F0", "#62B1DD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <Ionicons name={icon} size={32} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.cardBadge}>
          <Text style={styles.badgeText}>Featured</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.courseTitle}>{title}</Text>
        <Text style={styles.courseDescription}>{description}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Years</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Semesters</Text>
        </View>
        <TouchableOpacity>
          <LinearGradient
            colors={["#3b82f6", "#60a5fa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.learnMore}
          >
            <Text style={styles.learnMoreText}>Open</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={styles.learnMoreIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const MainScreen = ({ navigation }) => {
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
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.1)', 'rgba(255, 255, 255, 0)', 'rgba(59, 130, 246, 0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />
      <View style={styles.topDecoration} />
      <View style={styles.bottomDecoration} />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#1a365d', '#2563eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Explore Courses</Text>
          <Text style={styles.subtitle}>Find your perfect program</Text>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              description={course.description}
              icon={course.icon}
              onPress={() => navigation.navigate(course.title)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    backgroundColor: '#3b82f6',
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
    backgroundColor: '#3b82f6',
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
    shadowColor: "#1e40af",
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
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 14,
  },
  filterButton: {
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 14,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#bfdbfe",
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
    shadowColor: "#1e40af",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    backgroundColor: '#fff',
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
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
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
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  cardContent: {
    marginTop: 24,
  },
  courseTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  courseDescription: {
    fontSize: 16,
    color: "#e0e7ff",
    lineHeight: 24,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
  },
  stat: {
    marginRight: 24,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 24,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 14,
    color: "#e0e7ff",
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
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  learnMoreText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  learnMoreIcon: {
    marginLeft: 4,
  },
});

export default MainScreen;