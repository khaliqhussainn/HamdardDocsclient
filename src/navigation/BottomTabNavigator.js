import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MainScreen from '../screens/MainScreen';
import Profile from '../components/Profile';
import GroupChat from '../components/GroupChat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();

const TabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      <LinearGradient
        colors={['#6b2488', '#151537', '#1a2c6b']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.backgroundGradient}
      >
        <View style={styles.tabBar}>
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
                colors={['#e81cff', '#40c9ff']}
              >
                <Ionicons
                  name={
                    isFocused
                      ? getIconName(route.name, true)
                      : getIconName(route.name, false)
                  }
                  size={24}
                  color={isFocused ? 'white' : 'rgba(255,255,255,0.6)'}
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
    case 'GroupChat':
      return focused ? 'chatbubbles' : 'chatbubbles-outline';
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
      <Tab.Screen name="GroupChat" component={GroupChat} />
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    
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