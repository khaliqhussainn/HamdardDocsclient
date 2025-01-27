import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MainScreen from '../screens/MainScreen';
import Bca from '../courses/main/Bca';
import Bsc from '../courses/main/Bsc';
import Btech from '../courses/main/Btech';
import Settings from '../components/Settings';
import Help from '../components/Help';
import Profile from '../components/Profile';
import StudyPlanner from '../components/StudyPlanner';
import GroupChat from '../components/GroupChat';
import AIStudentHelper from '../components/AIStudentHelper';
import Roadmap from '../components/Roadmap';
import BottomTabNavigator from './BottomTabNavigator';
import AuthScreen from '../screens/AuthScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BCA" component={Bca} options={{ headerShown: false }} />
      <Stack.Screen name="BSC" component={Bsc} options={{ headerShown: false }} />
      <Stack.Screen name="BTECH" component={Btech} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
      <Stack.Screen name="Help" component={Help} options={{ headerShown: false }} />
      <Stack.Screen name="StudyPlanner" component={StudyPlanner} options={{ headerShown: false }} />
      <Stack.Screen name="AIStudentHelper" component={AIStudentHelper} options={{ headerShown: false }} />
      <Stack.Screen name="Roadmap" component={Roadmap} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="GroupChat" component={GroupChat} options={{ headerShown: false }} />
      <Stack.Screen name="BottomTab" component={BottomTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
