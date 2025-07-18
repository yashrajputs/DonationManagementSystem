import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Users, Mail, Search, Download } from "lucide-react";
import Modal from "../Common/Modal";

const Donors = () => {
  const { state } = useApp();
  // Example donor shape: { id, name, email, total, lastDonation, donations: [] }
  const donors = state.donors || [];
  const [search, setSearch] = useState("");
  const [selectedDonor, setSelectedDonor] = useState(null);

  // Filter donors by name/email
  const filtered = donors.filter(
    d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase())
  );

  // CSV export function (basic implementation)
  const exportCSV = () => {
    const header = "Name,Email,Total Donated,Last Donation\n";
    const rows = filtered.map(d =>
      [d.name, d.email, d.total, d.lastDonation].join(",")
    );
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = "donors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Donors</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Search donors..."
            />
          </div>
          <button
            onClick={exportCSV}
            className="ml-2 px-3 py-2 flex items-center bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            title="Export as CSV"
          >
            <Download className="h-5 w-5 mr-1" /> Export
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Total Donated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Last Donation</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-400">No donors found.</td>
              </tr>
            )}
            {filtered.map(donor => (
              <tr key={donor.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{donor.name}</td>
                <td className="px-6 py-4 flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{donor.email}</span>
                </td>
                <td className="px-6 py-4 text-green-700 font-semibold">${donor.total?.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{donor.lastDonation}</td>
                <td className="px-6 py-4">
                  <button
                    className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                    onClick={() => setSelectedDonor(donor)}
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!selectedDonor}
        onClose={() => setSelectedDonor(null)}
        title={selectedDonor ? `${selectedDonor.name} - Profile` : ""}
      >
        {selectedDonor && (
          <div>
            <div className="mb-2">
              <strong>Email:</strong> {selectedDonor.email}
            </div>
            <div className="mb-2">
              <strong>Total Donated:</strong> ${selectedDonor.total}
            </div>
            <div className="mb-2">
              <strong>Last Donation:</strong> {selectedDonor.lastDonation}
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Donation History</h3>
              <ul className="text-sm pl-5 list-disc">
                {(selectedDonor.donations || []).map((don, idx) => (
                  <li key={idx}>
                    ${don.amount} on {don.date}
                  </li>
                ))}
                {(selectedDonor.donations || []).length === 0 && <li>No donations on record.</li>}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Donors;
