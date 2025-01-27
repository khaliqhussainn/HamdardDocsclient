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
const { width, height } = Dimensions.get("window");

const GEMINI_API_KEY = "AIzaSyCvoVrIPhY9nfN7ykkV5n-BWfBlg36e3WU";

const AIStudentHelper = () => {
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
      let reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
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
      colors={item.sender === "user" 
        ? ['#6b2488', '#151537']
        : ['#ffffff', '#ffffff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.message,
        item.sender === "user" ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === "user"
            ? styles.userMessageText
            : styles.assistantMessageText,
        ]}
      >
        {item.text}
      </Text>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151537" />
      <LinearGradient
        colors={['#6b2488', '#151537', '#1a2c6b']}
        locations={[0, 0.3, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Student AI Assistant</Text>
          </View>

          {messages.length === 0 && (
            <Animated.View
              style={[styles.welcomeContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.subWelcomeText}>How can I help you today?</Text>
            </Animated.View>
          )}

          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <FlatList
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.messagesContainer}
              inverted
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="How can I help you?"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={msg}
                onChangeText={setMsg}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleButtonClick}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.sendButtonText}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  welcomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subWelcomeText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  messagesContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  message: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  assistantMessageText: {
    color: "#151537",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "rgba(255,255,255,0.1)",
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  sendButton: {
    backgroundColor: "#C900FF",
    borderRadius: 20,
    padding: 12,
    width: 70,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default AIStudentHelper;