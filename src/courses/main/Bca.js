import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TextInput,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  Linking,
  SafeAreaView,
  StatusBar,
} from "react-native";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Navbar from "@/src/components/Navbar";

// Constants
const API_URL = "https://hamdard-docs.vercel.app";
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const INITIAL_FORM_STATE = {
  title: "",
  year: "",
  type: "",
  subject: "",
  course: "",
  folder: "",
};

const YEAR_MAPPING = {
  "1st Year": "2023",
  "2nd Year": "2024",
  "3rd Year": "2025",
};

const ResourcesScreen = () => {
  // State Management
  const [resources, setResources] = useState({ notes: {}, questions: {} });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  // Fetch Resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/files`, {
        params: { year: YEAR_MAPPING[selectedYear] },
      });
      setResources(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch resources";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchResources();
    }, [selectedYear])
  );

  // Handle File Opening
  const handleFileOpen = async (fileUrl) => {
    try {
      const supported = await Linking.canOpenURL(fileUrl);

      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert(
          "Cannot Open File",
          "Your device doesn't support opening this type of file.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error opening file:", error);
      Alert.alert("Error", "Unable to open the file. Please try again later.", [
        { text: "OK" },
      ]);
    }
  };

  // Form Input Handler
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Validate Form
  const validateForm = () => {
    const requiredFields = ["folder", "type"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert(
        "Required Fields",
        `Please fill in the following fields: ${missingFields.join(", ")}`,
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  // File Upload Handler
  const handleFileUpload = async () => {
    if (!validateForm()) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ACCEPTED_FILE_TYPES,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setUploading(true);

      const form = new FormData();
      form.append("file", {
        uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
        type: file.mimeType,
        name: file.name,
      });

      // Append form data
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          form.append(key, formData[key]);
        }
      });

      await axios.post(`${API_URL}/files`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (data) => data,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      Alert.alert("Success", "File uploaded successfully");
      setFormData(INITIAL_FORM_STATE);
      fetchResources();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload file";
      Alert.alert("Error", errorMessage);
      console.error("File upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Render File Item
  const renderFileItem = useCallback(
    ({ item: file }) => (
      <TouchableOpacity
        key={file.id}
        style={styles.fileItem}
        onPress={() => handleFileOpen(file.url)}
        activeOpacity={0.7}
      >
        <View style={styles.fileContent}>
          <View style={styles.fileHeader}>
            <MaterialIcons
              name={
                file.extension?.toUpperCase() === "PDF"
                  ? "picture-as-pdf"
                  : "description"
              }
              size={24}
              color="#ffffff"
              style={styles.fileIcon}
            />
            <Text style={styles.fileName} numberOfLines={1}>
              {file.title || "Untitled"}
            </Text>
            <View style={styles.fileTypeBadge}>
              <Text style={styles.fileType}>{file.extension}</Text>
            </View>
          </View>

          <View style={styles.fileDetails}>
            {file.subject && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{file.subject}</Text>
              </View>
            )}
            {file.year && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{file.year}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ),
    []
  );

  // Render Input Field
  const renderInput = useCallback(
    ({ placeholder, value, key, required = false }) => (
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, formData[key] && styles.inputFilled]}
          placeholder={`${placeholder}${required ? " *" : ""}`}
          placeholderTextColor="#94a3b8"
          value={value}
          onChangeText={(text) => handleInputChange(key, text)}
        />
      </View>
    ),
    [formData]
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#6b2488', '#151537', '#1a2c6b']}
        locations={[0, 0.3, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.centered}
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </LinearGradient>
    );
  }
  return (
    <LinearGradient
      colors={["#6b2488", "#151537", "#1a2c6b"]}
      locations={[0, 0.3, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <Navbar />
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView
            style={styles.scrollView}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchResources}
                colors={["#ffffff"]}
              />
            }
          >
            <View style={styles.yearFilterContainer}>
              {["1st Year", "2nd Year", "3rd Year"].map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearFilterButton,
                    selectedYear === year && styles.yearFilterButtonSelected,
                  ]}
                  onPress={() => setSelectedYear(year)}
                >
                  <Text style={styles.yearFilterButtonText}>{year}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.uploadTitle}>Upload New Document</Text>
              <View style={styles.formContainer}>
                {renderInput({
                  placeholder: "Document Title",
                  value: formData.title,
                  key: "title",
                })}
                {renderInput({
                  placeholder: "Year",
                  value: formData.year,
                  key: "year",
                })}
                {renderInput({
                  placeholder: "Type (notes/questions)",
                  value: formData.type,
                  key: "type",
                  required: true,
                })}
                {renderInput({
                  placeholder: "Subject",
                  value: formData.subject,
                  key: "subject",
                })}
                {renderInput({
                  placeholder: "Course",
                  value: formData.course,
                  key: "course",
                })}
                {renderInput({
                  placeholder: "Folder Name",
                  value: formData.folder,
                  key: "folder",
                  required: true,
                })}

                <TouchableOpacity
                  style={[
                    styles.uploadButton,
                    uploading && styles.uploadButtonDisabled,
                  ]}
                  onPress={handleFileUpload}
                  disabled={uploading}
                >
                  <View style={styles.uploadButtonContent}>
                    {uploading && (
                      <ActivityIndicator
                        size="small"
                        color="#ffffff"
                        style={styles.uploadingSpinner}
                      />
                    )}
                    <Text style={styles.uploadButtonText}>
                      {uploading ? "Uploading..." : "Select & Upload Document"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {Object.entries(resources).map(([section, folders]) => (
              <View key={section} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Text>
                {Object.keys(folders).length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <MaterialIcons
                      name="folder-open"
                      size={48}
                      color="#94a3b8"
                    />
                    <Text style={styles.emptyText}>No {section} available</Text>
                  </View>
                ) : (
                  Object.entries(folders).map(([folderName, files]) => (
                    <View key={folderName} style={styles.folderContainer}>
                      <View style={styles.folderHeader}>
                        <MaterialIcons
                          name="folder"
                          size={24}
                          color="#ffffff"
                        />
                        <Text style={styles.folderTitle}>{folderName}</Text>
                      </View>
                      <View style={styles.filesGrid}>
                        {files.map((file) => renderFileItem({ item: file }))}
                      </View>
                    </View>
                  ))
                )}
              </View>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  yearFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  yearFilterButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#0F0F2E",
  },
  yearFilterButtonSelected: {
    backgroundColor: "#6b2488",
  },
  yearFilterButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  uploadSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 16,
  },
  formContainer: {
    gap: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    // backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
  },
  inputFilled: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderColor: "#ffffff",
  },
  uploadButton: {
    backgroundColor: "#6b2488",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  uploadButtonDisabled: {
    backgroundColor: "6b2488",
  },
  uploadButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingSpinner: {
    marginRight: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 16,
  },
  folderContainer: {
    // backgroundColor: "#54337A",
    borderRadius: 16,
    // padding: 16,
    marginBottom: 16,
  },
  folderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  folderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
  },
  filesGrid: {
    gap: 12,
  },
  fileItem: {
    // backgroundColor: "#54337A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#54337A",
    overflow: "hidden",
  },
  fileContent: {
    padding: 16,
  },
  fileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fileIcon: {
    marginRight: 8,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
    marginRight: 8,
  },
  fileTypeBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  fileType: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "500",
  },
  fileDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: "#ffffff",
  },
  emptyContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#ffffff",
    fontStyle: "italic",
  },
});

export default ResourcesScreen;
