import React, { useState, useCallback, useEffect } from "react";
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
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTheme } from "../../context/ThemeContext";

const API_URL = "https://hamdarddocs-backend.onrender.com/api";

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
  const { isDarkMode } = useTheme();
  const [resources, setResources] = useState({ notes: {}, questions: {} });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("1st Year"); // Default to "1st Year"

  const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 30000, // Increase timeout to 30 seconds
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const fetchResources = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedYear) {
        setResources({ notes: {}, questions: {} });
        return;
      }

      const response = await axiosInstance.get('/files', {
        params: { year: YEAR_MAPPING[selectedYear] }
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      setResources(response.data);
    } catch (err) {
      console.error('Resource fetch error:', err);

      // Retry logic for network errors with exponential backoff
      if (err.code === 'ECONNABORTED' && retryCount < 3) {
        const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Retrying request (${retryCount + 1}/3) after ${retryDelay / 1000} seconds...`);
        setTimeout(() => fetchResources(retryCount + 1), retryDelay);
        return;
      }

      const errorMessage = err.response?.data?.message ||
        err.message ||
        'Failed to fetch resources. Please try again.';

      setError(errorMessage);
      Alert.alert(
        "Error Fetching Resources",
        errorMessage,
        [
          {
            text: "Retry",
            onPress: () => fetchResources()
          },
          { text: "OK" }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchResources();
    }, [selectedYear])
  );

  useEffect(() => {
    fetchResources();
  }, []);

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
      Alert.alert(
        "Error",
        "Unable to open the file. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          form.append(key, formData[key]);
        }
      });

      await axiosInstance.post('/files', form, {
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
      console.error("File upload error:", error);
      const errorMessage = error.response?.data?.message || "Failed to upload file";
      Alert.alert("Error", errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const [downloadProgress, setDownloadProgress] = useState({});

  const handleFileDownload = async (fileUrl, fileName) => {
    try {
      const fileUri = FileSystem.documentDirectory + fileName;

      // Initialize progress for this file
      setDownloadProgress(prev => ({
        ...prev,
        [fileName]: 0
      }));

      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(prev => ({
            ...prev,
            [fileName]: progress
          }));
        }
      );

      const { uri } = await downloadResumable.downloadAsync();

      // Clear progress after successful download
      setDownloadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileName];
        return newProgress;
      });

      Alert.alert(
        "Download Complete",
        "Would you like to share or open this file?",
        [
          {
            text: "Share",
            onPress: () => Sharing.shareAsync(uri)
          },
          {
            text: "Open",
            onPress: () => Linking.openURL(uri)
          },
          { text: "Close" }
        ]
      );
    } catch (error) {
      console.error("Error downloading file:", error);
      // Clear progress on error
      setDownloadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileName];
        return newProgress;
      });
      Alert.alert(
        "Error",
        "Unable to download the file. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  const renderFileItem = useCallback(
    ({ item: file }) => (
      <View key={file.id} style={styles(isDarkMode).fileItem}>
        <LinearGradient
          colors={isDarkMode ? ['#1A1A1A', '#2A2A2A'] : ['#ffffff', '#f8f9fa']}
          style={styles(isDarkMode).fileContent}
        >
          <View style={styles(isDarkMode).fileHeaderGradient}>
            <LinearGradient
              colors={isDarkMode ? ['#000000', '#1A1A1A'] : ['#0070F0', '#62B1DD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles(isDarkMode).fileHeader}
            >
              <MaterialIcons
                name={file.extension?.toUpperCase() === "PDF" ? "picture-as-pdf" : "description"}
                size={24}
                color={isDarkMode ? "#FFFFFF" : "#ffffff"}
                style={styles(isDarkMode).fileIcon}
              />
              <Text style={styles(isDarkMode).fileName} numberOfLines={1}>
                {file.title || "Untitled"}
              </Text>
              <View style={styles(isDarkMode).fileTypeBadge}>
                <Text style={styles(isDarkMode).fileType}>{file.extension}</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles(isDarkMode).fileDetails}>
            {file.subject && (
              <View style={styles(isDarkMode).badge}>
                <Text style={styles(isDarkMode).badgeText}>{file.subject}</Text>
              </View>
            )}
            {file.year && (
              <View style={styles(isDarkMode).badge}>
                <Text style={styles(isDarkMode).badgeText}>{file.year}</Text>
              </View>
            )}
          </View>

          <View style={styles(isDarkMode).fileActions}>
            <TouchableOpacity
              style={styles(isDarkMode).fileActionButton}
              onPress={() => handleFileOpen(file.url)}
            >
              <LinearGradient
                colors={isDarkMode ? ['#000000', '#1A1A1A'] : ['#0070F0', '#62B1DD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles(isDarkMode).actionButtonGradient}
              >
                <MaterialIcons name="visibility" size={20} color={isDarkMode ? "#FFFFFF" : "#ffffff"} />
                <Text style={styles(isDarkMode).fileActionText}>View</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles(isDarkMode).fileActionButton}
              onPress={() => handleFileDownload(file.url, file.title || "Untitled")}
              disabled={downloadProgress[file.title] !== undefined}
            >
              <LinearGradient
                colors={isDarkMode ? ['#000000', '#1A1A1A'] : ['#0070F0', '#62B1DD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles(isDarkMode).actionButtonGradient}
              >
                {downloadProgress[file.title] !== undefined ? (
                  <>
                    <ActivityIndicator size="small" color={isDarkMode ? "#FFFFFF" : "#ffffff"} />
                    <Text style={styles(isDarkMode).fileActionText}>
                      {Math.round(downloadProgress[file.title] * 100)}%
                    </Text>
                  </>
                ) : (
                  <>
                    <MaterialIcons name="file-download" size={20} color={isDarkMode ? "#FFFFFF" : "#ffffff"} />
                    <Text style={styles(isDarkMode).fileActionText}>Download</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    ),
    [downloadProgress]
  );

  const renderInput = useCallback(
    ({ placeholder, value, key, required = false }) => (
      <View style={styles(isDarkMode).inputContainer}>
        <TextInput
          style={[styles(isDarkMode).input, formData[key] && styles(isDarkMode).inputFilled]}
          placeholder={`${placeholder}${required ? " *" : ""}`}
          placeholderTextColor={isDarkMode ? "#94a3b8" : "#94a3b8"}
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
        colors={isDarkMode ? ["#1A1A1A", "#2A2A2A"] : ["#62B1DD", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 1]}
        style={styles(isDarkMode).centered}
      >
        <ActivityIndicator size="large" color={isDarkMode ? "#FFFFFF" : "#ffffff"} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={isDarkMode ? ["#000000", "#000"] : ["#0070F0", "#62B1DD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles(isDarkMode).gradientBackground}
    >
      <SafeAreaView style={styles(isDarkMode).safeArea}>
        {/* Custom content in SafeAreaView */}
        <Text style={styles(isDarkMode).customHeader}>PrepNotes</Text>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles(isDarkMode).container}
        >
          <ScrollView
            style={styles(isDarkMode).scrollView}
            contentContainerStyle={styles(isDarkMode).scrollViewContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchResources}
                colors={isDarkMode ? ["#FFFFFF"] : ["#0070F0"]}
                tintColor={isDarkMode ? "#FFFFFF" : "#ffffff"}
              />
            }
          >
            {error && (
              <View style={styles(isDarkMode).errorContainer}>
                <Text style={styles(isDarkMode).errorText}>{error}</Text>
              </View>
            )}

            <View style={styles(isDarkMode).yearFilterContainer}>
              {["1st Year", "2nd Year", "3rd Year"].map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles(isDarkMode).yearFilterButton,
                    selectedYear === year && styles(isDarkMode).yearFilterButtonSelected,
                  ]}
                  onPress={() => setSelectedYear(year)}
                >
                  <Text
                    style={[
                      styles(isDarkMode).yearFilterButtonText,
                      selectedYear === year && styles(isDarkMode).yearFilterButtonTextSelected,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles(isDarkMode).uploadSection}>
              <View style={styles(isDarkMode).uploadTitleContainer}>
                <MaterialIcons name="cloud-upload" size={28} color={isDarkMode ? "#FFFFFF" : "#0070F0"} />
                <Text style={styles(isDarkMode).uploadTitle}>Upload New Document</Text>
              </View>
              <View style={styles(isDarkMode).formContainer}>
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
                  style={[styles(isDarkMode).uploadButton, uploading && styles(isDarkMode).uploadButtonDisabled]}
                  onPress={handleFileUpload}
                  disabled={uploading}
                >
                  <LinearGradient
                    colors={isDarkMode ? ["#000000", "#1A1A1A"] : ["#0070F0", "#62B1DD"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles(isDarkMode).uploadButtonGradient}
                  >
                    <View style={styles(isDarkMode).uploadButtonContent}>
                      {uploading ? (
                        <ActivityIndicator size="small" color={isDarkMode ? "#FFFFFF" : "#ffffff"} style={styles(isDarkMode).uploadingSpinner} />
                      ) : (
                        <MaterialIcons name="cloud-upload" size={24} color={isDarkMode ? "#FFFFFF" : "#ffffff"} style={styles(isDarkMode).uploadIcon} />
                      )}
                      <Text style={styles(isDarkMode).uploadButtonText}>
                        {uploading ? "Uploading..." : "Select & Upload Document"}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {Object.entries(resources).map(([section, folders]) => (
              <View key={section} style={styles(isDarkMode).section}>
                <View style={styles(isDarkMode).sectionHeaderContainer}>
                  <MaterialIcons
                    name={section === "notes" ? "description" : "help"}
                    size={24}
                    color={isDarkMode ? "#FFFFFF" : "#62B1DD"}
                  />
                  <Text style={styles(isDarkMode).sectionTitle}>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Text>
                </View>
                {Object.keys(folders).length === 0 ? (
                  <View style={styles(isDarkMode).emptyContainer}>
                    <MaterialIcons name="folder-open" size={48} color={isDarkMode ? "#94a3b8" : "#94a3b8"} />
                    <Text style={styles(isDarkMode).emptyText}>No {section} available</Text>
                  </View>
                ) : (
                  Object.entries(folders).map(([folderName, files]) => (
                    <View key={folderName} style={styles(isDarkMode).folderContainer}>
                      <View style={styles(isDarkMode).folderHeader}>
                        <MaterialIcons name="folder" size={24} color={isDarkMode ? "#FFFFFF" : "#ffffff"} />
                        <Text style={styles(isDarkMode).folderTitle}>{folderName}</Text>
                      </View>
                      <View style={styles(isDarkMode).filesGrid}>
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

const styles = (isDark) => StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  customHeader: {
    fontSize: 28,
    fontWeight: "bold",
    color: isDark ? "#FFFFFF" : "#FFF",
    textAlign: "center",
    marginVertical: 10,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: isDark ? '#FFE5E5' : '#FFE5E5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#FF8888' : '#FF8888',
  },
  errorText: {
    color: isDark ? '#CC0000' : '#CC0000',
    fontSize: 14,
    textAlign: 'center',
  },
  yearFilterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  yearFilterButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    borderColor: isDark ? "#62B1DD" : "#62B1DD",
    minWidth: 100,
    alignItems: "center",
    shadowColor: isDark ? "#000" : "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  yearFilterButtonSelected: {
    backgroundColor: isDark ? "#0070F0" : "#62B1DD",
    borderColor: isDark ? "#0070F0" : "#62B1DD",
  },
  yearFilterButtonText: {
    color: isDark ? "#62B1DD" : "#62B1DD",
    fontWeight: "600",
    fontSize: 16,
  },
  yearFilterButtonTextSelected: {
    color: isDark ? "#FFFFFF" : "#FFFFFF",
  },
  uploadSection: {
    backgroundColor: isDark ? "#1A1A1A" : "#ffffff",
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: isDark ? "#000" : "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: isDark ? "#FFFFFF" : "#62B1DD",
    marginBottom: 20,
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 0,
  },
  input: {
    backgroundColor: isDark ? "#2A2A2A" : "#f8f9fa",
    borderWidth: 1.5,
    borderColor: isDark ? "#3A3A3A" : "#e9ecef",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: isDark ? "#FFFFFF" : "#333333",
    shadowColor: isDark ? "#000" : "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputFilled: {
    backgroundColor: isDark ? "#2A2A2A" : "#f8f9fa",
    borderColor: isDark ? "#62B1DD" : "#62B1DD",
  },
  uploadButtonGradient: {
    borderRadius: 12,
    padding: 16,
  },
  uploadButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadButtonText: {
    color: isDark ? "#FFFFFF" : "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    padding: 8,
    backgroundColor: isDark ? "#1A1A1A" : "#ffffff",
    margin: 16,
    borderRadius: 20,
    shadowColor: isDark ? "#000" : "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  sectionHeaderContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: isDark ? "#FFFFFF" : "#62B1DD",
    marginLeft: 8,
  },
  folderContainer: {
    borderRadius: 16,
    marginBottom: 16,
    borderColor: isDark ? "#3A3A3A" : "#e9ecef",
    shadowColor: isDark ? "#000" : "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  folderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: isDark ? "#0070F0" : "#62B1DD",
    padding: 12,
    borderRadius: 12,
  },
  folderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: isDark ? "#FFFFFF" : "#FFFFFF",
    marginLeft: 8,
  },
  filesGrid: {
    gap: 16,
  },
  fileItem: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: isDark ? "#000" : "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  fileContent: {
    borderRadius: 16,
  },

  fileHeaderGradient: {
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  fileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  fileName: {
    fontSize: 16,
    fontWeight: "700",
    color: isDark ? "#FFFFFF" : "#FFFFFF",
    flex: 1,
    marginRight: 8,
  },

  fileIcon: {
    marginRight: 8,
  },

  fileTypeBadge: {
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fileType: {
    fontSize: 12,
    color: isDark ? "#FFFFFF" : "#FFFFFF",
    fontWeight: "500",
  },
  fileDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 16,
    backgroundColor: isDark ? "#000" : '#ffffff',
  },

  badge: {
    backgroundColor: isDark ? "#3A3A3A" : "#f0f9ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDark ? "#62B1DD" : "#62B1DD",
  },
  badgeText: {
    fontSize: 13,
    color: isDark ? "#FFFFFF" : "#0070F0",
    fontWeight: "600",
  },

  fileActions: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: isDark ? "#000" : '#ffffff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  fileActionButton: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    elevation: 2,
    shadowColor: isDark ? "#000" : "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },

  fileActionText: {
    color: isDark ? "#FFFFFF" : "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyContainer: {
    backgroundColor: isDark ? "#2A2A2A" : "#f8f9fa",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: isDark ? "#3A3A3A" : "#e9ecef",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 16,
    color: isDark ? "#94a3b8" : "#94a3b8",
    fontStyle: "italic",
    marginTop: 12,
  },
});

export default ResourcesScreen;
