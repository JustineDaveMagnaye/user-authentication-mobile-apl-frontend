import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios';
import { getUniqueId } from 'react-native-device-info';

export default function RegisterScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    const deviceId = await getUniqueId();
    const payload = {
      user: {
        username: username,
        password: password,
        deviceId: deviceId, 
      },
      employee: {
        employeeNumber: employeeNumber,
      },
    };

      try {
        const response = await axios.post('https://rcauthy.serveo.net/user/register', payload);
        console.log('Registration successful:', response.data);
        navigation.navigate('OTP');
      } catch (error) {
        setErrorMessage(error.response?.data || 'Registration failed. Please try again.');
      }
    };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Create a New Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#FFFFFF"
          keyboardType="default"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        {errorMessage && errorMessage === 'Username already exists.' && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#FFFFFF"
          secureTextEntry={true}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        {errorMessage && errorMessage === 'Please create a stronger password. Password should contain special characters.' && (
          <Text style={styles.errorMessage}>{'Please create a stronger password.'}</Text>
        )}
        {errorMessage && errorMessage === 'Password cannot be null or empty' && (
          <Text style={styles.errorMessage}>{'Password cannot be empty.'}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#FFFFFF"
          secureTextEntry={true}
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
         {errorMessage && errorMessage === 'Passwords do not match.' && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Employee Number"
          placeholderTextColor="#FFFFFF"
          keyboardType="default"
          autoCapitalize="none"
          value={employeeNumber}
          onChangeText={setEmployeeNumber}
        />
        {(errorMessage === 'This user is already registered!' || errorMessage === 'Employee Number does not exist!') && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        {errorMessage && errorMessage === 'Device already registered to an account.' && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}


        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an registered account?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>Log in here</Text>
        </Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 16,
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#1E90FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loginLink: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },
});
