import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firestore, auth } from '../firebase'; // Adjust the path as needed
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const UserInfoScreen = ({ onNext }) => {
  const [name, setName] = useState('');
  const [userClass, setUserClass] = useState('');
  const [school, setSchool] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [country, setCountry] = useState('');

  // Save user profile to Firestore
  const saveProfile = async () => {
    if (!name || !userClass || !school || !city || !district || !country) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Sign in anonymously (if not already signed in)
      const { user } = await signInAnonymously(auth);

      // Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        class: userClass,
        school,
        city,
        district,
        country,
      });

      Alert.alert('Success', 'Profile saved successfully!');
      onNext({ name, userClass, school, city, district, country }); // Move to the next step
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Class"
        value={userClass}
        onChangeText={setUserClass}
      />
      <TextInput
        style={styles.input}
        placeholder="School"
        value={school}
        onChangeText={setSchool}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="District"
        value={district}
        onChangeText={setDistrict}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />
      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UserInfoScreen;