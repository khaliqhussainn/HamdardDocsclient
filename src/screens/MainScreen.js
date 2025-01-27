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
      colors={['rgba(107, 36, 136, 0.9)', 'rgba(26, 44, 107, 0.9)']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.cardHeader}>
        <LinearGradient
          colors={["#e81cff", "#40c9ff"]}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
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
        <LinearGradient
          colors={["#e81cff", "#40c9ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.learnMore}
        >
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </LinearGradient>
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
        colors={['#6b2488', '#151537', '#1a2c6b']}
        locations={[0, 0.3, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Explore Courses</Text>
          <Text style={styles.subtitle}>Find your perfect program</Text>
        </View>

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
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(107, 36, 136, 0.2)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#e81cff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  filterButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
  },
  scrollContent: {
    padding: 20,
  },
  courseCard: {
    height: 300,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#e81cff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cardBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  cardContent: {
    marginTop: 20,
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textShadowColor: 'rgba(232, 28, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  courseDescription: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  stat: {
    marginRight: 20,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginRight: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: 'rgba(232, 28, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  learnMore: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
});

export default MainScreen;