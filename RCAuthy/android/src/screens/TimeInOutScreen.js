import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TimeInOutScreen() {
  const handleTimeIn = async () => {
    const value = await AsyncStorage.getItem('@employee_number');
    const token = await AsyncStorage.getItem('@token');
    const payload = {
      employee: {
        employeeNumber: value
      }
    };
    try {
      const response = await axios.post('https://rcauthy.serveo.net/time-record/addTimeIn', payload, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    alert("Timed In Successfully!")
    } catch (error) {
      alert(error.response.data)
    }
  };

  const handleTimeOut = async () => {
    const value = await AsyncStorage.getItem('@employee_number');
    const token = await AsyncStorage.getItem('@token');
    const payload = {
      employee: {
        employeeNumber: value
      }
    };
    try {
      const response = await axios.post('https://rcauthy.serveo.net/time-record/addTimeOut', payload, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    alert("Timed Out Successfully!")
    } catch (error) {
      alert(error.response.data)
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Online Time In & Out</Text>
      <Text style={styles.messageText}>
        Logging for work outside the office has never been easier. Tap below to start or end your productive day!
      </Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.timeInButton} onPress={handleTimeIn}>
          <Ionicons name="time-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Time In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.timeOutButton} onPress={handleTimeOut}>
          <Ionicons name="exit-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Time Out</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.footerMessage}>Your commitment shines. Thank you for all that you've done!</Text>
    </View>
  );
}

export default TimeInOutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00274D', // Dark background
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E0E6ED', // Soft white for headings
    marginBottom: 10,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 18,
    color: '#A6B1E1', // Muted blue for subtext
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  timeInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECCA3', // Teal color for Time In
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  timeOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9534F', // Soft red for Time Out
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF', // White text for buttons
    fontWeight: '600',
    textAlign: 'center',
  },
  footerMessage: {
    marginTop: 30,
    fontSize: 16,
    color: '#A6B1E1', // Muted blue for footer text
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
