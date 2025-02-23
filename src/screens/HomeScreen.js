import React, { useState, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Platform,
  Animated,
  Easing,
} from "react-native";
import LeftSidebar from "../components/LeftSideBar";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth } from "firebase/auth";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

const QuickStatsCard = ({ icon, title, value, color, isDark }) => (
  <View style={styles(isDark).quickStatsCard}>
    <View style={[styles(isDark).statsIconContainer, { backgroundColor: color }]}>
      <Ionicons name={icon} size={24} color="#fff" />
    </View>
    <Text style={styles(isDark).statsValue}>{value}</Text>
    <Text style={styles(isDark).statsTitle}>{title}</Text>
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [studyHours, setStudyHours] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);
  const [studyStartTime, setStudyStartTime] = useState(null);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const STORAGE_KEYS = {
    STATS: (uid) => `stats_${uid}`,
    LAST_ACTIVE: (uid) => `lastActive_${uid}`,
    STUDY_START: (uid) => `studyStart_${uid}`,
    LAST_STUDY_DATE: (uid) => `lastStudyDate_${uid}`
  };

  const quickStats = [
    { icon: "time-outline", title: "Study Hours", value: studyHours.toFixed(1), color: "#4CAF50" },
    { icon: "trophy-outline", title: "Completed", value: completedQuizzes, color: "#FF9800" },
    { icon: "flame-outline", title: "Streak", value: streak, color: "#FF5722" },
  ];

  const courses = [
    {
      id: 1,
      name: "Courses",
      link: "Courses",
      icon: "book-outline",
      description: "Access your learning materials",
    },
    {
      id: 2,
      name: "Roadmaps",
      link: "Roadmap",
      icon: "map-outline",
      description: "Plan your learning journey",
    },
    {
      id: 3,
      name: "Quiz",
      link: "Quiz",
      icon: "school-outline",
      description: "Test your knowledge",
    },
    {
      id: 4,
      name: "Study Planner",
      link: "StudyPlanner",
      icon: "calendar-outline",
      description: "Organize your study schedule",
    },
    {
      id: 5,
      name: "Group Chat",
      link: "GroupChat",
      icon: "chatbubbles-outline",
      description: "Connect with fellow learners",
    },
  ];

  // Load user data and initialize study session
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
        uid: currentUser.uid
      });
      initializeSession(currentUser.uid);
    }
  }, []);

  // Handle sidebar animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isSidebarOpen ? 0.3 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isSidebarOpen]);

  // Save stats before app closes
  useEffect(() => {
    return () => {
      if (user?.uid) {
        handleStudySessionEnd();
      }
    };
  }, [user, studyHours, completedQuizzes, streak]);

  const initializeSession = async (uid) => {
    await loadStats(uid);
    await checkStreak(uid);
    startStudySession(uid);
  };

  const loadStats = async (uid) => {
    try {
      const statsString = await AsyncStorage.getItem(STORAGE_KEYS.STATS(uid));
      if (statsString) {
        const stats = JSON.parse(statsString);
        console.log("Loaded stats:", stats);
        setStudyHours(parseFloat(stats.studyHours) || 0);
        setCompletedQuizzes(parseInt(stats.completedQuizzes) || 0);
        setStreak(parseInt(stats.streak) || 0);
        setDailyGoal(parseInt(stats.dailyGoal) || 0);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const saveStats = async () => {
    try {
      if (!user?.uid) return;

      const stats = {
        studyHours,
        completedQuizzes,
        streak,
        dailyGoal,
        lastUpdated: new Date().toISOString()
      };

      await AsyncStorage.setItem(STORAGE_KEYS.STATS(user.uid), JSON.stringify(stats));
      console.log("Saved stats:", stats);
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  const startStudySession = async (uid) => {
    const now = new Date().getTime();
    setStudyStartTime(now);
    await AsyncStorage.setItem(STORAGE_KEYS.STUDY_START(uid), now.toString());

    // Start the study timer
    const interval = setInterval(async () => {
      const currentTime = new Date().getTime();
      const elapsedHours = (currentTime - now) / 3600000; // Convert milliseconds to hours

      setStudyHours(prevHours => {
        const newHours = prevHours + (1/60); // Add 1 minute worth of hours
        console.log("Updated study hours:", newHours.toFixed(1));
        return parseFloat(newHours.toFixed(1));
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  };

  const handleStudySessionEnd = async () => {
    if (!studyStartTime || !user?.uid) return;

    const endTime = new Date().getTime();
    const elapsedHours = (endTime - studyStartTime) / 3600000;

    setStudyHours(prevHours => {
      const newHours = prevHours + elapsedHours;
      console.log("Final study hours:", newHours.toFixed(1));
      return parseFloat(newHours.toFixed(1));
    });

    await saveStats();
    await AsyncStorage.removeItem(STORAGE_KEYS.STUDY_START(user.uid));
  };

  const checkStreak = async (uid) => {
    try {
      const lastStudyDateStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_STUDY_DATE(uid));
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (lastStudyDateStr) {
        const lastStudyDate = new Date(lastStudyDateStr);
        lastStudyDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today - lastStudyDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          // Already studied today, maintain streak
          console.log("Maintaining streak");
          return;
        } else if (diffDays === 1) {
          // Studied yesterday, increment streak
          setStreak(prevStreak => {
            const newStreak = prevStreak + 1;
            console.log("Incremented streak:", newStreak);
            return newStreak;
          });
        } else {
          // Missed a day, reset streak
          setStreak(1);
          console.log("Reset streak to 1");
        }
      } else {
        // First time studying
        setStreak(1);
        console.log("First time studying, set streak to 1");
      }

      await AsyncStorage.setItem(STORAGE_KEYS.LAST_STUDY_DATE(uid), today.toISOString());
      saveStats();
    } catch (error) {
      console.error('Error checking streak:', error);
    }
  };

  const updateCompletedQuizzes = async () => {
    const newQuizzes = completedQuizzes + 1;
    setCompletedQuizzes(newQuizzes);
    setDailyGoal(newQuizzes >= 5 ? 1 : 0);
    await saveStats();
  };

  const renderCourse = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles(isDarkMode).courseContainer,
        { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
      onPress={() => {
        if (item.name === "Quiz") {
          updateCompletedQuizzes();
        }
        navigation.navigate(item.link);
      }}
    >
      <View style={styles(isDarkMode).courseIconContainer}>
        <Ionicons name={item.icon} size={40} color="#fff" />
      </View>
      <View style={styles(isDarkMode).courseTextContainer}>
        <Text style={styles(isDarkMode).courseName}>{item.name}</Text>
        <Text style={styles(isDarkMode).courseDescription}>{item.description}</Text>
      </View>
    </Pressable>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View style={styles(isDarkMode).container}>
      <LinearGradient
        colors={isDarkMode ? ['#000000', '#000'] : ['#ffffff', '#B2E3FF', '#62B1DD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.6, 1]}
        style={styles(isDarkMode).backgroundGradient}
      />
      <View style={styles(isDarkMode).texturePattern} />

      <SafeAreaView style={styles(isDarkMode).content}>
        <Navbar />

        {isSidebarOpen && (
          <LeftSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            user={user}
            navigation={navigation}
          />
        )}

        <Animated.ScrollView
          style={[styles(isDarkMode).mainContent, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles(isDarkMode).headerContainer}>
            <Text style={styles(isDarkMode).greeting}>{getGreeting()},</Text>
            <Text style={styles(isDarkMode).userName}>{user?.name || 'Student'}</Text>
          </View>

          <View style={styles(isDarkMode).quickStatsContainer}>
            {quickStats.map((stat, index) => (
              <QuickStatsCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                color={stat.color}
                isDark={isDarkMode}
              />
            ))}
          </View>

          <Text style={styles(isDarkMode).sectionTitle}>Learning Resources</Text>

          <FlatList
            data={courses}
            renderItem={renderCourse}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles(isDarkMode).coursesList}
            scrollEnabled={false}
          />
        </Animated.ScrollView>

        <Pressable
          style={styles(isDarkMode).aiHelperButton}
          onPress={() => navigation.navigate("AIStudentHelper")}
        >
          <Ionicons name="help-circle-outline" size={30} color="#fff" />
        </Pressable>
      </SafeAreaView>
    </View>
  );
};

const styles = (isDark) => StyleSheet.create({
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
  texturePattern: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.12,
    backgroundImage: Platform.select({
      web: `
        linear-gradient(135deg, transparent 0%, transparent 45%,
        ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(98, 177, 221, 0.4)'} 45%,
        ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(98, 177, 221, 0.4)'} 55%,
        transparent 55%, transparent 100%),
        linear-gradient(-135deg, transparent 0%, transparent 45%,
        ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(98, 177, 221, 0.4)'} 45%,
        ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(98, 177, 221, 0.4)'} 55%,
        transparent 55%, transparent 100%)
      `,
      default: undefined,
    }),
    backgroundSize: '60px 60px',
  },
  content: {
    flex: 1,
    zIndex: 1,
    paddingBottom: 60,
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
    paddingBottom: 60,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 16,
    color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#2F2F2F',
    marginBottom: 20,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quickStatsCard: {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    padding: 16,
    width: (width - 48) / 3,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: isDark ? "#000" : "#62B1DD",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.15)' : '0 2px 4px rgba(98, 177, 221, 0.15)',
      },
    }),
  },
  statsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#2F2F2F',
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 12,
    color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#2F2F2F',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  coursesList: {
    padding: 16,
    gap: 16,
  },
  courseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(98, 177, 221, 0.4)' : 'rgba(98, 177, 221, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: isDark ? "#000" : "#62B1DD",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: isDark ? '0 4px 8px rgba(0, 0, 0, 0.15)' : '0 4px 8px rgba(98, 177, 221, 0.15)',
      },
    }),
  },
  courseIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0070F0",
    marginRight: 16,
    borderWidth: 2,
    borderColor: isDark ? 'rgba(98, 177, 221, 0.2)' : 'rgba(98, 177, 221, 0.2)',
  },
  courseTextContainer: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "600",
    color: isDark ? "#FFFFFF" : "#2F2F2F",
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#666',
  },
  aiHelperButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0070F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
});

export default HomeScreen;
