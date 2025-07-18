import React, { useState } from "react";
import Modal from "./Modal";

const InviteUserModal = ({ open, onClose, onInvite }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("manager");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email.");
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
    }, 1000); // Simulate API call & refresh
  };

  return (
    <Modal open={open} onClose={onClose} title="Invite New User">
      <form onSubmit={handleInvite} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Invitee Email</label>
          <input
            type="email"
            required
            value={email}
            autoFocus
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={e => setEmail(e.target.value)}
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
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
        <div className="flex justify-end">
          <button type="button" className="mr-3 px-4 py-2 rounded border border-gray-200" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700" disabled={sent}>
            {sent ? "Sending..." : "Send Invite"}
          </button>
        </div>
        {sent && <div className="text-green-500 mt-3">Invitation sent!</div>}
      </form>
    </Modal>
  );
};

export default InviteUserModal;
