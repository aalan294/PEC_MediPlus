import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import DoctorListScreen from './screens/DoctorListScreen';
import DoctorDetailScreen from './screens/DoctorDetailScreen';
import BookingScreen from './screens/BookingScreen';
import AppointmentsScreen from './screens/AppointmentsScreen';
import ProfileScreen from './screens/ProfileScreen';
import MessageScreen from './screens/MessageScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DoctorList" component={DoctorListScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Booking" component={BookingScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Appointments" component={AppointmentsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Messages" component={MessageScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;
