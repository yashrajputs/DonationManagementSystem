import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useApp } from "../../context/AppContext";
import CampaignCard from "./CampaignCard";
import CampaignModal from "./CampaignModal";

const CampaignManagement = () => {
  const { state } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit" | "view"
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [search, setSearch] = useState("");

  const openModal = (mode, campaign = null) => {
    setModalMode(mode);
    setActiveCampaign(campaign);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const filteredCampaigns = state.campaigns.filter(
    c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Campaign Management</h1>
        <button
          onClick={() => openModal("create")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Campaign
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.length === 0 && (
          <div className="col-span-full text-gray-500 p-10 text-center">
            No campaigns found.
          </div>
        )}
        {filteredCampaigns.map(campaign => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onView={() => openModal("view", campaign)}
            onEdit={() => openModal("edit", campaign)}
            onDelete={() => openModal("delete", campaign)}
          />
        ))}
      </div>
      <CampaignModal
        open={modalOpen}
        mode={modalMode}
        campaign={activeCampaign}
        onClose={closeModal}
      />
    </div>
  );
};

export default CampaignManagement;
