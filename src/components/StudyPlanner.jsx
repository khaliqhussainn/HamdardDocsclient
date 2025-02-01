import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import DateTimePickerModal from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import Navbar from "./Navbar";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    sound: "default",
  }),
});

const PRIMARY_COLOR = "#62B1DD";
const SECONDARY_COLOR = "#4B8FB3";
const ACCENT_COLOR = "#3A7DA1";
const TEXT_COLOR = "#2C3E50";
const LIGHT_TEXT = "#607D8B";
const BACKGROUND_COLOR = "#FFFFFF";

const StudyPlanner = () => {
  const [studyPlan, setStudyPlan] = useState("");
  const [studyPlans, setStudyPlans] = useState([]);
  const [motivationQuote, setMotivationQuote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pickerMode, setPickerMode] = useState("date");

  useEffect(() => {
    requestNotificationPermissions();
    loadPlans();
    scheduleDailyQuote();
    fetchMotivationalQuote();

    // Set up notification listener
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );
    return () => subscription.remove();
  }, []);

  const handleNotificationResponse = (response) => {
    const planId = response.notification.request.content.data.planId;
    if (planId) {
      markPlanAsCompleted(planId);
    }
  };

  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissions Required",
          "Please enable notifications to receive study reminders"
        );
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  };

  const addStudyPlan = async () => {
    if (!studyPlan.trim()) {
      Alert.alert("Error", "Please enter a valid study plan");
      return;
    }

    try {
      const newPlan = {
        id: Date.now().toString(),
        plan: studyPlan.trim(),
        date: selectedDate.toISOString(),
        isCompleted: false,
      };

      const newPlans = [...studyPlans, newPlan];
      setStudyPlans(newPlans);
      setStudyPlan("");
      await AsyncStorage.setItem("studyPlans", JSON.stringify(newPlans));
      await scheduleReminder(newPlan);
    } catch (error) {
      Alert.alert("Error", "Failed to save study plan");
    }
  };

  const loadPlans = async () => {
    try {
      const savedPlans = await AsyncStorage.getItem("studyPlans");
      if (savedPlans) {
        setStudyPlans(JSON.parse(savedPlans));
      }
    } catch (error) {
      console.error("Error loading plans:", error);
    }
  };

  const markPlanAsCompleted = async (planId) => {
    try {
      const updatedPlans = studyPlans.map((plan) =>
        plan.id === planId ? { ...plan, isCompleted: true } : plan
      );
      setStudyPlans(updatedPlans);
      await AsyncStorage.setItem("studyPlans", JSON.stringify(updatedPlans));
    } catch (error) {
      console.error("Error marking plan as completed:", error);
    }
  };

  const deletePlan = async (id) => {
    try {
      const newPlans = studyPlans.filter((plan) => plan.id !== id);
      setStudyPlans(newPlans);
      await AsyncStorage.setItem("studyPlans", JSON.stringify(newPlans));
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  const scheduleDailyQuote = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📚 Daily Study Motivation",
          body: "Time to focus on your goals!",
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });
    } catch (error) {
      console.error("Error scheduling daily quote:", error);
    }
  };

  const scheduleReminder = async (plan) => {
    try {
      const trigger = new Date(plan.date);
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "📝 Study Time!",
          body: `Time to work on: ${plan.plan}`,
          data: { planId: plan.id },
        },
        trigger: {
          date: trigger,
        },
      });

      Alert.alert(
        "Reminder Set",
        `You'll be reminded to study "${
          plan.plan
        }" on ${trigger.toLocaleString()}`
      );

      return identifier;
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to set reminder. Please check the date and time."
      );
    }
  };

  const fetchMotivationalQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://zenquotes.io/api/random");
      const data = await response.json();
      setMotivationQuote(data[0]?.q || "Stay focused on your goals!");
    } catch (error) {
      setMotivationQuote(
        "Success is not final, failure is not fatal: it is the courage to continue that counts."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showMode = (currentMode) => {
    setShowDatePicker(true);
    setPickerMode(currentMode);
  };

  const handleDateChange = (event, date) => {
    if (date) setSelectedDate(date);
    if (Platform.OS === "android") setShowDatePicker(false);
  };

  const renderStudyPlan = ({ item }) => (
    <LinearGradient
      colors={[BACKGROUND_COLOR, "#F8FBFD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.planItem}
    >
      <View style={styles.planContent}>
        <Text
          style={[styles.planText, item.isCompleted && styles.completedPlan]}
        >
          {item.plan}
        </Text>
        <Text style={styles.dateText}>
          {new Date(item.date).toLocaleString()}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        {!item.isCompleted && (
          <TouchableOpacity
            style={[styles.iconButton, styles.completeButton]}
            onPress={() => markPlanAsCompleted(item.id)}
          >
            <Text style={styles.iconText}>✓</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.iconButton, styles.deleteButton]}
          onPress={() => deletePlan(item.id)}
        >
          <Text style={styles.iconText}>×</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.innerContainer}>
            <LinearGradient
              colors={["#0070F0", "#62B1DD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.header}
            >
              <Text style={styles.title}>Study Planner</Text>
              {isLoading ? (
                <ActivityIndicator color={BACKGROUND_COLOR} />
              ) : (
                <Text style={styles.quote}>"{motivationQuote}"</Text>
              )}
            </LinearGradient>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your study plan"
                value={studyPlan}
                onChangeText={setStudyPlan}
                placeholderTextColor="#A0AEC0"
              />

              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => showMode("date")}
                >
                  <Text style={styles.datePickerButtonText}>
                    {selectedDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => showMode("time")}
                >
                  <Text style={styles.datePickerButtonText}>
                    {selectedDate.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <View style={styles.datePickerContainer}>
                  <DateTimePickerModal
                    value={selectedDate}
                    mode={pickerMode}
                    is24Hour={true}
                    display="spinner"
                    onChange={handleDateChange}
                    style={styles.datePicker}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.closeButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity style={styles.addButton} onPress={addStudyPlan}>
                <LinearGradient
                  colors={["#0070F0", "#62B1DD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
                  style={styles.addButtonGradient}
                >
                  <Text style={styles.addButtonText}>Add Plan</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <FlatList
              data={studyPlans}
              renderItem={renderStudyPlan}
              keyExtractor={(item) => item.id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              scrollEnabled={false}
              nestedScrollEnabled={true}
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    padding: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: BACKGROUND_COLOR,
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  quote: {
    color: BACKGROUND_COLOR,
    fontStyle: "italic",
    fontSize: 16,
    marginTop: 8,
    lineHeight: 24,
    opacity: 0.9,
  },
  inputContainer: {
    padding: 20,
    backgroundColor: BACKGROUND_COLOR,
  },
  input: {
    backgroundColor: "#F7FAFC",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: TEXT_COLOR,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  datePickerButton: {
    backgroundColor: "#F7FAFC",
    padding: 18,
    borderRadius: 15,
    flex: 0.48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  datePickerButtonText: {
    color: TEXT_COLOR,
    fontSize: 16,
    textAlign: "center",
  },
  datePickerContainer: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  addButton: {
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonGradient: {
    padding: 18,
    alignItems: "center",
  },
  addButtonText: {
    color: BACKGROUND_COLOR,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  planItem: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  planContent: {
    flex: 1,
  },
  planText: {
    fontSize: 18,
    color: TEXT_COLOR,
    marginBottom: 8,
    fontWeight: "500",
  },
  completedPlan: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  dateText: {
    fontSize: 14,
    color: LIGHT_TEXT,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: "#48BB78",
  },
  deleteButton: {
    backgroundColor: "#F56565",
  },
  iconText: {
    color: BACKGROUND_COLOR,
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: BACKGROUND_COLOR,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default StudyPlanner;
