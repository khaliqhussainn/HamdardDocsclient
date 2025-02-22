import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";

const { width, height } = Dimensions.get("window");

const GEMINI_API_KEY = "AIzaSyCvoVrIPhY9nfN7ykkV5n-BWfBlg36e3WU";

const AIStudentHelper = () => {
  const { isDarkMode } = useTheme();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleButtonClick = async () => {
    if (!msg.trim()) return;

    const userMessage = { text: msg, sender: "user" };
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
    setMsg("");

    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: msg,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      let reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      reply = reply.replace(/\*/g, "");

      const geminiMessage = { text: reply, sender: "gemini" };
      setMessages((prevMessages) => [geminiMessage, ...prevMessages]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { text: "Error occurred", sender: "gemini" };
      setMessages((prevMessages) => [errorMessage, ...prevMessages]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <LinearGradient
      colors={
        item.sender === "user"
          ? isDarkMode
            ? ["#000000", "#1A1A1A"]
            : ["#0070F0", "#62B1DD"]
          : isDarkMode
          ? ["#1A1A1A", "#2A2A2A"]
          : ["#fff", "#fff"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles(isDarkMode).message,
        item.sender === "user"
          ? styles(isDarkMode).userMessage
          : styles(isDarkMode).assistantMessage,
      ]}
    >
      <Text
        style={[
          styles(isDarkMode).messageText,
          item.sender === "user"
            ? styles(isDarkMode).userMessageText
            : styles(isDarkMode).assistantMessageText,
        ]}
      >
        {item.text}
      </Text>
    </LinearGradient>
  );

  return (
    <View style={styles(isDarkMode).container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#000000" : "#0070F0"}
      />
      <LinearGradient
        colors={
          isDarkMode
            ? ["#000000", "#1A1A1A", "#2A2A2A"]
            : ["#0070F0", "#62B1DD", "#fff"]
        }
        locations={[0, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles(isDarkMode).gradient}
      >
        <SafeAreaView style={styles(isDarkMode).safeArea}>
          <View style={styles(isDarkMode).header}>
            <Text style={styles(isDarkMode).headerText}>
              Student AI Assistant
            </Text>
          </View>

          {messages.length === 0 && (
            <Animated.View
              style={[styles(isDarkMode).welcomeContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles(isDarkMode).welcomeText}>Welcome</Text>
              <Text style={styles(isDarkMode).subWelcomeText}>
                How can I help you today?
              </Text>
            </Animated.View>
          )}

          <KeyboardAvoidingView
            style={styles(isDarkMode).keyboardContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <FlatList
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles(isDarkMode).messagesContainer}
              inverted
              showsVerticalScrollIndicator={false}
            />

            <View style={styles(isDarkMode).inputContainer}>
              <TextInput
                style={styles(isDarkMode).input}
                placeholder="How can I help you?"
                placeholderTextColor={isDarkMode ? "#888888" : "rgba(255,255,255,0.8)"}
                value={msg}
                onChangeText={setMsg}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={styles(isDarkMode).sendButton}
                onPress={handleButtonClick}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={isDarkMode ? "#FFFFFF" : "#FFFFFF"} />
                ) : (
                  <Text style={styles(isDarkMode).sendButtonText}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      paddingVertical: 20,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.15)",
    },
    headerText: {
      color: isDark ? "#FFFFFF" : "#fff",
      fontSize: 24,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    welcomeContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    welcomeText: {
      fontSize: 32,
      fontWeight: "800",
      color: isDark ? "#FFFFFF" : "#fff",
      marginBottom: 12,
      letterSpacing: 0.5,
    },
    subWelcomeText: {
      fontSize: 18,
      color: isDark ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.9)",
      letterSpacing: 0.3,
    },
    keyboardContainer: {
      flex: 1,
      justifyContent: "flex-end",
    },
    messagesContainer: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    message: {
      maxWidth: "85%",
      padding: 16,
      borderRadius: 20,
      marginBottom: 12,
      shadowColor: isDark ? "#000000" : "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    userMessage: {
      alignSelf: "flex-end",
      borderBottomRightRadius: 4,
    },
    assistantMessage: {
      alignSelf: "flex-start",
      borderBottomLeftRadius: 4,
    },
    messageText: {
      fontSize: 16,
      lineHeight: 22,
      letterSpacing: 0.2,
    },
    userMessageText: {
      color: isDark ? "#FFFFFF" : "#fff",
    },
    assistantMessageText: {
      color: isDark ? "#FFFFFF" : "#2C3E50",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.1)",
      borderTopWidth: 1,
      borderTopColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.1)",
    },
    input: {
      flex: 1,
      maxHeight: 100,
      backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.15)",
      color: isDark ? "#FFFFFF" : "#fff",
      borderRadius: 24,
      paddingHorizontal: 20,
      paddingVertical: 12,
      marginRight: 12,
      fontSize: 16,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.2)",
    },
    sendButton: {
      backgroundColor: isDark ? "#000000" : "#0070F0",
      borderRadius: 24,
      padding: 16,
      width: 80,
      alignItems: "center",
      shadowColor: isDark ? "#000000" : "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sendButtonText: {
      color: isDark ? "#FFFFFF" : "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
  });

export default AIStudentHelper;
