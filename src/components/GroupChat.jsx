import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  Keyboard,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  getDatabase,
  ref,
  push,
  onValue,
  query,
  orderByChild,
  limitToLast,
} from "@firebase/database";
import { getAuth } from "@firebase/auth";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";

const GroupChat = () => {
  const { isDarkMode } = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(new Set());
  const [showUsersModal, setShowUsersModal] = useState(false);
  const flatListRef = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const auth = getAuth();
  const database = getDatabase();
  const MESSAGES_LIMIT = 50;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const messagesRef = ref(database, "messages");
    const messagesQuery = query(
      messagesRef,
      orderByChild("timestamp"),
      limitToLast(MESSAGES_LIMIT)
    );

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data)
          .map(([id, msg]) => ({
            id,
            ...msg,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        const uniqueUsers = new Set(messageList.map((msg) => msg.userEmail));
        setUsers(uniqueUsers);
        setMessages(messageList);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = () => {
    if (message.trim() && auth.currentUser) {
      const messagesRef = ref(database, "messages");
      push(messagesRef, {
        text: message.trim(),
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        timestamp: Date.now(),
        displayName: auth.currentUser.displayName || auth.currentUser.email.split("@")[0],
        photoURL: auth.currentUser.photoURL,
      });
      setMessage("");
      Keyboard.dismiss();
    }
  };

  const getInitials = (email) => {
    return email.split("@")[0].charAt(0).toUpperCase();
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const ProfileImage = ({ user, size = 40 }) => (
    <View style={[styles(isDarkMode).profileImage, { width: size, height: size }]}>
      {user.photoURL ? (
        <Image
          source={{ uri: user.photoURL }}
          style={[styles(isDarkMode).profileImage, { width: size, height: size }]}
        />
      ) : (
        <LinearGradient
          colors={isDarkMode ? ["#000000", "#1A1A1A"] : ["#0070F0", "#62B1DD"]}
          style={[styles(isDarkMode).profileImage, { width: size, height: size }]}
        >
          <Text style={styles(isDarkMode).profileInitials}>{getInitials(user.userEmail)}</Text>
        </LinearGradient>
      )}
    </View>
  );

  const renderMessage = ({ item, index }) => {
    const isCurrentUser = item.userId === auth.currentUser?.uid;
    const showDateHeader =
      index === 0 ||
      new Date(item.timestamp).toDateString() !==
        new Date(messages[index - 1].timestamp).toDateString();

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        {showDateHeader && (
          <View style={styles(isDarkMode).dateHeader}>
            <LinearGradient
              colors={isDarkMode ? ["#000000", "#1A1A1A"] : ["#0070F0", "#62B1DD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles(isDarkMode).dateHeaderGradient}
            >
              <Text style={styles(isDarkMode).dateHeaderText}>
                {new Date(item.timestamp).toLocaleDateString()}
              </Text>
            </LinearGradient>
          </View>
        )}
        <View style={[
          styles(isDarkMode).messageRow,
          isCurrentUser ? styles(isDarkMode).currentUserRow : styles(isDarkMode).otherUserRow
        ]}>
          {!isCurrentUser && <ProfileImage user={item} size={36} />}
          <LinearGradient
            colors={isCurrentUser ? ["#0070F0", "#62B1DD"] : isDarkMode ? ["#1A1A1A", "#2A2A2A"] : ["#ffffff", "#f8f9fa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles(isDarkMode).messageContainer,
              isCurrentUser ? styles(isDarkMode).currentUserMessage : styles(isDarkMode).otherUserMessage
            ]}
          >
            {!isCurrentUser && (
              <Text style={[
                styles(isDarkMode).userName,
                { color: isCurrentUser ? "#ffffff" : isDarkMode ? "#FFFFFF" : "#0070F0" }
              ]}>
                {item.displayName || item.userEmail.split("@")[0]}
              </Text>
            )}
            <Text style={[
              styles(isDarkMode).messageText,
              { color: isCurrentUser ? "#ffffff" : isDarkMode ? "#FFFFFF" : "#333333" }
            ]}>
              {item.text}
            </Text>
            <Text style={[
              styles(isDarkMode).timestamp,
              { color: isCurrentUser ? "#ffffff90" : isDarkMode ? "#FFFFFF90" : "#66666690" }
            ]}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </LinearGradient>
        </View>
      </Animated.View>
    );
  };

  const UsersModal = () => (
    <Modal
      visible={showUsersModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowUsersModal(false)}
    >
      <View style={styles(isDarkMode).modalContainer}>
        <LinearGradient
          colors={isDarkMode ? ["#1A1A1A", "#2A2A2A"] : ["#ffffff", "#62B1DD"]}
          style={styles(isDarkMode).modalContent}
        >
          <View style={styles(isDarkMode).modalHeader}>
            <Text style={styles(isDarkMode).modalTitle}>Active Users ({users.size})</Text>
            <TouchableOpacity
              style={styles(isDarkMode).closeButton}
              onPress={() => setShowUsersModal(false)}
            >
              <Ionicons name="close" size={24} color={isDarkMode ? "#FFFFFF" : "#0070F0"} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={Array.from(users)}
            renderItem={({ item }) => (
              <LinearGradient
                colors={isDarkMode ? ["#1A1A1A", "#2A2A2A"] : ["#ffffff", "#f8f9fa"]}
                style={styles(isDarkMode).modalUserItem}
              >
                <ProfileImage user={{ userEmail: item }} size={44} />
                <Text style={styles(isDarkMode).modalUserName}>{item.split("@")[0]}</Text>
              </LinearGradient>
            )}
            keyExtractor={(item) => item}
            ItemSeparatorComponent={() => <View style={styles(isDarkMode).userSeparator} />}
          />
        </LinearGradient>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles(isDarkMode).safeArea}>
        <LinearGradient
          colors={isDarkMode ? ["#1A1A1A", "#2A2A2A"] : ["#ffffff", "#62B1DD"]}
          style={styles(isDarkMode).loadingContainer}
        >
          <ActivityIndicator size="large" color={isDarkMode ? "#FFFFFF" : "#0070F0"} />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles(isDarkMode).safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles(isDarkMode).container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <LinearGradient
          colors={isDarkMode ? ["#1A1A1A", "#2A2A2A"] : ["#ffffff", "#62B1DD"]}
          locations={[0, 1]}
          style={styles(isDarkMode).container}
        >
          <View style={styles(isDarkMode).header}>
            <TouchableOpacity
              style={styles(isDarkMode).userButton}
              onPress={() => setShowUsersModal(true)}
            >
              <ProfileImage
                user={{ userEmail: auth.currentUser.email }}
                size={40}
              />
              <View style={styles(isDarkMode).userInfo}>
                <Text style={styles(isDarkMode).currentUserName}>
                  {auth.currentUser.displayName || auth.currentUser.email.split("@")[0]}
                </Text>
                <View style={styles(isDarkMode).onlineStatus}>
                  <View style={styles(isDarkMode).onlineIndicator} />
                  <Text style={styles(isDarkMode).onlineText}>Online</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            onLayout={() => flatListRef.current?.scrollToEnd()}
            ListEmptyComponent={
              <View style={styles(isDarkMode).emptyContainer}>
                <Ionicons name="chatbubble-outline" size={48} color={isDarkMode ? "#FFFFFF" : "#0070F0"} />
                <Text style={styles(isDarkMode).emptyText}>
                  No messages yet. Start the conversation!
                </Text>
              </View>
            }
          />

          <View
            style={styles(isDarkMode).inputContainer}
          >
            <TextInput
              style={styles(isDarkMode).input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              placeholderTextColor={isDarkMode ? "#888888" : "#888"}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles(isDarkMode).sendButton, !message.trim() && styles(isDarkMode).sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <View
                style={styles(isDarkMode).sendButtonGradient}
              >
                <Ionicons name="send" size={24} color={isDarkMode ? "#FFFFFF" : "#ffffff"} />
              </View>
            </TouchableOpacity>
          </View>

          <UsersModal />
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = (isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? "#0070F0" : "#0070F0",
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? "#62B1DD20" : "#62B1DD20",
    backgroundColor: isDark ? "#000" : "#62B1DD",
  },
  userButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: isDark ? "#0070F0" : "#f8f9fa",
    padding: 12,
    borderRadius: 24,
    alignSelf: "flex-start",
    shadowColor: isDark ? "#000" : "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    marginLeft: 12,
  },
  currentUserName: {
    color: isDark ? "#FFFFFF" : "#333333",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  onlineStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: isDark ? "#22c55e" : "#22c55e",
    marginRight: 6,
  },
  onlineText: {
    color: isDark ? "#FFFFFF" : "#666666",
    fontSize: 12,
  },
  profileImage: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileInitials: {
    color: isDark ? "#FFFFFF" : "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
    paddingHorizontal: 16,
  },
  currentUserRow: {
    justifyContent: "flex-end",
  },
  otherUserRow: {
    justifyContent: "flex-start",
  },
  messageContainer: {
    padding: 12,
    borderRadius: 20,
    maxWidth: "75%",
    marginHorizontal: 8,
    shadowColor: isDark ? "#000" : "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentUserMessage: {
    borderBottomRightRadius: 4,
  },
  otherUserMessage: {
    borderBottomLeftRadius: 4,
  },
  userName: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: "600",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 6,
    alignSelf: "flex-end",
  },
  dateHeader: {
    alignItems: "center",
    marginVertical: 20,
  },
  dateHeaderGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  dateHeaderText: {
    color: isDark ? "#FFFFFF" : "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 16 : 16,
    borderTopWidth: 1,
    borderTopColor: isDark ? "#62B1DD20" : "#62B1DD20",
    // backgroundColor: isDark ? "#62B1DD" : "#62B1DD",
  },
  input: {
    flex: 1,
    backgroundColor: isDark ? "#FFFFFF" : "#ffffff",
    color: isDark ? "#333333" : "#333333",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: isDark ? "#62B1DD30" : "#62B1DD30",
  },
  sendButton: {
    backgroundColor: isDark ? "#62B1DD" : "#62B1DD",
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: isDark ? "" : "",
  },
  sendButtonText: {
    color: isDark ? "#fff" : "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 12,
    padding: 16,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    color: isDark ? "#FFFFFF" : "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalUserItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.1)",
  },
  modalUserName: {
    color: isDark ? "#FFFFFF" : "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  closeButton: {
    backgroundColor: isDark ? "#6b2488" : "#6b2488",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: isDark ? "#FFFFFF" : "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    color: isDark ? "#FFFFFF" : "#543378",
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GroupChat;
