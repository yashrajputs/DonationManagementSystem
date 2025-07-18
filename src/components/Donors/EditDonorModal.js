// components/Donors/EditDonorModal.js
import React, { useState, useEffect } from "react";
import Modal from "../Common/Modal";
import { useApp } from "../../context/AppContext";

const EditDonorModal = ({ donor, open, onClose }) => {
  const { dispatch } = useApp();
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (donor)
      setForm({ name: donor.name, email: donor.email });
    else
      setForm({ name: "", email: "" });
    setError("");
  }, [donor, open]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("A valid email address is required.");
      return;
    }
    setError("");
    dispatch({
      type: donor ? "UPDATE_DONOR" : "ADD_DONOR",
      payload: donor
        ? { ...donor, ...form }
        : { id: Date.now(), ...form, total: 0, lastDonation: "", donations: [] }
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={donor ? "Edit Donor" : "Add Donor"}>
      <form className="space-y-4" onSubmit={handleSave}>
        <div>
          <label className="block mb-1 text-sm">Name</label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex justify-end space-x-2">
          <button type="button" className="px-4 py-2 border rounded" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
            {donor ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDonorModal;
