import React from "react";
import { useApp } from "../../context/AppContext";
import { BadgeCheck } from "lucide-react";

const DonationProcessing = () => {
  const { state } = useApp();
  const { donations, campaigns } = state;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Donation Processing</h1>
      <div className="bg-white rounded-lg shadow-md border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">All Donations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-400">
                    No donations yet.
                  </td>
                </tr>
              )}
              {donations.map((donation) => {
                const campaign = campaigns.find(
                  (c) => c.id === donation.campaignId
                );
                return (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.donor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {donation.email || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-medium">
                      {campaign?.title || <span className="text-gray-400">Unknown</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-bold">
                      ${donation.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {donation.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={
                        "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full " +
                        (donation.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : donation.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-700")
                      }>
                        {donation.status === "completed" && (
                          <BadgeCheck className="h-4 w-4 mr-1 text-green-500" />
                        )}
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonationProcessing;
