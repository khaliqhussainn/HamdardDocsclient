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

const Profile = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [image, setImage] = useState(null);

  const gradientColors = ['#6b2488', '#151537', '#1a2c6b'];
  const gradientLocations = [0, 0.3, 1];
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
      <LinearGradient
        colors={gradientColors}
        locations={gradientLocations}
        start={gradientStart}
        end={gradientEnd}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Manage your profile information</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.userInfo}>
              <Pressable onPress={pickImage} style={styles.imageContainer}>
                <Image
                  source={{ uri: image ? image : user?.imageUrl }}
                  style={styles.profileImage}
                  alt="profile"
                />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={24} color="#fff" />
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
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />

              <Text style={styles.inputLabel}>Course</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your course"
                value={course}
                onChangeText={setCourse}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />

              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
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
                <View style={styles.optionIcon}>
                  <Ionicons name="help-circle" size={24} color="#6b2488" />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Help & Support</Text>
                  <Text style={styles.optionDescription}>
                    Get assistance and answers to your questions
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#6b2488" />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={handleLogout}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name="log-out" size={24} color="#dc2626" />
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, styles.logoutText]}>
                    Logout
                  </Text>
                  <Text style={styles.optionDescription}>
                    Sign out from your account
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#dc2626" />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
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
    borderColor: "#6b2488",
  },
  imageOverlay: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#6b2488",
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
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  inputContainer: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: -4,
  },
  input: {
    backgroundColor: '#2F2750',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButton: {
    backgroundColor: "#C900FF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    backgroundColor: "#581d70",
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    transform: [{ scale: 0.98 }],
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
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
    color: "#151537",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: "rgba(21, 21, 55, 0.7)",
  },
  logoutText: {
    color: "#dc2626",
  },
});

export default Profile;
