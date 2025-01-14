import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios'; 

export default function OtpScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleValidateOtp = async () => {
    if (!username || !otp) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const payload = {
      username: username,
      otp: otp,
    };

    try {
      const response = await axios.post('https://rcauthy.serveo.net/user/verify-otp', payload);
      console.log('OTP validation successful:', response.data);
      navigation.navigate('Login');
    } catch (error) {
      setErrorMessage(error.response?.data || 'OTP validation failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* OTP box fade-in */}
      <Animated.View style={[styles.otpBox, { opacity: fadeAnim }]}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
        />
        {/* Title */}
        <Text style={styles.title}>Enter OTP Code</Text>

        {/* Username Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          placeholderTextColor="#666666"
          keyboardType="default"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        {/* OTP Code Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter OTP code"
          placeholderTextColor="#666666"
          keyboardType="default"
          autoCapitalize="none"
          value={otp}
          onChangeText={setOtp}
        />

        {/* Error Message */}
        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

        {/* Validate Button */}
        <TouchableOpacity style={styles.button} onPress={handleValidateOtp}>
          <Text style={styles.buttonText}>Validate</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00274D',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'center',
  },
  otpBox: {
    width: 320,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#333333',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },
});
