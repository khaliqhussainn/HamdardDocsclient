import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
        <LinearGradient
          colors={['#62B1DD', '#4A90E2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>
            {isLastSlide ? 'Continue' : 'Next'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F5F9FC', '#EDF7FC']}
        style={styles.gradient}
      >
        <View style={styles.contentContainer}>
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
                <View style={styles.imageContainer}>
                  <LinearGradient
                    colors={['rgba(98, 177, 221, 0.1)', 'rgba(98, 177, 221, 0.05)']}
                    style={styles.imageBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Image source={slide.image} style={styles.image} />
                  </LinearGradient>
                </View>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
                {renderButton(index)}
              </View>
            ))}
          </Swiper>
        </View>
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
  contentContainer: {
    flex: 1,
    paddingTop: 60,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  imageContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  imageBackground: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'center',
    color: '#666666',
    paddingHorizontal: 20,
  },
  pagination: {
    bottom: 40,
  },
  dot: {
    backgroundColor: 'rgba(98, 177, 221, 0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#62B1DD',
    width: 24,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    width: width * 0.85,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#62B1DD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
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
});

export default OnboardingScreen;