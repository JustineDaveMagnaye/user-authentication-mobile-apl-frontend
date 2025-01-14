// App.js (or main file where you have this code)

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, Animated, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 
import TITO from './TimeInOutScreen';
import Log from './LogScreen';

const Tab = createBottomTabNavigator();

function AuthenticationCodeScreen() {
  const [authCode, setAuthCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const getAuthenticationCode = async () => {
      const value = await AsyncStorage.getItem('@employee_number');
      const token = await AsyncStorage.getItem('@token');
      const payload = {
        employee: {
          employeeNumber: value
        }
      };
      try {
        const response = await axios.post('https://rcauthy.serveo.net/authenticator/getAuthenticatorCode', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        setAuthCode(response.data);
      } catch (err) {
        setError(err.message || 'Unable to fetch authentication code.');
      } finally {
        setLoading(false);
      }
    };

    getAuthenticationCode();

    // Start the fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome to Rogationist Authentication</Text>
      <Text style={styles.subText}>Your secure workspace is here.</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4ECCA3" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.subText}>Your Authentication Code:</Text>
          <Text style={styles.codeText}>{authCode}</Text>
          <Text style={styles.noteText}>Use this code for secured access.</Text>
        </Animated.View>
      )}
    </View>
  );
}

function LogoutScreen({ navigation }) {
  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.clear(); // Clear all stored data
      navigation.replace('Login'); // Redirect to login screen
    };

    const cancel = async () => {
      navigation.replace('Authy');
    }

    // Show confirmation dialog before logging out
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel", onPress: cancel },
        { text: "Yes", onPress: logout }
      ]
    );
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.subText}>Logging out...</Text>
    </View>
  );
}

export default function AuthenticationCode() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Auth Code') {
            iconName = focused ? 'key' : 'key-outline';
          } else if (route.name === 'Time In/Out') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Log') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Logout') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4ECCA3',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#1A1A2E',
          borderTopWidth: 0,
          paddingBottom: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Auth Code" component={AuthenticationCodeScreen} />
      <Tab.Screen name="Time In/Out" component={TITO} />
      <Tab.Screen name="Log" component={Log} />
      <Tab.Screen name="Logout" component={LogoutScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00274D',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F5F5F5',
    textAlign: 'center',
    marginBottom: 5,
  },
  subText: {
    fontSize: 18,
    color: '#B8C1EC',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1F4068',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
  },
  errorText: {
    fontSize: 18,
    color: '#FF4C4C',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ECCA3',
    marginVertical: 10,
    textAlign: 'center',
  },
  noteText: {
    fontSize: 16,
    color: '#B8C1EC',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
