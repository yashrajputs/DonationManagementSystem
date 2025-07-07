// src/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ 
  title, 
  showBack = false, 
  showProfile = true,
  rightIcon = null,
  onRightPress = () => {},
  showLogo = false,
  backgroundColor = '#3498db',
  titleColor = '#fff',
  iconColor = '#fff'
}) => {
  const navigation = useNavigation();
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Status bar adjustment for iOS/Android */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={backgroundColor} 
      />
      
      {/* Left Section */}
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={Platform.OS === 'ios' ? "ios-arrow-back" : "md-arrow-back"} 
              size={24} 
              color={iconColor} 
            />
          </TouchableOpacity>
        )}
        
        {showLogo && !showBack && (
          <Image 
            source={require('../assets/donation-logo.png')}
            style={styles.logo}
          />
        )}
      </View>
      
      {/* Center Section */}
      <View style={styles.centerSection}>
        <Text 
          style={[styles.title, { color: titleColor }]} 
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>
      
      {/* Right Section */}
      <View style={styles.rightSection}>
        {rightIcon ? (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            {rightIcon}
          </TouchableOpacity>
        ) : showProfile ? (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name="account-circle" 
              size={28} 
              color={iconColor} 
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    paddingBottom: 15,
    paddingHorizontal: 15,
    height: Platform.OS === 'android' 
      ? 60 + StatusBar.currentHeight 
      : 80,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconPlaceholder: {
    width: 40,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
});

export default Header;