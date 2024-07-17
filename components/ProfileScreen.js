import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { DrawerActions } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating fetching user data from backend
    fetchUserData().then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  const fetchUserData = async () => {
    try {
      const userName = await AsyncStorage.getItem('userName');
      const userToken = await AsyncStorage.getItem('userToken');
  
      const loginData = {
        params: {
          username: userName,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
  
      const response = await axios.get('http://192.168.0.108:8080/api/whoami', {
        headers: loginData.headers,
        params: loginData.params,
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bilgiler */}
      <View style={styles.userInfo}>
        <Text style={styles.label}>Username:</Text>
        <Text>{user.username}</Text>
        <Text style={styles.label}>Name:</Text>
        <Text>{`${user.firstName} ${user.lastName}`}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text>{user.email}</Text>
        <Text style={styles.label}>Phone:</Text>
        <Text>{user.phoneNumber}</Text>
      </View>

      {/* Google Harita */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 42.4416,
            longitude: 19.2662,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: 42.4416, longitude: 19.2662 }}
            title="Marker Title"
            description="Marker Description"
          />
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 50,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default ProfileScreen;
