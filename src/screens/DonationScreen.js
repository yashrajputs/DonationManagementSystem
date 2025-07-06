// src/screens/DonationScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';

const DonationScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentDonations, setRecentDonations] = useState([]);

  // Fetch campaigns from Firestore
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
        if (campaignList.length > 0) {
          setSelectedCampaign(campaignList[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Handle donation submission
  const handleDonation = async () => {
    if (!selectedCampaign || !donationAmount || isNaN(parseFloat(donationAmount)) || parseFloat(donationAmount) <= 0) {
      Alert.alert('Invalid Donation', 'Please select a campaign and enter a valid donation amount.');
      return;
    }

    if (!user) {
      Alert.alert('Authentication Required', 'Please login to make a donation.');
      navigation.navigate('Auth');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create donation record
      const donationData = {
        userId: user.uid,
        campaignId: selectedCampaign.id,
        campaignName: selectedCampaign.title,
        amount: parseFloat(donationAmount),
        paymentMethod,
        timestamp: new Date().toISOString(),
        userName: user.email.split('@')[0] // Use email prefix as name
      };
      
      // Update campaign document
      const campaignRef = doc(db, 'campaigns', selectedCampaign.id);
      await updateDoc(campaignRef, {
        donations: arrayUnion(donationData),
        totalRaised: (selectedCampaign.totalRaised || 0) + parseFloat(donationAmount)
      });
      
      // Update recent donations
      setRecentDonations(prev => [donationData, ...prev.slice(0, 4)]);
      
      // Show success message
      Alert.alert(
        'Donation Successful!',
        `Thank you for donating $${parseFloat(donationAmount).toFixed(2)} to ${selectedCampaign.title}`,
        [{ text: 'OK', onPress: () => setDonationAmount('') }]
      );
    } catch (error) {
      console.error("Donation error:", error);
      Alert.alert('Donation Failed', 'There was an error processing your donation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Render payment method icon
  const renderPaymentIcon = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return <FontAwesome name="credit-card" size={24} color="#3498db" />;
      case 'paypal':
        return <FontAwesome name="paypal" size={24} color="#003087" />;
      case 'bank_transfer':
        return <FontAwesome name="bank" size={24} color="#27ae60" />;
      default:
        return <FontAwesome name="money" size={24} color="#f39c12" />;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading campaigns...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Make a Donation</Text>
      </View>

      {/* Campaign Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Campaign</Text>
        <View style={styles.campaignSelector}>
          <Picker
            selectedValue={selectedCampaign?.id}
            onValueChange={(itemValue) => 
              setSelectedCampaign(campaigns.find(c => c.id === itemValue))
            }
            style={styles.picker}
            dropdownIconColor="#3498db"
          >
            {campaigns.map(campaign => (
              <Picker.Item 
                key={campaign.id} 
                label={campaign.title} 
                value={campaign.id} 
              />
            ))}
          </Picker>
        </View>

        {selectedCampaign && (
          <View style={styles.campaignCard}>
            <Image 
              source={{ uri: selectedCampaign.image || 'https://via.placeholder.com/300' }} 
              style={styles.campaignImage}
            />
            <Text style={styles.campaignTitle}>{selectedCampaign.title}</Text>
            <Text style={styles.campaignDescription}>{selectedCampaign.description}</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill, 
                  { width: `${Math.min(100, (selectedCampaign.totalRaised || 0) / selectedCampaign.target * 100)}%` }
                ]} />
              </View>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressText}>
                  ${selectedCampaign.totalRaised?.toFixed(2) || '0.00'} raised
                </Text>
                <Text style={styles.progressText}>
                  ${selectedCampaign.target.toFixed(2)} goal
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Donation Amount */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Donation Amount</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={donationAmount}
            onChangeText={setDonationAmount}
          />
        </View>
        
        <View style={styles.quickAmounts}>
          {[10, 25, 50, 100, 250].map(amount => (
            <TouchableOpacity
              key={amount}
              style={styles.quickAmountButton}
              onPress={() => setDonationAmount(amount.toString())}
            >
              <Text style={styles.quickAmountText}>${amount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethodContainer}>
          {renderPaymentIcon()}
          <Picker
            selectedValue={paymentMethod}
            onValueChange={setPaymentMethod}
            style={styles.paymentPicker}
          >
            <Picker.Item label="Credit Card" value="credit_card" />
            <Picker.Item label="PayPal" value="paypal" />
            <Picker.Item label="Bank Transfer" value="bank_transfer" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>

      {/* Donate Button */}
      <TouchableOpacity 
        style={styles.donateButton}
        onPress={handleDonation}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <FontAwesome name="heart" size={20} color="#fff" />
            <Text style={styles.donateButtonText}>Donate Now</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Recent Donations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Donations</Text>
        {recentDonations.length > 0 ? (
          recentDonations.map((donation, index) => (
            <View key={index} style={styles.recentDonationCard}>
              <View style={styles.recentDonationHeader}>
                <Text style={styles.donorName}>{donation.userName}</Text>
                <Text style={styles.donationAmount}>${donation.amount.toFixed(2)}</Text>
              </View>
              <Text style={styles.donationCampaign}>{donation.campaignName}</Text>
              <Text style={styles.donationTime}>
                {new Date(donation.timestamp).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDonationsText}>No recent donations yet. Be the first!</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  campaignSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  campaignCard: {
    alignItems: 'center',
  },
  campaignImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 5,
  },
  campaignDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 15,
  },
  progressContainer: {
    width: '100%',
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ecc71',
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickAmountButton: {
    backgroundColor: '#e1f0fa',
    padding: 10,
    borderRadius: 8,
    width: '18%',
    alignItems: 'center',
  },
  quickAmountText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  paymentPicker: {
    flex: 1,
    height: 50,
  },
  donateButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    margin: 15,
    marginTop: 5,
  },
  donateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  recentDonationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  recentDonationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  donorName: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  donationAmount: {
    fontWeight: 'bold',
    color: '#27ae60',
  },
  donationCampaign: {
    color: '#3498db',
    marginBottom: 5,
  },
  donationTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  noDonationsText: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginVertical: 10,
  },
});

export default DonationScreen;