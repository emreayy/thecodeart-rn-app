import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RestaurantScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // Load restaurants from storage when the component mounts
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const storedRestaurants = await AsyncStorage.getItem('restaurants');
      if (storedRestaurants) {
        setRestaurants(JSON.parse(storedRestaurants));
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
    }
  };

  const saveRestaurants = async (updatedRestaurants) => {
    try {
      await AsyncStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
    } catch (error) {
      console.error('Error saving restaurants:', error);
    }
  };

  const addRestaurant = () => {
    if (!name || !location) {
      Alert.alert('Error', 'Please enter both name and location');
      return;
    }

    const newRestaurant = {
      id: Math.random().toString(),
      name,
      location,
    };

    const updatedRestaurants = [...restaurants, newRestaurant];
    setRestaurants(updatedRestaurants);
    saveRestaurants(updatedRestaurants);
    setName('');
    setLocation('');
  };

  const deleteRestaurant = (id) => {
    const updatedRestaurants = restaurants.filter((restaurant) => restaurant.id !== id);
    setRestaurants(updatedRestaurants);
    saveRestaurants(updatedRestaurants);
  };

  const startEditing = (restaurant) => {
    setEditingId(restaurant.id);
    setName(restaurant.name);
    setLocation(restaurant.location);
  };

  const updateRestaurant = () => {
    if (!name || !location) {
      Alert.alert('Error', 'Please enter both name and location');
      return;
    }

    const updatedRestaurants = restaurants.map((restaurant) =>
      restaurant.id === editingId
        ? { id: restaurant.id, name, location }
        : restaurant
    );

    setRestaurants(updatedRestaurants);
    saveRestaurants(updatedRestaurants);
    setEditingId(null);
    setName('');
    setLocation('');
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
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.restaurantItem}>
            <Text style={styles.restaurantText}>{item.name} - {item.location}</Text>
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
