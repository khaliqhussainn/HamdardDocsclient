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
const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const courses = [
    {
      id: 1,
      name: "Courses",
      link: "Courses",
      icon: "book-outline",
    },
    {
      id: 2,
      name: "Roadmaps",
      link: "Roadmap",
      icon: "map-outline",
    },
    {
      id: 3,
      name: "JHU Entrance PYQ",
      link: "Entrance",
      icon: "school-outline",
    },
    {
      id: 4,
      name: "Study Planner",
      link: "StudyPlanner",
      icon: "calendar-outline",
    },
    {
      id: 5,
      name: "Group Chat",
      link: "GroupChat",
      icon: "chatbubbles-outline",
    },
  ];

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
      });
    }
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isSidebarOpen ? 0.3 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isSidebarOpen]);

  const renderCourse = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.courseContainer,
        { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
      onPress={() => navigation.navigate(item.link)}
    >
      <LinearGradient
        colors={["#e81cff", "#40c9ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.courseIconContainer}
      >
        <Ionicons name={item.icon} size={40} color="#fff" />
      </LinearGradient>
      <Text style={styles.courseName}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6b2488', '#151537', '#1a2c6b']}
        locations={[0, 0.3, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      <SafeAreaView style={styles.content}>
        <Navbar />

        {isSidebarOpen && (
          <LeftSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            user={user}
            navigation={navigation}
          />
        )}

        <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
          <FlatList
            data={courses}
            renderItem={renderCourse}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.coursesList}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

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
  content: {
    flex: 1,
    zIndex: 1,
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
    paddingBottom: 60, // Add padding to accommodate the bottom bar
  },
  coursesList: {
    padding: 16,
    gap: 16,
    paddingBottom: 20,
  },
  courseContainer: {
    overflow: 'hidden',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    width: width - 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(107, 36, 136, 0.15)', // Purple tint matching background
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: Platform.OS === 'web' ? 'blur(10px)' : undefined,
    ...Platform.select({
      ios: {
        shadowColor: "#e81cff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  courseIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#e81cff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.5,
    textShadowColor: 'rgba(232, 28, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
