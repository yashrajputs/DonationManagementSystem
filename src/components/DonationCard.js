// src/components/DonationCard.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DonationCard = ({ campaign, showDetails = true, showProgress = true }) => {
  const navigation = useNavigation();
  
  // Calculate progress percentage
  const progress = Math.min(100, (campaign.totalRaised || 0) / campaign.target * 100);
  
  const handlePress = () => {
    navigation.navigate('CampaignDetail', { campaignId: campaign.id });
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Campaign Image */}
      <Image 
        source={{ uri: campaign.image || 'https://via.placeholder.com/300' }} 
        style={styles.image} 
      />
      
      {/* Favorite Button */}
      <TouchableOpacity style={styles.favoriteButton}>
        <MaterialIcons 
          name={campaign.isFavorite ? "favorite" : "favorite-border"} 
          size={24} 
          color={campaign.isFavorite ? "#e74c3c" : "#fff"} 
        />
      </TouchableOpacity>
      
      {/* Campaign Info */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{campaign.title}</Text>
        
        {showDetails && (
          <Text style={styles.description} numberOfLines={2}>
            {campaign.description}
          </Text>
        )}
        
        {/* Progress Section */}
        {showProgress && (
          <View style={styles.progressContainer}>
            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            
            {/* Progress Text */}
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                ${(campaign.totalRaised || 0).toFixed(2)} raised
              </Text>
              <Text style={styles.progressPercentage}>{progress.toFixed(0)}%</Text>
            </View>
          </View>
        )}
        
        {/* Campaign Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="people" size={16} color="#7f8c8d" />
            <Text style={styles.statText}>{campaign.donors || 0} donors</Text>
          </View>
          
          {campaign.daysLeft !== undefined && (
            <View style={styles.statItem}>
              <MaterialIcons name="access-time" size={16} color="#7f8c8d" />
              <Text style={styles.statText}>{campaign.daysLeft} days left</Text>
            </View>
          )}
        </View>
        
        {/* Category Tag */}
        {campaign.category && (
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{campaign.category}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 6,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ecc71',
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    color: '#7f8c8d',
    marginLeft: 5,
  },
  categoryTag: {
    position: 'absolute',
    top: -155,
    left: 15,
    backgroundColor: '#3498db',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DonationCard;