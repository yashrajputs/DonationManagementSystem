import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import CampaignCard from "./CampaignCard";
import CampaignModal from "./CampaignModal";
import Modal from "../Common/Modal";
import SearchBar from "../Common/SearchBar";

const CampaignManagement = () => {
  const { state } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit" | "view"
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [query, setQuery] = useState("");

  const openModal = (mode, campaign = null) => {
    setModalMode(mode);
    setActiveCampaign(campaign);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const filteredCampaigns = state.campaigns.filter(
    c =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Campaign Management</h1>
        <button
          onClick={() => openModal("create")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow hover:bg-indigo-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">New Campaign</span>
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow flex items-center">
        <SearchBar value={query} onChange={setQuery} placeholder="Find campaign..." />
      </div>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.length === 0 && (
          <div className="col-span-full text-gray-400 p-10 text-center text-lg font-medium">
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
      {/* Example Modal usage for editing a campaign */}
      <Modal open={modalOpen && modalMode === "edit"} onClose={() => setModalOpen(false)} title="Edit Campaign">
        <div>Modal content here</div>
      </Modal>
    </div>
  );
};

export default CampaignManagement;
