import React from "react";
import { useApp } from "../../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Smile, ArrowUp, Users } from "lucide-react";

const Reports = () => {
  const { state } = useApp();
  const { campaigns, donations } = state;

  // Summary stats
  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
  const totalCampaigns = campaigns.length;
  const totalDonations = donations.length;
  const avgDonation = donations.length
    ? donations.reduce((sum, d) => sum + d.amount, 0) / donations.length
    : 0;

  // Top 5 campaigns by funds raised
  const topCampaigns = [...campaigns]
    .sort((a, b) => b.raised - a.raised)
    .slice(0, 5);

  // Data for campaign bar chart
  const campaignBarData = campaigns.map((c) => ({
    name: c.title.length > 16 ? c.title.slice(0, 14) + "…" : c.title,
    Raised: c.raised,
    Goal: c.goal,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-3">Reports & Analytics</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-lg shadow flex items-center space-x-4 border">
          <DollarSign className="h-9 w-9 bg-green-50 text-green-600 rounded-lg p-2" />
          <div>
            <p className="text-xs text-gray-500 uppercase">Total Raised</p>
            <p className="text-xl font-bold text-gray-900">
              ${totalRaised.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center space-x-4 border">
          <Smile className="h-9 w-9 bg-pink-50 text-pink-700 rounded-lg p-2" />
          <div>
            <p className="text-xs text-gray-500 uppercase">Total Donations</p>
            <p className="text-xl font-bold text-gray-900">{totalDonations}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center space-x-4 border">
          <Users className="h-9 w-9 bg-indigo-50 text-indigo-700 rounded-lg p-2" />
          <div>
            <p className="text-xs text-gray-500 uppercase">Campaigns</p>
            <p className="text-xl font-bold text-gray-900">{totalCampaigns}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center space-x-4 border">
          <ArrowUp className="h-9 w-9 bg-yellow-50 text-yellow-600 rounded-lg p-2" />
          <div>
            <p className="text-xs text-gray-500 uppercase">AVG Donation</p>
            <p className="text-xl font-bold text-gray-900">
              ${avgDonation.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Chart + Top Campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campaign Performance Bar Chart */}
        <div className="bg-white rounded-lg shadow border p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Campaign Performance</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="Raised" stackId="a" fill="#6366f1" name="Raised Funds" />
                <Bar dataKey="Goal" stackId="a" fill="#c7d2fe" name="Goal Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Top Campaigns List */}
        <div className="bg-white rounded-lg shadow border p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Top 5 Campaigns</h2>
          <ul className="divide-y divide-gray-100">
            {topCampaigns.map((c, idx) => (
              <li key={c.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="mr-2 text-indigo-600 font-bold">#{idx + 1}</span> 
                    {c.title}
                  </div>
                  <div className="text-xs text-gray-500">{c.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-md font-bold text-green-600">
                    ${c.raised.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {Math.round((c.raised / c.goal) * 100)}% goal
                  </div>
                </div>
              </li>
            ))}
            {topCampaigns.length === 0 && (
              <div className="text-center p-8 text-gray-400">No campaigns.</div>
            )}
          </ul>
        </div>
      </div>

      {/* Detailed Campaign List */}
      <div className="bg-white rounded-lg shadow border p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">All Campaigns Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-400">
                <th className="py-2 px-4 text-left">Campaign</th>
                <th className="py-2 px-4 text-left">Goal</th>
                <th className="py-2 px-4 text-left">Raised</th>
                <th className="py-2 px-4 text-left">Donors</th>
                <th className="py-2 px-4 text-left">Progress</th>
                <th className="py-2 px-4 text-left">End Date</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-t text-gray-700">
                  <td className="px-4 py-3 font-medium">{c.title}</td>
                  <td className="px-4 py-3">${c.goal.toLocaleString()}</td>
                  <td className="px-4 py-3">${c.raised.toLocaleString()}</td>
                  <td className="px-4 py-3">{c.donors}</td>
                  <td className="px-4 py-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{
                          width:
                            Math.min(
                              Math.round((c.raised / c.goal) * 100),
                              100
                            ) + "%",
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {Math.round((c.raised / c.goal) * 100)}%
                    </div>
                  </td>
                  <td className="px-4 py-3">{c.endDate}</td>
                </tr>
              ))}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No campaigns to show.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
