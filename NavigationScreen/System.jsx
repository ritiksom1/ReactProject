import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const System = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Modal Name */}
        <View style={styles.row}>
          <Text style={styles.label}>Modal Name</Text>
          <Text style={styles.value}>Solarverter Pro 2KVA</Text>
        </View>

        {/* Rating */}
        <View style={styles.row}>
          <Text style={styles.label}>Rating</Text>
          <Text style={styles.value}>2.0 KVA</Text>
        </View>

        {/* IoT Serial Number */}
        <View style={styles.row}>
          <Text style={styles.label}>IoT Serial Number</Text>
          <Text style={styles.value}>solarverter-prod-test</Text>
        </View>

        {/* Charging Profile */}
        <View style={styles.row}>
          <Text style={styles.label}>Charging Profile</Text>
          <Text style={styles.value}>Lithium ION</Text>
        </View>

        {/* Charging Current Setting */}
        <View style={styles.row}>
          <Text style={styles.label}>Charging Current Setting</Text>
          <Text style={styles.value}>ECO</Text>
        </View>

        {/* Battery Voltage */}
        <View style={styles.row}>
          <Text style={styles.label}>Battery Voltage</Text>
          <Text style={styles.value}>3.22 V</Text>
        </View>

        {/* Current Charging */}
        <View style={styles.row}>
          <Text style={styles.label}>Current Charging</Text>
          <Text style={styles.value}>2.12 A</Text>
        </View>

        {/* Output Voltage */}
        <View style={styles.row}>
          <Text style={styles.label}>Output Voltage</Text>
          <Text style={styles.value}>6.4 V</Text>
        </View>

        {/* PV Voltage */}
        <View style={styles.row}>
          <Text style={styles.label}>PV Voltage</Text>
          <Text style={styles.value}>0.21 V</Text>
        </View>

        {/* Solar Setting */}
        <View style={styles.row}>
          <Text style={styles.label}>Solar Setting</Text>
          <Text style={styles.value}>SLB</Text>
        </View>
        
      </View>
      <View style={styles.userCard}>
        <Text style={styles.user}>Connected Users</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Light background color
  },
  card: {
    backgroundColor: '#fff', // White background for card
    borderRadius: 8,
    padding: 16,
    elevation: 5, // Shadow effect on Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow radius for iOS
    marginBottom: 16, // Space between cards
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color:'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  value: {
    color:'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userCard: {
    backgroundColor: '#fff', // White background for card
    borderRadius: 8,
    padding: 16,
    elevation: 5, // Shadow effect on Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow radius for iOS
    marginBottom: 16, // Space between cards
    flexDirection: 'column', // Stack text and button vertically
    alignItems: 'flex-start', // Align items to the left
  },
  user: {
    color:'black',
    // fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10, // Space between text and button
  },
  addButton: {
    backgroundColor: '#007bff', // Primary button color
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2, // Shadow effect on Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 3, // Shadow radius for iOS
  },
  addButtonText: {
    color: '#fff', // White text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default System;
