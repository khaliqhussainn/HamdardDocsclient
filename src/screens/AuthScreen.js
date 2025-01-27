import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingScreen from '../components/OnboardingScreen'; // Import the OnboardingScreen component

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true); // State to control onboarding screen
  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace('BottomTab');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuthentication = async () => {
    try {
      setError('');
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleContinue = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <OnboardingScreen onContinue={handleContinue} />;
  }

  return (
    <LinearGradient
      colors={['#6b2488', '#151537', '#1a2c6b']}
      locations={[0, 0.3, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/logo.jpg')} // Replace with the path to your logo
            style={styles.logo}
          />
        </View>
        <View style={styles.authContainer}>
          <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <Button
              title={isLogin ? 'Sign In' : 'Sign Up'}
              onPress={handleAuthentication}
              color="#ffffff" // White text for buttons
            />
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </Text>
          </View>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 16,
    width: '100%', // Ensure the container takes full width
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    height: '30%',
  },
  authContainer: {
    width: '100%', // Ensure authContainer takes full width
    // backgroundColor: 'rgb(21, 21, 55, 0.1)', // Semi-transparent white background
    padding: 24,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    height: '70%',
    borderTopColor: 'rgb(21, 21, 55)',
    // borderTopWidth: ,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular logo
  },
  title: {
    fontSize: 32,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff', // White text for better contrast
  },
  input: {
    height: 50,
    marginBottom: 16,
    color: '#ffffff', // White text for input
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: '#345686', // White border for input
  },
  buttonContainer: {
    marginVertical: 16,
    width: '100%',
    backgroundColor: '#C900FE', // Primary color for button
    padding: 6,
    borderRadius: 28,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  toggleText: {
    color: '#ffffff', // White text for toggle link
    textAlign: 'center',
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 20,
  },
  errorText: {
    color: '#ff5252', // Red for error messages
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AuthScreen;