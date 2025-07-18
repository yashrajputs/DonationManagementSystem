import React, { useState } from "react";
import { Bell, AlertTriangle } from "lucide-react";

const NotificationSettings = ({ preferences, onUpdate }) => {
  // preferences = { emailDonations: true, emailCampaigns: false, emailTips: true }
  const [prefs, setPrefs] = useState(preferences || {});

  const update = (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    onUpdate?.(updated);
  };

  return (
    <div>
      <h2 className="font-semibold mb-2 flex items-center"><Bell className="mr-2 h-5 w-5 text-yellow-400" />Notifications</h2>
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={!!prefs.emailDonations} onChange={() => update("emailDonations")} />
          <span>Email me for new donations</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={!!prefs.emailCampaigns} onChange={() => update("emailCampaigns")} />
          <span>Email me when a new campaign launches</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={!!prefs.emailTips} onChange={() => update("emailTips")} />
          <span>Tips, best practices, and events</span>
        </label>
      </div>
      <div className="mt-2 flex items-center text-xs text-gray-400">
        <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
        Email changes take effect instantly.
      </div>
    </div>
  );
};

export default NotificationSettings;
