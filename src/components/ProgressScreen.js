// src/screens/ProgressScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Header from '../components/Header';
import DonationCard from '../components/DonationCard';

const ProgressScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalDonations: 0,
    topCampaign: '',
    completionRate: 0,
    avgDonation: 0,
    donors: 0,
  });

  // Fetch campaigns and calculate statistics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch campaigns
        const campaignsCollection = collection(db, 'campaigns');
        const campaignSnapshot = await getDocs(campaignsCollection);
        const campaignList = campaignSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCampaigns(campaignList);
        
        // Calculate statistics
        let totalRaised = 0;
        let totalDonations = 0;
        let topCampaign = { title: '', amount: 0 };
        let totalDonors = new Set();
        
        campaignList.forEach(campaign => {
          totalRaised += campaign.totalRaised || 0;
          
          if (campaign.donations) {
            totalDonations += campaign.donations.length;
            campaign.donations.forEach(donation => {
              totalDonors.add(donation.userId);
            });
          }
          
          if (campaign.totalRaised > topCampaign.amount) {
            topCampaign = {
              title: campaign.title,
              amount: campaign.totalRaised
            };
          }
        });
        
        const completionRate = Math.round((totalRaised / 
          campaignList.reduce((sum, c) => sum + c.target, 0)) * 100);
        
        const avgDonation = totalDonations > 0 ? 
          Math.round(totalRaised / totalDonations) : 0;
        
        setStats({
          totalRaised,
          totalDonations,
          topCampaign: topCampaign.title,
          completionRate,
          avgDonation,
          donors: totalDonors.size,
        });
        
      } catch (error) {
        console.error("Error fetching progress data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#3498db',
    },
    fillShadowGradient: '#3498db',
    fillShadowGradientOpacity: 0.2,
  };

  // Sample data for charts
  const donationTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [5000, 8000, 12000, 9000, 15000, 18000],
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const campaignProgressData = campaigns
    .filter(c => c.totalRaised > 0)
    .map(campaign => ({
      name: campaign.title,
      amount: campaign.totalRaised,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }))
    .slice(0, 5);

  const categoryData = {
    labels: ['Education', 'Health', 'Environment', 'Animals', 'Emergency'],
    datasets: [
      {
        data: [35, 25, 15, 15, 10],
        colors: [
          (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
          (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
          (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
          (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
          (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
        ]
      }
    ]
  };

  // Render statistics cards
  const renderStatCard = (icon, title, value, color) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <View style={styles.statIcon}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  // Render time range selector
  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      {['day', 'week', 'month', 'year'].map(range => (
        <TouchableOpacity
          key={range}
          style={[
            styles.timeRangeButton,
            timeRange === range && styles.activeTimeRange
          ]}
          onPress={() => setTimeRange(range)}
        >
          <Text style={[
            styles.timeRangeText,
            timeRange === range && styles.activeTimeRangeText
          ]}>
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading progress data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Progress & Analytics" 
        showBack={false}
        rightIcon={<FontAwesome name="refresh" size={20} color="#fff" />}
        onRightPress={() => navigation.replace('Progress')}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          {['overview', 'campaigns', 'analytics'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <Text style={styles.sectionTitle}>Overall Progress</Text>
            <View style={styles.statsContainer}>
              {renderStatCard(
                <FontAwesome name="money" size={24} color="#fff" />,
                'Total Raised',
                `$${stats.totalRaised.toLocaleString()}`,
                '#3498db'
              )}
              {renderStatCard(
                <FontAwesome name="gift" size={24} color="#fff" />,
                'Total Donations',
                stats.totalDonations.toLocaleString(),
                '#2ecc71'
              )}
              {renderStatCard(
                <FontAwesome name="users" size={20} color="#fff" />,
                'Unique Donors',
                stats.donors.toLocaleString(),
                '#9b59b6'
              )}
              {renderStatCard(
                <FontAwesome name="trophy" size={24} color="#fff" />,
                'Top Campaign',
                stats.topCampaign,
                '#e74c3c'
              )}
            </View>

            <Text style={styles.sectionTitle}>Donation Trends</Text>
            {renderTimeRangeSelector()}
            <LineChart
              data={donationTrendData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />

            <Text style={styles.sectionTitle}>Campaign Progress</Text>
            <View style={styles.campaignsContainer}>
              {campaigns.slice(0, 3).map(campaign => (
                <DonationCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  showDetails={false}
                  style={{ marginBottom: 15 }}
                />
              ))}
            </View>
          </>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <>
            <Text style={styles.sectionTitle}>All Campaigns</Text>
            <View style={styles.campaignsContainer}>
              {campaigns.map(campaign => (
                <DonationCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  style={{ marginBottom: 15 }}
                />
              ))}
            </View>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <>
            <Text style={styles.sectionTitle}>Donation Distribution</Text>
            <PieChart
              data={campaignProgressData}
              width={Dimensions.get('window').width - 40}
              height={200}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
              absolute
            />

            <Text style={styles.sectionTitle}>Category Distribution</Text>
            <BarChart
              data={categoryData}
              width={Dimensions.get('window').width - 40}
              height={220}
              yAxisLabel="$"
              yAxisSuffix="k"
              chartConfig={{
                ...chartConfig,
                barPercentage: 0.5,
                propsForBackgroundLines: {
                  strokeDasharray: "",
                },
              }}
              style={styles.chart}
            />

            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            <View style={styles.metricsContainer}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{stats.completionRate}%</Text>
                <Text style={styles.metricTitle}>Overall Completion</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>${stats.avgDonation}</Text>
                <Text style={styles.metricTitle}>Avg. Donation</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingBottom: 30,
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#3498db',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 15,
    marginBottom: 10,
    color: '#2c3e50',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
  },
  activeTimeRange: {
    backgroundColor: '#3498db',
  },
  timeRangeText: {
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeTimeRangeText: {
    color: '#fff',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  campaignsContainer: {
    paddingHorizontal: 15,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 5,
  },
  metricTitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default ProgressScreen;