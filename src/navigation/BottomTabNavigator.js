import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MainScreen from '../screens/MainScreen';
import Profile from '../components/Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import StudyPlanner from '../components/StudyPlanner';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const TabBar = ({ state, descriptors, navigation }) => {
  const { isDarkMode } = useTheme();

  return (
    <View style={styles(isDarkMode).tabBarContainer}>
      <LinearGradient
        colors={isDarkMode ? ['#0070F0', '#0070F0'] : ['#ffffff', '#E8F4FA', '#F0F8FC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles(isDarkMode).backgroundGradient}
      >
        <View style={styles(isDarkMode).texturePattern} />
        <View style={styles(isDarkMode).tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <CustomTabBarButton
                key={route.key}
                onPress={onPress}
                accessibilityState={{ selected: isFocused }}
                colors={isDarkMode ? ['#000000', '#1A1A1A'] : ['#0070F0', '#0070F0']}
              >
                <Ionicons
                  name={
                    isFocused
                      ? getIconName(route.name, true)
                      : getIconName(route.name, false)
                  }
                  size={24}
                  color={isFocused ? 'white' : isDarkMode ? '#FFFFFF' : '#62B1DD'}
                />
              </CustomTabBarButton>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

const getIconName = (routeName, focused) => {
  switch (routeName) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Courses':
      return focused ? 'book' : 'book-outline';
    case 'Profile':
      return focused ? 'person' : 'person-outline';
    case 'StudyPlanner':
      return focused ? 'calendar' : 'calendar-outline';
    default:
      return 'circle';
  }
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={MainScreen} />
      <Tab.Screen name="StudyPlanner" component={StudyPlanner} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const CustomTabBarButton = ({ children, onPress, accessibilityState, colors }) => {
  const isFocused = accessibilityState.selected;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles().tabBarButton,
        isFocused && { backgroundColor: 'transparent' },
      ]}
    >
      {isFocused ? (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles().gradientBackground}
        >
          {children}
        </LinearGradient>
      ) : (
        <View style={styles().defaultBackground}>{children}</View>
      )}
    </TouchableOpacity>
  );
};

const styles = (isDark) => StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backgroundGradient: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: isDark ? '#000000' : '#62B1DD',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    backgroundColor: isDark ? '#000' : '#ffffff',
    borderTopWidth: 1,
    borderColor: isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(98, 177, 221, 0.1)',
  },
  texturePattern: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.05,
    backgroundImage: Platform.select({
      web: `
        linear-gradient(45deg, transparent 0%, transparent 45%,
        ${isDark ? '#000000' : '#62B1DD'} 45%, ${isDark ? '#000000' : '#62B1DD'} 55%,
        transparent 55%, transparent 100%)
      `,
      default: undefined,
    }),
    backgroundSize: '30px 30px',
  },
  tabBar: {
    flexDirection: 'row',
    height: 100,
    paddingHorizontal: 10,
    paddingBottom: 30,
    paddingTop: 10,
  },
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

export default BottomTabNavigator;
