import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const CampaignModal = ({ open, mode, campaign, onClose }) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  const isDelete = mode === "delete";

  const { dispatch } = useApp();

  // Form state only for create/edit
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    goal: "",
    endDate: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && campaign) {
      setFormState({
        title: campaign.title,
        description: campaign.description,
        goal: campaign.goal.toString(),
        endDate: campaign.endDate,
      });
    } else if (isCreate) {
      setFormState({ title: "", description: "", goal: "", endDate: "" });
    }
    setError("");
  }, [campaign, mode, isEdit, isCreate]);

  if (!open) return null;

  // Form validation (basic)
  const validate = () => {
    if (!formState.title || !formState.description || !formState.goal || !formState.endDate)
      return "Please fill all fields.";
    if (isNaN(parseInt(formState.goal)))
      return "Goal amount must be a number.";
    return "";
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    if (isCreate) {
      dispatch({
        type: "ADD_CAMPAIGN",
        payload: {
          title: formState.title,
          description: formState.description,
          goal: parseInt(formState.goal),
          raised: 0,
          donors: 0,
          endDate: formState.endDate,
          status: 'active'
        }
      });
    } else if (isEdit && campaign) {
      dispatch({
        type: "UPDATE_CAMPAIGN",
        payload: {
          ...campaign,
          ...formState,
          goal: parseInt(formState.goal),
        }
      });
    }
    onClose();
  };

  const handleDelete = () => {
    dispatch({ type: "DELETE_CAMPAIGN", payload: campaign.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {isCreate && "Create Campaign"}
            {isEdit && "Edit Campaign"}
            {isView && "Campaign Details"}
            {isDelete && "Delete Campaign"}
          </h2>
          <button className="text-2xl text-gray-400 hover:text-gray-700" onClick={onClose}>
            ×
          </button>
        </div>
        {isView && campaign && (
          <div>
            <h3 className="font-semibold text-lg mb-1">{campaign.title}</h3>
            <p className="text-gray-700 mb-3">{campaign.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
              <div>
                <span className="font-semibold">Goal:</span>
                <span> ${campaign.goal.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-semibold">Raised:</span>
                <span> ${campaign.raised.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-semibold">Donors:</span>
                <span> {campaign.donors}</span>
              </div>
              <div>
                <span className="font-semibold">End Date:</span>
                <span> {campaign.endDate}</span>
              </div>
            </div>
            <button
              className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-medium"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
        {(isCreate || isEdit) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={formState.title}
                onChange={e => setFormState({ ...formState, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={3}
                value={formState.description}
                onChange={e => setFormState({ ...formState, description: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Amount
              </label>
              <input
                type="number"
                min={1}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={formState.goal}
                onChange={e => setFormState({ ...formState, goal: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={formState.endDate}
                onChange={e => setFormState({ ...formState, endDate: e.target.value })}
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 rounded-lg mr-3"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                {isCreate ? "Create" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
        {isDelete && (
          <div>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete <span className="font-bold">{campaign.title}</span>?
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-100 rounded-lg mr-3"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignModal;
