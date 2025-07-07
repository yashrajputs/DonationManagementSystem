// src/screens/CampaignList.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Header from '../components/Header';
import DonationCard from '../components/DonationCard';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const campaignsCollection = collection(db, 'campaigns');
        const campaignSnapshot = await getDocs(campaignsCollection);
        const campaignList = campaignSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCampaigns(campaignList);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header 
        title="Active Campaigns" 
        showBack={false}
      />
      <View style={styles.container}>
        <Text style={styles.header}>Active Campaigns</Text>
        
        <FlatList
          data={campaigns}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DonationCard campaign={item} />
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default CampaignList;