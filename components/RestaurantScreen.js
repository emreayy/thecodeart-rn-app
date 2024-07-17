import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://192.168.0.108:8080';
const apiKey = "thecodeart-api-key";

const RestaurantScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [editingId, setEditingId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      throw new Error('User token not found.');
    }
    return userToken;
  };

  const makeApiRequest = async (method, url, data = null) => {
    try {
      const userToken = await getUserToken();
      const config = {
        method,
        url: `${BASE_URL}${url}`,
        headers: {
          Authorization: `Bearer ${userToken}`,
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      };
      if (data) {
        config.data = data;
      }
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`Error making API request: ${error}`);
      if (error.response && error.response.status === 401) {
        await AsyncStorage.removeItem('userToken');
        navigation.replace('Login');
        Alert.alert('Session Expired', 'Your session has expired. Please log in again.');
      } else {
        throw error;
      }
    }
  };

  const fetchRestaurants = async () => {
    try {
      const data = await makeApiRequest('get', '/api/getAll');
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      Alert.alert('Error', 'Failed to load restaurants.');
    }
  };

  const addRestaurant = async () => {
    if (!name || !location) {
      Alert.alert('Error', 'Please enter both name and location');
      return;
    }

    try {
      const newRestaurant = await makeApiRequest('post', '/api/post', { name, location });
      setRestaurants((prevRestaurants) => [...prevRestaurants, newRestaurant]);
      setName('');
      setLocation('');
    } catch (error) {
      console.error('Error adding restaurant:', error);
      Alert.alert('Error', 'Failed to add restaurant.');
    }
  };

  const deleteRestaurant = async (id) => {
    try {
      await makeApiRequest('delete', `/api/delete/${id}`);
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant.id !== id)
      );
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      Alert.alert('Error', 'Failed to delete restaurant.');
    }
  };

  const startEditing = (restaurant) => {
    setEditingId(restaurant.id);
    setName(restaurant.name);
    setLocation(restaurant.location);
  };

  const updateRestaurant = async () => {
    if (!name || !location) {
      Alert.alert('Error', 'Please enter both name and location');
      return;
    }

    try {
      const updatedRestaurant = await makeApiRequest('put', `/api/update/${editingId}`, {
        name,
        location,
      });
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant.id === editingId ? updatedRestaurant : restaurant
        )
      );
      setEditingId(null);
      setName('');
      setLocation('');
    } catch (error) {
      console.error('Error updating restaurant:', error);
      Alert.alert('Error', 'Failed to update restaurant.');
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setName('');
    setLocation('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Manager</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text.toLowerCase())}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={(text) => setLocation(text.toLowerCase())}
      />
      {editingId ? (
        <View style={styles.buttonContainer}>
          <Button title="Update" onPress={updateRestaurant} />
          <Button title="Cancel" onPress={cancelEditing} color="red" />
        </View>
      ) : (
        <Button title="Add Restaurant" onPress={addRestaurant} />
      )}

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.restaurantItem}>
            <Text style={styles.restaurantText}>
              {item.name} - {item.location}
            </Text>
            <View style={styles.buttons}>
              <Button title="Edit" onPress={() => startEditing(item)} />
              <Button title="Delete" onPress={() => deleteRestaurant(item.id)} color="red" />
            </View>
          </View>
        )}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  restaurantItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  restaurantText: {
    fontSize: 18,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default RestaurantScreen;
