import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CustomTabBarButton = ({ children, onPress, accessibilityState, colors }) => {
  const isFocused = accessibilityState.selected;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tabBarButton,
        isFocused && { backgroundColor: 'transparent' },
      ]}
    >
      {isFocused ? (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          {children}
        </LinearGradient>
      ) : (
        <View style={styles.defaultBackground}>{children}</View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    margin: 5,
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  defaultBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomTabBarButton;
