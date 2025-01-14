import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUniqueId } from 'react-native-device-info';
import { jwtDecode } from 'jwt-decode';

export default function LoginScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const errorConstant = 'An error occured: ';
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = async () => {
    const deviceId = await getUniqueId();
    const payload = {
      username: username,
      password: password,
      deviceId: deviceId,
    };

    try {
      const response = await axios.post('https://rcauthy.serveo.net/user/login', payload);
      console.log('Login successful:', response.headers.get('jwt-token'));
      const token = response.headers.get('jwt-token');
      const decryptedToken = jwtDecode(token);
      const authority = decryptedToken.authorities
      if(token != null){
        await AsyncStorage.setItem('@token', token);
        await AsyncStorage.setItem('@employee_number', response.data);
        navigation.navigate('Authy');
        window.location.reload();
      }
    } catch (error) {
      setErrorMessage(error.response?.data || 'Login failed. Please try again.');
      {errorMessage && errorMessage === '2FA is required!' && (
        navigation.navigate('OTP')
      )}
    }
  };
  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>Log-In to Your Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#FFFFFF"
          keyboardType="default"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        {errorMessage && errorMessage === 'Username not found!' && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#FFFFFF"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.showHideButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon 
              name={showPassword ? 'eye' : 'eye-slash'}
              size={20}
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>
        {errorMessage && errorMessage === 'Incorrect Password!' && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        {errorMessage && errorMessage === 'Device ID mismatch. Access denied.' && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        {errorMessage && errorMessage === 'Device already registered to an account.' && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        {errorMessage && errorMessage === 'User account is locked' && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        {errorMessage && errorMessage === 'User Successfully Re-registered!' && (
          <Text style={styles.successMessage}>{"User successfully Re-registered!\n Please press again."}</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Haven't registered yet?{' '}
          <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>
            Register here
          </Text>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showHideButton: {
    position: 'absolute',
    right: 10,
    top: 35,
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
  signupText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  signupLink: {
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
  successMessage: {
    color: 'lightblue',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },
});
