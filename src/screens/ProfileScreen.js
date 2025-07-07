import React from 'react';
import { View, Text } from 'react-native';
import Header from '../components/Header';

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <Header 
        title="My Profile" 
        showBack={true}
        showProfile={false}
      />
      
      {/* Profile content */}
      <View style={{ padding: 20 }}>
        <Text>Profile Information</Text>
        {/* ... */}
      </View>
    </View>
  );
};