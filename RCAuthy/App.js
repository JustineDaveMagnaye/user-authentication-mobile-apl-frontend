import { AppRegistry } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from './android/src/screens/WelcomeScreen';
import LoginScreen from './android/src/screens/LoginScreen';
import RegisterScreen from './android/src/screens/RegisterScreen';
import OtpScreen from './android/src/screens/OtpScreen';
import Authy from './android/src/screens/AuthenticationCode';
import TITO from './android/src/screens/TimeInOutScreen'
import Log from './android/src/screens/LogScreen'
import { name as appName } from './app.json';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define the Bottom Tab Navigator
function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Authy" component={Authy} />
      <Tab.Screen name="Otp" component={OtpScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  console.log("App executed");

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="OTP" component={OtpScreen} />
          <Stack.Screen name="Authy" component={Authy} />
          <Stack.Screen name="TITO" component={TITO}/>
          <Stack.Screen name ="Log" component={Log}/>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Register the app
AppRegistry.registerComponent(appName, () => App);
