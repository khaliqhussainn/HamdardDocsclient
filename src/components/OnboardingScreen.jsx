import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo-linear-gradient';

const OnboardingScreen = ({ onContinue }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: require('../../assets/onboarding.jpg'),
      title: 'Welcome to Our App!',
      description: 'Discover the best way to manage your studies and connect with fellow students.',
    },
    {
      image: require('../../assets/onboarding.jpg'),
      title: 'Stay Organized',
      description: 'Keep track of your assignments, deadlines, and notes all in one place.',
    },
    {
      image: require('../../assets/onboarding.jpg'),
      title: 'Connect with Others',
      description: 'Join study groups, share resources, and collaborate with your peers.',
    },
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const renderButton = (index) => {
    const isLastSlide = index === slides.length - 1;
    return (
      <TouchableOpacity
        style={[
          styles.button,
          isLastSlide ? styles.continueButton : styles.nextButton,
        ]}
        onPress={isLastSlide ? onContinue : handleNext}
      >
        <Text style={styles.buttonText}>
          {isLastSlide ? 'Continue' : 'Next'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#6b2488', '#151537', '#1a2c6b']}
      locations={[0, 0.3, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        paginationStyle={styles.pagination}
        loop={false}
        index={currentIndex}
        onIndexChanged={(index) => setCurrentIndex(index)}
        scrollEnabled={currentIndex < slides.length - 1}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Image source={slide.image} style={styles.image} />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
            {renderButton(index)}
          </View>
        ))}
      </Swiper>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 100, // Circular image
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff', // White text for better contrast
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#e1e5ee', // Light gray text for better contrast
  },
  pagination: {
    position: 'absolute',
    bottom: 24,
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: '#ffffff', // White for active dot
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  button: {
    padding: 15,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    width: '100%',
  },
  nextButton: {
    backgroundColor: '#6b2488', // Primary color for next button
  },
  continueButton: {
    backgroundColor: '#6b2488', // Accent color for continue button
  },
  buttonText: {
    color: '#ffffff', // White text for buttons
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;