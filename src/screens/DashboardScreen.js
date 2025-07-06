// In your DashboardScreen.js
import { FlatList } from 'react-native';
import DonationCard from '../components/DonationCard';

const DashboardScreen = () => {
  const recentCampaigns = [
    // Sample recent campaigns
  ];

  return (
    <FlatList
      data={recentCampaigns}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <DonationCard 
          campaign={item} 
          showDetails={false}
          showProgress={false}
        />
      )}
    />
  );
};