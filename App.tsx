import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Navigation from './NavigationScreen/Navigation';
import NavigationTAB from './NavigationScreen/Navigation';
// import DetailsScreen from './Dashboard/DetailsScreen';
import Test from './NavigationScreen/Test';

const Tab=createBottomTabNavigator();

function App() {
  return (
    <Navigation/>
    // <Trends/>
  );
} 
export default App;