import React, { useState } from "react";
import { Settings as SettingsIcon, Bell, Moon } from "lucide-react";

const Settings = () => {
  // You can initialize get/set state from context or localStorage as needed
  const [orgName, setOrgName] = useState("Charity Example Org");
  const [contact, setContact] = useState("info@charity.org");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");

  const handleSave = () => {
    // Save settings to context, backend, or localStorage
    alert("Settings saved (implement persistent logic as needed).");
  };

  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-8 w-8 text-indigo-500" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
        <div>
          <h2 className="text-lg font-semibold flex items-center mb-2">Organization Profile</h2>
          <div className="mb-3">
            <label className="block mb-1 text-sm">Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs mb-2"
            />
            <label className="block mb-1 text-sm">Contact Email</label>
            <input
              type="email"
              value={contact}
              onChange={e => setContact(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold flex items-center mb-2"><Bell className="h-5 w-5 mr-2 text-gray-400" />Notification Preferences</h2>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(n => !n)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span>Email me for new donations</span>
          </label>
        </div>
        <div>
          <h2 className="text-lg font-semibold flex items-center mb-2"><Moon className="h-5 w-5 mr-2 text-gray-400" />Theme</h2>
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-48"
          >
            <option value="light">Light</option>
            <option value="dark">Dark (coming soon)</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
