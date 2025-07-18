// components/Common/InviteUserModal.js
import React, { useState } from "react";
import Modal from "./Modal"; // Use your global modal component

const InviteUserModal = ({ open, onClose, onInvite }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("manager");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    setSent(true);
    setTimeout(() => {
      onInvite?.({ email, role });
      setSent(false);
      setEmail("");
      setRole("manager");
      onClose();
    }, 1000);
  };

  return (
    <Modal open={open} onClose={onClose} title="Invite New User">
      <form className="space-y-4" onSubmit={handleInvite}>
        <div>
          <label className="block mb-1 text-sm font-medium">Email Address</label>
          <input
            type="email"
            required
            value={email}
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={e => setEmail(e.target.value)}
            autoFocus
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex justify-end space-x-2">
          <button type="button" className="px-4 py-2 border rounded" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={sent}>
            {sent ? "Sending..." : "Send Invite"}
          </button>
        </div>
        {sent && <div className="text-green-500 mt-2">Invitation sent!</div>}
      </form>
    </Modal>
  );
};

export default InviteUserModal;
