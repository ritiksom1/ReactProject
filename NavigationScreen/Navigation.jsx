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
import ContactUs from '../DrawerNaviagtionContent/ContactUs';
import WifiConnect from '../DrawerNaviagtionContent/WifiConnect';

// Define the primary header color
const headerColor = '#186cbf';

const refreshDashboard = () => {
  console.log('Refresh icon clicked');
};
 
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        headerTitle: route.name,
        headerLeft: () => (
          <MaterialCommunityIcons
            name="menu"
            size={24}
            color="white"
            style={{ marginLeft: 15 }}
            onPress={() => navigation.openDrawer()}
          />
        ),
        headerRight: route.name === 'Dashboard' ? () => (
          <MaterialCommunityIcons
            name="refresh"
            size={24}
            color="white"
            style={{ marginRight: 15 }}
            onPress={refreshDashboard}
          />
        ) : undefined,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Trends') {
            iconName = 'trending-up';
          } else if (route.name === 'System') {
            iconName = 'information-outline';
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              color={color}
              size={size}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Trends" component={Trends} />
      <Tab.Screen name="System" component={System} />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: headerColor,
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        drawerLabelStyle: {
          fontSize: 15,
        },
        drawerIcon: ({ color, size }) => {
          let iconName;

          // Default icon
          iconName = 'circle';

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      }}
    >
      <Drawer.Screen
        name="Tabs"
        component={TabNavigator}
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home"
              size={size}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ManageDevices"
        component={ManageDevices}
        options={{
          drawerLabel: 'Manage Devices',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="devices"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Setting"
        component={Setting}
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cogs"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Help&Support"
        component={HelpSupport}
        options={{
          drawerLabel: 'Help & Support',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="face-agent"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Feedbacks"
        component={Feedback}
        options={{
          drawerLabel: 'Feedbacks',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="comment-quote-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Invitation"
        component={Invatations}
        options={{
          drawerLabel: 'Invitations',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="page-previous-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Wificonnect"
        component={WifiConnect}
        options={{
          drawerLabel: 'Wifi Connect',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="wifi"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notification}
        options={{
          drawerLabel: 'Notifications',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="bell"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          drawerLabel: 'Contact Us',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="phone-plus"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Diagnostics"
        component={Diagonstic}
        options={{
          drawerLabel: 'Diagnostics',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-plus"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Logouts"
        component={Logout}
        options={{
          drawerLabel: 'Logouts',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="logout"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
