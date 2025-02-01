import React, { useState, useEffect, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
  Animated,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import LeftSidebar from "./LeftSideBar";
import Ionicons from "react-native-vector-icons/Ionicons";

const Navbar = () => {
  const navigation = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Animated value for pulsing effect
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animation setup for pulsing AI icon
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <>
      <View style={styles.header}>
        {/* Sidebar Toggle */}
        <Pressable
          style={styles.menuButton}
          onPress={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <MaterialCommunityIcons name="menu" size={30} color="#fff" />
        </Pressable>

        {/* App Name */}
        <Text style={styles.appName}>PrepNotes</Text>

        {/* Animated AI Brain Icon */}
        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.navigate("GroupChat")}
        >
          <Animated.View
            style={{
              transform: [
                {
                  scale: pulseAnim,
                },
              ],
            }}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={30}
              color="#0070F0"
            ></Ionicons>
          </Animated.View>
        </Pressable>
      </View>

      {/* Sidebar */}
      {isSidebarOpen && (
        <LeftSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          navigation={navigation}
        />
      )}
    </>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
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
    }),
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#0070F0",
  },
  appName: {
    color: "#0070F0",
    fontSize: 20,
    fontWeight: "600",
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
