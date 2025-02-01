import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingScreen from '../components/OnboardingScreen';

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F5F9FC', '#EDF7FC']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.imageContainer}>
            <LinearGradient
              colors={['rgba(98, 177, 221, 0.1)', 'rgba(98, 177, 221, 0.05)']}
              style={styles.logoBackground}
            >
              <Image
                source={require('../../assets/logo.jpg')}
                style={styles.logo}
              />
            </LinearGradient>
          </View>

          <View style={styles.authContainer}>
            <LinearGradient
              colors={['#FFFFFF', '#FAFCFF']}
              style={styles.formContainer}
            >
              <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
              <Text style={styles.subtitle}>
                {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
              </Text>

              <View style={styles.inputContainer}>
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
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              </View>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handleAuthentication}
              >
                <LinearGradient
                  colors={['#62B1DD', '#4A90E2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity 
                style={styles.toggleContainer}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={styles.toggleText}>
                  {isLogin ? 'Need an account? ' : 'Already have an account? '}
                  <Text style={styles.toggleTextHighlight}>
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  imageContainer: {
    alignItems: 'center',
    paddingTop: height * 0.1,
    paddingBottom: height * 0.05,
  },
  logoBackground: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
  },
  authContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#62B1DD',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  formContainer: {
    padding: 32,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    height: 56,
    backgroundColor: '#F5F9FC',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E9F0',
  },
  buttonContainer: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#62B1DD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  toggleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  toggleText: {
    fontSize: 16,
    color: '#666666',
  },
  toggleTextHighlight: {
    color: '#62B1DD',
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: -12,
    marginBottom: 12,
    fontSize: 14,
  },
});

export default AuthScreen;