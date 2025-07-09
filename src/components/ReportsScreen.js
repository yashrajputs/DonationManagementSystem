// src/screens/ReportsScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Header from '../components/Header';
import { format } from 'date-fns';

const ReportsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState('donations');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reportData, setReportData] = useState({
    donations: [],
    campaigns: [],
    donors: [],
    summary: {
      totalAmount: 0,
      donationCount: 0,
      avgDonation: 0,
      topDonor: '',
      topCampaign: ''
    }
  });

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

  // Fetch report data from Firestore
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Calculate date range
        let start = new Date();
        switch(dateRange) {
          case 'week':
            start.setDate(start.getDate() - 7);
            break;
          case 'month':
            start.setMonth(start.getMonth() - 1);
            break;
          case 'quarter':
            start.setMonth(start.getMonth() - 3);
            break;
          case 'year':
            start.setFullYear(start.getFullYear() - 1);
            break;
          case 'custom':
            start = startDate;
            break;
          default:
            start.setMonth(start.getMonth() - 1);
        }
        
        const end = dateRange === 'custom' ? endDate : new Date();
        
        // Fetch donations
        const donationsQuery = query(
          collection(db, 'donations'),
          where('timestamp', '>=', start),
          where('timestamp', '<=', end)
        );
        
        const donationsSnapshot = await getDocs(donationsQuery);
        const donationsList = donationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().timestamp.toDate()
        }));
        
        // Calculate summary
        let totalAmount = 0;
        let donationCount = donationsList.length;
        let donorMap = new Map();
        let campaignMap = new Map();
        
        donationsList.forEach(donation => {
          totalAmount += donation.amount;
          
          // Track donors
          const donorCount = donorMap.get(donation.userId) || 0;
          donorMap.set(donation.userId, donorCount + donation.amount);
          
          // Track campaigns
          const campaignAmount = campaignMap.get(donation.campaignId) || 0;
          campaignMap.set(donation.campaignId, campaignAmount + donation.amount);
        });
        
        // Find top donor
        let topDonorAmount = 0;
        let topDonor = '';
        donorMap.forEach((amount, userId) => {
          if (amount > topDonorAmount) {
            topDonorAmount = amount;
            topDonor = userId;
          }
        });
        
        // Find top campaign
        let topCampaignAmount = 0;
        let topCampaign = '';
        campaignMap.forEach((amount, campaignId) => {
          if (amount > topCampaignAmount) {
            topCampaignAmount = amount;
            topCampaign = campaignId;
          }
        });
        
        // Get campaign names (in a real app you'd fetch these)
        const campaignNames = {
          [topCampaign]: 'Education Fund',
          // ... other campaign names
        };
        
        // Get donor names (in a real app you'd fetch these)
        const donorNames = {
          [topDonor]: 'John Smith',
          // ... other donor names
        };
        
        setReportData({
          donations: donationsList,
          campaigns: Array.from(campaignMap).map(([id, amount]) => ({ id, amount })),
          donors: Array.from(donorMap).map(([id, amount]) => ({ id, amount })),
          summary: {
            totalAmount,
            donationCount,
            avgDonation: donationCount > 0 ? totalAmount / donationCount : 0,
            topDonor: donorNames[topDonor] || 'N/A',
            topCampaign: campaignNames[topCampaign] || 'N/A'
          }
        });
        
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [dateRange, startDate, endDate]);

  // Generate chart data
  const generateChartData = () => {
    // Group donations by date
    const groupedData = {};
    reportData.donations.forEach(donation => {
      const dateStr = format(donation.date, 'yyyy-MM-dd');
      if (!groupedData[dateStr]) {
        groupedData[dateStr] = 0;
      }
      groupedData[dateStr] += donation.amount;
    });
    
    // Sort dates
    const sortedDates = Object.keys(groupedData).sort();
    
    return {
      labels: sortedDates.map(date => format(new Date(date), 'MMM dd')),
      datasets: [{
        data: sortedDates.map(date => groupedData[date])
      }]
    };
  };

  // Generate category data
  const categoryData = [
    { name: 'Education', amount: 4500, color: '#3498db', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Health', amount: 3200, color: '#2ecc71', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Environment', amount: 2800, color: '#f1c40f', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Animals', amount: 1500, color: '#e67e22', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Emergency', amount: 2000, color: '#e74c3c', legendFontColor: '#7F7F7F', legendFontSize: 12 },
  ];

  // Export report as PDF
  const exportReport = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: generateHtmlReport(),
        width: 612,
        height: 792,
      });
      
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Export Donation Report',
        UTI: 'com.adobe.pdf'
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      Alert.alert('Export Failed', 'Could not generate PDF report');
    }
  };

  // Generate HTML content for PDF
  const generateHtmlReport = () => {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #2c3e50; }
            .subtitle { font-size: 16px; color: #7f8c8d; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: bold; color: #3498db; border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-bottom: 10px; }
            .stats-container { display: flex; flex-wrap: wrap; justify-content: space-between; }
            .stat-card { width: 48%; background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .stat-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
            .stat-label { font-size: 14px; color: #7f8c8d; }
            .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #f2f2f2; }
            .footer { margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Donation Management Report</h1>
            <p class="subtitle">${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">Summary</h2>
            <div class="stats-container">
              <div class="stat-card">
                <div class="stat-value">$${reportData.summary.totalAmount.toFixed(2)}</div>
                <div class="stat-label">Total Raised</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${reportData.summary.donationCount}</div>
                <div class="stat-label">Donations</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">$${reportData.summary.avgDonation.toFixed(2)}</div>
                <div class="stat-label">Average Donation</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${reportData.summary.topDonor}</div>
                <div class="stat-label">Top Donor</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">Top Campaigns</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Amount Raised</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.campaigns.slice(0, 5).map(campaign => `
                  <tr>
                    <td>${campaign.id}</td>
                    <td>$${campaign.amount.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h2 class="section-title">Top Donors</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Total Donated</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.donors.slice(0, 5).map(donor => `
                  <tr>
                    <td>${donor.id}</td>
                    <td>$${donor.amount.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            Generated on ${format(new Date(), 'MMM dd, yyyy hh:mm a')} by Donation Management System
          </div>
        </body>
      </html>
    `;
  };

  // Render report card
  const renderReportCard = (icon, title, value, color) => (
    <View style={[styles.reportCard, { backgroundColor: color }]}>
      <View style={styles.cardIcon}>
        {icon}
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );

  // Render date range selector
  const renderDateRangeSelector = () => (
    <View style={styles.dateRangeContainer}>
      {['week', 'month', 'quarter', 'year', 'custom'].map(range => (
        <TouchableOpacity
          key={range}
          style={[
            styles.rangeButton,
            dateRange === range && styles.activeRange
          ]}
          onPress={() => {
            setDateRange(range);
            if (range !== 'custom') setShowDatePicker(false);
          }}
        >
          <Text style={[
            styles.rangeText,
            dateRange === range && styles.activeRangeText
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
        <Text style={styles.loadingText}>Generating report...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Reports & Analytics" 
        showBack={false}
        rightIcon={<MaterialIcons name="picture-as-pdf" size={24} color="#fff" />}
        onRightPress={exportReport}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Date Range Selector */}
        <Text style={styles.sectionTitle}>Date Range</Text>
        {renderDateRangeSelector()}
        
        {dateRange === 'custom' && (
          <View style={styles.customDateContainer}>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {format(startDate, 'MMM dd, yyyy')}
              </Text>
              <MaterialIcons name="date-range" size={20} color="#3498db" />
            </TouchableOpacity>
            
            <Text style={styles.toText}>to</Text>
            
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {format(endDate, 'MMM dd, yyyy')}
              </Text>
              <MaterialIcons name="date-range" size={20} color="#3498db" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Report Summary */}
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryContainer}>
          {renderReportCard(
            <FontAwesome name="money" size={20} color="#fff" />,
            'Total Raised',
            `$${reportData.summary.totalAmount.toFixed(2)}`,
            '#3498db'
          )}
          {renderReportCard(
            <FontAwesome name="gift" size={20} color="#fff" />,
            'Donations',
            reportData.summary.donationCount.toString(),
            '#2ecc71'
          )}
          {renderReportCard(
            <FontAwesome name="calculator" size={20} color="#fff" />,
            'Avg. Donation',
            `$${reportData.summary.avgDonation.toFixed(2)}`,
            '#9b59b6'
          )}
          {renderReportCard(
            <FontAwesome name="trophy" size={20} color="#fff" />,
            'Top Campaign',
            reportData.summary.topCampaign,
            '#e74c3c'
          )}
        </View>
        
        {/* Donation Trends Chart */}
        <Text style={styles.sectionTitle}>Donation Trends</Text>
        <LineChart
          data={generateChartData()}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
        
        {/* Campaign Distribution */}
        <Text style={styles.sectionTitle}>Campaign Distribution</Text>
        <PieChart
          data={categoryData}
          width={Dimensions.get('window').width - 40}
          height={200}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
          absolute
        />
        
        {/* Top Campaigns */}
        <Text style={styles.sectionTitle}>Top Campaigns</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { flex: 3 }]}>Campaign</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>Amount</Text>
          </View>
          
          {reportData.campaigns.slice(0, 5).map((campaign, index) => (
            <View 
              key={index} 
              style={[
                styles.tableRow, 
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}
            >
              <Text style={[styles.tableCell, { flex: 3 }]}>Education Fund</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>${campaign.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        
        {/* Top Donors */}
        <Text style={styles.sectionTitle}>Top Donors</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { flex: 3 }]}>Donor</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>Amount</Text>
          </View>
          
          {reportData.donors.slice(0, 5).map((donor, index) => (
            <View 
              key={index} 
              style={[
                styles.tableRow, 
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}
            >
              <Text style={[styles.tableCell, { flex: 3 }]}>John Smith</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>${donor.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date Range</Text>
            
            <View style={styles.datePickerContainer}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <TextInput
                style={styles.modalInput}
                value={format(startDate, 'yyyy-MM-dd')}
                onChangeText={(text) => setStartDate(new Date(text))}
              />
              
              <Text style={styles.dateLabel}>End Date</Text>
              <TextInput
                style={styles.modalInput}
                value={format(endDate, 'yyyy-MM-dd')}
                onChangeText={(text) => setEndDate(new Date(text))}
              />
            </View>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.modalButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 15,
    marginBottom: 10,
    color: '#2c3e50',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  rangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    marginBottom: 10,
  },
  activeRange: {
    backgroundColor: '#3498db',
  },
  rangeText: {
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeRangeText: {
    color: '#fff',
  },
  customDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  toText: {
    marginHorizontal: 10,
    color: '#7f8c8d',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  reportCard: {
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
  cardIcon: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  table: {
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  tableHeader: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  tableCell: {
    color: '#7f8c8d',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#f8f9fa',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  modalInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReportsScreen;