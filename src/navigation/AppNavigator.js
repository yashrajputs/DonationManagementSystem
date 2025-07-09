import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CampaignList from '../screens/CampaignList';
import ProfileScreen from '../screens/ProfileScreen';
import ProgressScreen from '../screens/ProgressScreen'; // Added ProgressScreen
import ReportsScreen from '../screens/ReportsScreen'; // Import ReportsScreen

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Campaigns" component={CampaignList} />
    <Tab.Screen name="Progress" component={ProgressScreen} /> {/* Added Progress tab */}
    <Tab.Screen name="Reports" component={ReportsScreen} /> {/* Added Reports tab */}
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default AppNavigator;