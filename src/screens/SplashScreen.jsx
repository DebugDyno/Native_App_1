import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      // After animation, go to AuthScreen
      navigation.replace('AuthScreen');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#191919',
      }}
    >
      <LottieView
        source={require('../../assets/images/Disney_Plus_Logo_Animation.json')}
        autoPlay
        loop={false}
        style={{ width: 200, height: 200 }}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;
