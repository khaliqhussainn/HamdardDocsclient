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
      <View style={styles.courseIconContainer}>
        <Ionicons name={item.icon} size={40} color="#fff" />
      </View>
      <Text style={styles.courseName}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#B2E3FF', '#62B1DD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.6, 1]}
        style={styles.backgroundGradient}
      />
      <View style={styles.texturePattern} />

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
        ${Platform.OS === 'web' ? '#62B1DD' : 'rgba(98, 177, 221, 0.4)'} 45%, 
        ${Platform.OS === 'web' ? '#62B1DD' : 'rgba(98, 177, 221, 0.4)'} 55%, 
        transparent 55%, transparent 100%),
        linear-gradient(-135deg, transparent 0%, transparent 45%, 
        ${Platform.OS === 'web' ? '#62B1DD' : 'rgba(98, 177, 221, 0.4)'} 45%,
        ${Platform.OS === 'web' ? '#62B1DD' : 'rgba(98, 177, 221, 0.4)'} 55%,
        transparent 55%, transparent 100%)
      `,
      default: undefined,
    }),
    backgroundSize: '60px 60px', // Increased pattern size
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
    paddingBottom: 60,
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
  backgroundColor: 'rgba(255, 255, 255, 0.85)', // Slightly more opaque for better readability
  borderWidth: 1,
  borderColor: 'rgba(98, 177, 221, 0.4)', // Lighter border color
  ...Platform.select({
    ios: {
      shadowColor: "#62B1DD",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15, // Reduced opacity for a softer shadow
      shadowRadius: 8,
    },
    android: {
      elevation: 3,
    },
    web: {
      boxShadow: '0 4px 8px rgba(98, 177, 221, 0.15)', // Softer shadow for web
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
    backgroundColor: "#0070F0",
    borderColor: "rgba(98, 177, 221, 0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#62B1DD",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(98, 177, 221, 0.25)',
      },
    }),
  },
  courseName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2F2F2F",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});