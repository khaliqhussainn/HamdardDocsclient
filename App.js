import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import Firebase from "./firebase";
import "./globals.css";
import { View, StyleSheet } from "react-native";
import { ThemeProvider } from "./src/context/ThemeContext";

export default function App() {
  return (
    <View style={styles.container}>
      <ThemeProvider>
        {/* <Firebase /> */}
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Ensure the background color is set
  },
});
