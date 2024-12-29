import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
  
    setLoading(true);
    try {
      console.log('Attempting login with:', { email, password });
      const response = await axios.post(
        'http://192.168.32.249:3500/patient/login', // Replace with your machine's local IP
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );
  
      console.log('Response from backend:', response.data);
  
      if (response.status == 200) {
        const user = response.data?.user || null;
  
        if (!user) {
          throw new Error('Invalid login response from the server.');
        }
  
        console.log('Saving user details to AsyncStorage...');
        await AsyncStorage.setItem('userDetails', JSON.stringify(user));
  
        console.log('User details saved. Retrieving for verification...');
        const storedUserDetails = await AsyncStorage.getItem('userDetails');
        console.log('Retrieved user details:', JSON.parse(storedUserDetails));
  
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', response.data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      console.error('Error details:', error.response?.data);
      if (error.message === 'Network Error') {
        Alert.alert(
          'Network Error',
          'Unable to connect to the server. Please check your internet connection or server status.'
        );
      } else {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'An error occurred. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image source={require('../../assets/icon.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
      {/* Uncomment if you want to add a register navigation */}
      {/* <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity> */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#4A90E2',
    marginTop: 20,
  },
});

export default LoginScreen;