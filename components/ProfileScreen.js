import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { DrawerActions } from '@react-navigation/native';

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
    // Simulating backend response
    return {
      "id": 1,
      "username": "user",
      "firstName": "TheCode",
      "lastName": "Art",
      "email": "user@example.com",
      "phoneNumber": "+1234567890",
      "enabled": true,
      "lastPasswordResetDate": "2024-07-02T04:58:58.508+00:00",
      "authorities": [
          {
              "authority": "ROLE_USER"
          }
      ]
    };
  };

  const openDrawer = () => {
    // Function to open drawer
    DrawerActions.openDrawer();
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
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
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
