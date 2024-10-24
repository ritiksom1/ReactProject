// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from './Dashboard';
import Trends from './Trends';
import System from './System';
import ManageDevices from '../DrawerNaviagtionContent/ManageDevices';
import Setting from '../DrawerNaviagtionContent/Setting';
import Feedback from '../DrawerNaviagtionContent/Feedback';
import HelpSupport from '../DrawerNaviagtionContent/HelpSupport';
import Notification from '../DrawerNaviagtionContent/Notification';
import Diagonstic from '../DrawerNaviagtionContent/Diagonstic';
import Logout from '../DrawerNaviagtionContent/Logout';
import Invatations from '../DrawerNaviagtionContent/Invatations';

// Define the primary header color
const headerColor = '#186cbf';

const refreshDashboard = () => {
  // Implement your refresh logic here
  console.log('Refresh icon clicked');
  // Example: Trigger a refresh or reload data
};

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: headerColor,
        tabBarLabelStyle: {
          fontSize: 15,
          paddingBottom: 5,
          fontWeight: '700',
        },
        tabBarStyle: {
          height: 60,
          paddingTop: 0,
        },
        headerStyle: {
          backgroundColor: headerColor,
        },
        headerTintColor: 'white',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Trends"
        component={Trends}
        options={{
          headerShown: false,
          tabBarLabel: 'Trends',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="System"
        component={System}
        options={{
          headerShown: false,
          tabBarLabel: 'System',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: headerColor,
          },
          headerTintColor: 'white',
        }}//ADD REFRESH IN THIS 
      >
        <Drawer.Screen 
          name="Dashboard" 
          component={TabNavigator} 
          
          options={{   headerRight: () => (
            <MaterialCommunityIcons
            name="refresh"
            size={24}
            color="white"
            style={{ marginRight: 15 }}
            onPress={refreshDashboard}
          />) }}
        />
        <Drawer.Screen name="ManageDevices" component={ManageDevices} />
        <Drawer.Screen name="Setting" component={Setting} />
        <Drawer.Screen name="Help&Support" component={HelpSupport} />
        <Drawer.Screen name="Feedbacks" component={Feedback} />
        <Drawer.Screen name="Invitation" component={Invatations} />
        <Drawer.Screen name="Notifications" component={Notification} />
        <Drawer.Screen name="Diagnostics" component={Diagonstic} />
        <Drawer.Screen name="Logouts" component={Logout} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
