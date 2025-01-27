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

const GroupChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(new Set());
  const [showUsersModal, setShowUsersModal] = useState(false);
  const flatListRef = useRef();
  const auth = getAuth();
  const database = getDatabase();
  const MESSAGES_LIMIT = 50;

  // Gradient configuration
  const gradientColors = ["#6b2488", "#151537", "#1a2c6b"];
  const gradientLocations = [0, 0.3, 1];
  const gradientStart = { x: 0, y: 0 };
  const gradientEnd = { x: 1, y: 1 };

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
        displayName:
          auth.currentUser.displayName || auth.currentUser.email.split("@")[0],
        photoURL: auth.currentUser.photoURL,
      });
      setMessage("");
    }
  };

  const getInitials = (email) => {
    return email.charAt(0).toUpperCase();
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return (
        "Yesterday " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const ProfileImage = ({ user, size = 40 }) => (
    <View style={[styles.profileImage, { width: size, height: size }]}>
      {user.photoURL ? (
        <Image
          source={{ uri: user.photoURL }}
          style={[styles.profileImage, { width: size, height: size }]}
        />
      ) : (
        <Text style={styles.profileInitials}>
          {getInitials(user.userEmail)}
        </Text>
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
      <>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageRow,
            isCurrentUser ? styles.currentUserRow : styles.otherUserRow,
          ]}
        >
          {!isCurrentUser && <ProfileImage user={item} size={32} />}
          <LinearGradient
            colors={
              isCurrentUser ? ["#6b2488", "#1a2c6b"] : ["#151537", "#1a2c6b"]
            }
            start={gradientStart}
            end={gradientEnd}
            style={[
              styles.messageContainer,
              isCurrentUser
                ? styles.currentUserMessage
                : styles.otherUserMessage,
            ]}
          >
            {!isCurrentUser && (
              <Text style={styles.userName}>
                {item.displayName || item.userEmail.split("@")[0]}
              </Text>
            )}
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </LinearGradient>
        </View>
      </>
    );
  };

  const UsersModal = () => (
    <Modal
      visible={showUsersModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowUsersModal(false)}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={gradientColors}
          locations={gradientLocations}
          start={gradientStart}
          end={gradientEnd}
          style={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Active Users ({users.size})</Text>
          <FlatList
            data={Array.from(users)}
            renderItem={({ item }) => (
              <View style={styles.modalUserItem}>
                <ProfileImage user={{ userEmail: item }} size={40} />
                <Text style={styles.modalUserName}>{item.split("@")[0]}</Text>
              </View>
            )}
            keyExtractor={(item) => item}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowUsersModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={gradientColors}
          locations={gradientLocations}
          start={gradientStart}
          end={gradientEnd}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="#fff" />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <LinearGradient
          colors={gradientColors}
          locations={gradientLocations}
          start={gradientStart}
          end={gradientEnd}
          style={styles.container}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.userButton}
              onPress={() => setShowUsersModal(true)}
            >
              <ProfileImage
                user={{ userEmail: auth.currentUser.email }}
                size={32}
              />
              <View style={styles.userInfo}>
                <Text style={styles.currentUserName}>
                  {auth.currentUser.displayName ||
                    auth.currentUser.email.split("@")[0]}
                </Text>
                <View style={styles.onlineIndicator} />
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
              <Text style={styles.emptyText}>
                No messages yet. Start the conversation!
              </Text>
            }
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              placeholderTextColor="#888"
              multiline
              maxLength={500}
              onFocus={() => Keyboard.dismiss()}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !message.trim() && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>

          <UsersModal />
        </LinearGradient>
      </KeyboardAvoidingView>
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
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#6b2488",
  },
  userButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  userInfo: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  currentUserName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
  },
  profileImage: {
    borderRadius: 20,
    backgroundColor: "#6b2488",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileInitials: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    paddingHorizontal: 12,
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
  },
  currentUserMessage: {
    borderBottomRightRadius: 4,
  },
  otherUserMessage: {
    borderBottomLeftRadius: 4,
  },
  userName: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "bold",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  timestamp: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  dateHeader: {
    alignItems: "center",
    marginVertical: 16,
  },
  dateHeaderText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 18,
    marginBottom: Platform.OS === "ios" ? 60 : 20,
    // backgroundColor: "#151537",
  },
  input: {
    flex: 1,
    backgroundColor: "#2F2750",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#6b2488",
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#C900FF",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalUserItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalUserName: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  closeButton: {
    backgroundColor: "#6b2488",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#543378",
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
