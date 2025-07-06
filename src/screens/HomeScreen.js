// In your HomeScreen.js
import { ScrollView, View, Text } from 'react-native';
import DonationCard from '../components/DonationCard';

const HomeScreen = () => {
  const featuredCampaigns = [
    // Sample featured campaigns
    {
      id: '1',
      title: 'Education for All',
      description: 'Help provide educational resources to underprivileged children in rural areas.',
      image: 'https://d2gg9evh47fn9z.cloudfront.net/1600px_COLOURBOX14862248.jpg',
      target: 10000,
      totalRaised: 7500,
      donors: 142,
      daysLeft: 15,
      category: 'Education',
      isFavorite: true
    },
    // ... other featured campaigns
  ];

  return (
    <ScrollView>
      <Text style={styles.sectionTitle}>Featured Campaigns</Text>
      
      {featuredCampaigns.map(campaign => (
        <DonationCard 
          key={campaign.id} 
          campaign={campaign} 
          showDetails={true}
          showProgress={true}
        />
      ))}
    </ScrollView>
  );
};