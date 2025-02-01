import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';

// Updated color scheme
const PRIMARY_COLOR = "#62B1DD";
const SECONDARY_COLOR = "#4B8FB3";
const ACCENT_COLOR = "#3A7DA1";
const BACKGROUND_COLOR = "#FFFFFF";
const TEXT_DARK = "#2C3E50";
const TEXT_LIGHT = "#607D8B";

const Profile = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [image, setImage] = useState(null);

  const gradientColors = ["#0070F0", "#62B1DD"];
  const gradientLocations = [0, 0.5, 1];
  const gradientStart = { x: 0, y: 0 };
  const gradientEnd = { x: 1, y: 1 };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
        imageUrl: currentUser.photoURL || "../../assets/profile-photo.jpg",
      });
      setName(currentUser.displayName || "");
      setCourse("");
    }
  }, [auth.currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Auth");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleUpdateProfile = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      updateProfile(currentUser, {
        displayName: name,
        photoURL: image ? image : user.imageUrl,
      })
        .then(() => {
          setUser({
            name: name,
            email: currentUser.email,
            imageUrl: image ? image : user.imageUrl,
          });
          Alert.alert("Success", "Profile updated successfully!");
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent} 
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        <LinearGradient
          colors={gradientColors}
          locations={gradientLocations}
          start={gradientStart}
          end={gradientEnd}
          style={styles.header}
        >
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Manage your profile information</Text>
        </LinearGradient>

        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <View style={styles.userInfo}>
              <Pressable onPress={pickImage} style={styles.imageContainer}>
                <Image
                  source={{ uri: image ? image : user?.imageUrl }}
                  style={styles.profileImage}
                  alt="profile"
                />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={24} color={BACKGROUND_COLOR} />
                </View>
              </Pressable>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                placeholderTextColor={TEXT_LIGHT}
              />

              <Text style={styles.inputLabel}>Course</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your course"
                value={course}
                onChangeText={setCourse}
                placeholderTextColor={TEXT_LIGHT}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleUpdateProfile}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={gradientStart}
                  end={gradientEnd}
                  style={styles.gradientButton}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.optionsContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => navigation.navigate("Help")}
              >
                <View style={[styles.optionIcon, { backgroundColor: PRIMARY_COLOR }]}>
                  <Ionicons name="help-circle" size={24} color={BACKGROUND_COLOR} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Help & Support</Text>
                  <Text style={styles.optionDescription}>
                    Get assistance and answers to your questions
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={PRIMARY_COLOR} />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={handleLogout}
              >
                <View style={[styles.optionIcon, { backgroundColor: "#FF5757" }]}>
                  <Ionicons name="log-out" size={24} color={BACKGROUND_COLOR} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, styles.logoutText]}>
                    Logout
                  </Text>
                  <Text style={styles.optionDescription}>
                    Sign out from your account
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#FF5757" />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  contentContainer: {
    flex: 1,
    marginTop: -20,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: BACKGROUND_COLOR,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  card: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: PRIMARY_COLOR,
  },
  imageOverlay: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userDetails: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: TEXT_DARK,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: TEXT_LIGHT,
  },
  inputContainer: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: -4,
  },
  input: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: TEXT_DARK,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  saveButton: {
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  gradientButton: {
    padding: 16,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    color: BACKGROUND_COLOR,
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: TEXT_DARK,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  optionPressed: {
    backgroundColor: "#F7FAFC",
    transform: [{ scale: 0.98 }],
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: TEXT_LIGHT,
  },
  logoutText: {
    color: "#FF5757",
  },
});

export default Profile;