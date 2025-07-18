import React from 'react';
import { DollarSign, Users, Target, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';

const Dashboard = () => {
  const { state } = useApp();
  const { campaigns, donations } = state;

  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
  const totalDonors = campaigns.reduce((sum, campaign) => sum + campaign.donors, 0);
  const totalGoal = campaigns.reduce((sum, campaign) => sum + campaign.goal, 0);

  // Mock data for charts
  const donationTrendData = [
    { month: 'Jan', amount: 12000, donors: 45 },
    { month: 'Feb', amount: 19000, donors: 67 },
    { month: 'Mar', amount: 24000, donors: 89 },
    { month: 'Apr', amount: 28000, donors: 112 },
    { month: 'May', amount: 35000, donors: 134 },
    { month: 'Jun', amount: 42000, donors: 156 },
    { month: 'Jul', amount: 48000, donors: 178 }
  ];

  const campaignPerformanceData = campaigns.map(campaign => ({
    name: campaign.title.split(' ').slice(0, 2).join(' '),
    raised: campaign.raised,
    goal: campaign.goal,
    percentage: Math.round((campaign.raised / campaign.goal) * 100)
  }));

  const donationSourceData = [
    { name: 'Online', value: 65, color: '#3B82F6' },
    { name: 'Events', value: 25, color: '#10B981' },
    { name: 'Corporate', value: 10, color: '#F59E0B' }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div className="card">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              <span className="ml-1 text-sm font-medium">{trendValue}</span>
            </div>
            <p className="text-xs text-gray-500">vs last month</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-3">
          <select className="input-field w-auto px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <StatCard
          title="Total Raised"
          value={`$${totalRaised.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Total Donors"
          value={totalDonors.toLocaleString()}
          icon={Users}
          color="bg-blue-500"
          trend="up"
          trendValue="8%"
        />
        <StatCard
          title="Active Campaigns"
          value={campaigns.length}
          icon={Target}
          color="bg-purple-500"
          trend="up"
          trendValue="3%"
        />
        <StatCard
          title="Success Rate"
          value={`${Math.round((totalRaised/totalGoal)*100)}%`}
          icon={TrendingUp}
          color="bg-red-500"
          trend="up"
          trendValue="5%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Donation Trend Chart */}
        <div className="card">
          <div className="p-8 border-b">
            <h2 className="text-xl font-bold text-gray-900">Donation Trends</h2>
          </div>
          <div className="p-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donationTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'amount' ? `$${value.toLocaleString()}` : value, 
                      name === 'amount' ? 'Amount' : 'Donors'
                    ]} 
                  />
                  <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} />
                  <Line type="monotone" dataKey="donors" stroke="#10B981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Campaign Performance Chart */}
        <div className="card">
          <div className="p-8 border-b">
            <h2 className="text-xl font-bold text-gray-900">Campaign Performance</h2>
          </div>
          <div className="p-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="raised" fill="#3B82F6" name="Raised" />
                  <Bar dataKey="goal" fill="#E5E7EB" name="Goal" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Donation Sources */}
        <div className="card">
          <div className="p-8 border-b">
            <h2 className="text-xl font-bold text-gray-900">Donation Sources</h2>
          </div>
          <div className="p-8">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donationSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {donationSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="p-8 border-b">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {donations.slice(-5).reverse().map(donation => {
                const campaign = campaigns.find(c => c.id === donation.campaignId);
                return (
                  <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{donation.donor}</p>
                        <p className="text-xs text-gray-500">donated to {campaign?.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">${donation.amount}</p>
                      <p className="text-xs text-gray-500">{donation.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
