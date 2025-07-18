import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";

const CampaignCard = ({ campaign, onView, onEdit, onDelete }) => {
  const progress = Math.min(
    Math.round((campaign.raised / campaign.goal) * 100),
    100
  );
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex-1">
            {campaign.title}
          </h3>
          <div className="flex space-x-2">
            <button
              title="View"
              onClick={onView}
              className="p-1 text-gray-500 hover:text-blue-600"
            >
              <Eye size={18} />
            </button>
            <button
              title="Edit"
              onClick={onEdit}
              className="p-1 text-gray-500 hover:text-green-600"
            >
              <Edit size={18} />
            </button>
            <button
              title="Delete"
              onClick={onDelete}
              className="p-1 text-gray-500 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4 flex-1">{campaign.description}</p>
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm">
            <span>Goal: ${campaign.goal.toLocaleString()}</span>
            <span>Raised: ${campaign.raised.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{campaign.donors} donors</span>
            <span>Ends: {campaign.endDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
