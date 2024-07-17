import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeText = (text) => {
    setUsername(text.toLowerCase());
  };

  const handleLogin = async () => {
    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post('http://192.168.0.108:8080/auth/login', loginData);
      if (response?.data?.access_token) {
        
          try {
            await AsyncStorage.setItem('userToken', response.data.access_token);
            await AsyncStorage.setItem('userName', loginData.username);
          } catch (e) {
            console.error('Error storing token:', e);
          }
        startBackgroundRefreshTimer();
        navigation.replace('Main');
      } else {
        Alert.alert('Login failed', 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Login failed', 'An error occurred');
    }
  };

  const startBackgroundRefreshTimer = () => {
    const refreshInterval = 5 * 58 * 1000; // Interval in milliseconds (5 minutes)
    
    const refreshToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await axios.post(
          'http://192.168.0.108:8080/auth/refresh',
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const refreshedToken = response.data.access_token;
        await AsyncStorage.setItem('userToken', refreshedToken);
        console.log('Token refreshed in background:', refreshedToken);
      } catch (error) {
        console.error('Error refreshing token:', error);
        Alert.alert('Error', 'Failed to refresh token.');
      } finally {
        // After refreshing, restart the timer
        setTimeout(refreshToken, refreshInterval);
      }
    };
  
    // Start the initial token refresh timer
    setTimeout(refreshToken, refreshInterval);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput 
        style={styles.input}
        value={username}
        onChangeText={handleChangeText}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput 
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default LoginScreen;
