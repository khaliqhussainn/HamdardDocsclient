import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import MainScreen from "../screens/MainScreen";
import ResourceScreen from "../courses/main/ResourceScreen";
import BTechScreen from "../courses/main/BTechScreen";
import Settings from "../components/Settings";
import Help from "../components/Help";
import Profile from "../components/Profile";
import StudyPlanner from "../components/StudyPlanner";
import GroupChat from "../components/GroupChat";
import AIStudentHelper from "../components/AIStudentHelper";
import Roadmap from "../components/Roadmap";
import BottomTabNavigator from "./BottomTabNavigator";
import AuthScreen from "../screens/AuthScreen";
import { ThemeProvider } from "../context/ThemeContext";
import QuizScreen from "../components/QuizScreen";
import BCAScreen from "../courses/main/BCAScreen";
import BSCScreen from "../courses/main/BSCScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <ThemeProvider>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Resource"
          component={ResourceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudyPlanner"
          component={StudyPlanner}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AIStudentHelper"
          component={AIStudentHelper}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Roadmap"
          component={Roadmap}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupChat"
          component={GroupChat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomTab"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BCAScreen" component={BCAScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BTechScreen" component={BTechScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BSCScreen" component={BSCScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </ThemeProvider>
  );
};

export default StackNavigator;
