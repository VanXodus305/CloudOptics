"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersIcon,
  CheckBadgeIcon,
  ShieldExclamationIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";


export default function UserAccessManagement() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Revoke state
  const [revokingId, setRevokingId] = useState(null);

  const fetchMembers = async (searchTerm = "") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/members?search=${encodeURIComponent(searchTerm)}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
        if (data.length > 0) {
          // Select previous if still exists, else first
          const stillExists = data.some((m) => m._id === selectedMemberId);
          if (!stillExists) {
            setSelectedMemberId(data[0]._id);
          }
        } else {
          setSelectedMemberId(null);
        }
      }
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMembers(search);
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      setInviting(true);
      setInviteError("");
      setInviteSuccess(false);

      const res = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail.trim().toLowerCase(),
          role: inviteRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to invite member");
      }

      setInviteSuccess(true);
      setInviteEmail("");
      setInviteRole("Viewer");
      
      // Auto-close modal after success message
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(false);
      }, 1500);

      // Refresh list
      fetchMembers(search);
    } catch (err) {
      setInviteError(err.message);
    } finally {
      setInviting(false);
    }
  };

  const handleRevoke = async (memberId) => {
    if (!confirm("Are you sure you want to permanently revoke access for this user?")) return;

    try {
      setRevokingId(memberId);
      const res = await fetch(`/api/members/${memberId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to revoke access");
      }

      // Refresh list
      fetchMembers(search);
    } catch (err) {
      alert(err.message);
    } finally {
      setRevokingId(null);
    }
  };

  const selectedMember = members.find((m) => m._id === selectedMemberId);

  const getMemberStatus = (m) => {
    const isActive = m.picture || (m.name && m.name !== "Pending Invitation" && m.name !== m.email.split("@")[0]);
    return isActive ? "Active" : "Pending";
  };

  const currentUserId = session?.user?.id;
  const currentUserEmail = session?.user?.email;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
      className="relative flex flex-col h-full"
    >
      <div className="bg-white/60 dark:bg-[#0F122B]/60 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white dark:border-white/5 flex flex-col flex-grow relative z-0 min-h-[500px]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-[#792CA2]/10 p-2 rounded-lg">
              <UsersIcon className="w-5 h-5 text-[#792CA2]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#111844] dark:text-[#F9F7F7]">List of users given access</h2>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-0.5">Manage team members and credentials</p>
            </div>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="hidden sm:block bg-gradient-to-r from-[#792CA2] to-[#9A4DCC] px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            Invite User
          </button>
        </div>

        {/* Search Bar + Mobile Invite User Button */}
        <div className="flex items-center gap-2 mb-4 z-10">
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/80 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold text-[#111844] dark:text-[#F9F7F7] focus:outline-none focus:ring-1 focus:ring-[#792CA2]/30 shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="sm:hidden bg-gradient-to-r from-[#792CA2] to-[#9A4DCC] px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:scale-105 active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
          >
            Invite User
          </button>
        </div>

        {/* Content Body split in two columns */}
        <div className="flex flex-col lg:flex-row gap-6 relative z-10 flex-grow">
          {/* User List Panel */}
          <div className="flex-1 flex flex-col gap-2 max-h-[380px] overflow-y-auto no-scrollbar p-1">
            {loading && members.length === 0 ? (
              <div className="flex items-center justify-center p-8 flex-grow">
                <div className="w-6 h-6 border-2 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-12 bg-white/40 dark:bg-slate-800/20 border border-gray-100 dark:border-slate-800 rounded-2xl">
                <p className="text-xs text-gray-500 font-bold">No users found</p>
                {search.includes("@") && (
                  <button
                    onClick={() => {
                      setInviteEmail(search);
                      setShowInviteModal(true);
                    }}
                    className="mt-3 text-xs font-extrabold text-[#792CA2] dark:text-[#C084FC] hover:underline"
                  >
                    Invite "{search}" now
                  </button>
                )}
              </div>
            ) : (
              members.map((user) => {
                const isSelected = selectedMemberId === user._id;
                const status = getMemberStatus(user);
                return (
                  <div
                    key={user._id}
                    onClick={() => setSelectedMemberId(user._id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center justify-between group ${
                      isSelected
                        ? "bg-white dark:bg-slate-800 border-[#792CA2]/30 dark:border-[#C084FC]/30 shadow-md ring-1 ring-[#792CA2]/10"
                        : "bg-white/50 dark:bg-slate-900/30 border-white dark:border-transparent hover:bg-white dark:hover:bg-slate-800 hover:border-gray-200 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#792CA2]/10 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-slate-700 flex-shrink-0">
                        {user.picture ? (
                          <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-extrabold text-[#792CA2] text-xs">
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="truncate max-w-[100px] xs:max-w-[140px] sm:max-w-[200px] min-w-0">
                        <h4 className="text-xs font-extrabold text-[#111844] dark:text-[#F9F7F7] truncate">
                          {user.name === "Pending Invitation" ? user.email.split("@")[0] : user.name}
                        </h4>
                        <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                          status === "Active"
                            ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                            : "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400"
                        }`}
                      >
                        {status}
                      </span>
                      <ChevronRightIcon
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected
                            ? "text-[#792CA2] dark:text-[#C084FC]"
                            : "text-gray-300 dark:text-slate-600 group-hover:text-gray-500"
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* User Details Inspector */}
          <div className="flex-1 relative mt-4 lg:mt-0 max-h-[380px]">
            <div className="bg-gradient-to-br from-[#F9F7F7] to-white dark:from-slate-900/40 dark:to-slate-800/40 border border-gray-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-inner h-full flex flex-col relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#9A4DCC]/10 rounded-full blur-2xl" />

              <AnimatePresence mode="wait">
                {selectedMember ? (
                  <motion.div
                    key={selectedMember._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 flex flex-col h-full justify-between"
                  >
                    <div>
                      <h3 className="text-base font-black text-[#111844] dark:text-[#F9F7F7] mb-1">Access Details</h3>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mb-4">
                        Authorized permissions for {selectedMember.name}
                      </p>

                      <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#792CA2] to-[#DCCBFF] p-0.5 shadow-sm overflow-hidden flex items-center justify-center">
                            {selectedMember.picture ? (
                              <img
                                src={selectedMember.picture}
                                alt={selectedMember.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                                <span className="font-extrabold text-[#792CA2] dark:text-[#C084FC] text-sm">
                                  {selectedMember.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="truncate">
                            <div className="font-extrabold text-sm text-[#111844] dark:text-[#F9F7F7]">
                              {selectedMember.role}
                            </div>
                            <div className="text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1 mt-0.5">
                              <CheckBadgeIcon className="w-3.5 h-3.5" /> Approved Credentials
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mt-4 pt-2 border-t border-gray-50 dark:border-slate-700/60">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-gray-500 dark:text-gray-400">Dashboard View</span>
                            <span className="text-green-600 dark:text-green-400 font-extrabold">Granted</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-gray-500 dark:text-gray-400">Optimize Resources</span>
                            <span
                              className={
                                selectedMember.role === "Admin"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-500 dark:text-red-400"
                              }
                            >
                              {selectedMember.role === "Admin" ? "Granted" : "Denied"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-gray-500 dark:text-gray-400">User Invitations</span>
                            <span
                              className={
                                selectedMember.role === "Admin"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-500 dark:text-red-400"
                              }
                            >
                              {selectedMember.role === "Admin" ? "Granted" : "Denied"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Revoke Action (Check that it is not self) */}
                    <div className="mt-4 pt-4">
                      {selectedMember.email === currentUserEmail ? (
                        <div className="text-[10px] text-center font-bold text-gray-400 dark:text-gray-500 bg-white/40 dark:bg-slate-800/40 py-2.5 rounded-xl border border-gray-100 dark:border-slate-700/60">
                          Active Account (Logged In)
                        </div>
                      ) : (
                        <button
                          disabled={revokingId === selectedMember._id}
                          onClick={() => handleRevoke(selectedMember._id)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all shadow-red-500/10 active:scale-95 disabled:opacity-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                          {revokingId === selectedMember._id ? "Revoking Access..." : "Revoke Account Access"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <ShieldExclamationIcon className="w-10 h-10 text-gray-400 dark:text-slate-600 mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Select a user to review permission levels</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ── INVITATION MODAL ── */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#111844]/65 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0F122B] border border-white dark:border-white/5 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowInviteModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-[#792CA2]/10 p-2 rounded-lg">
                  <EnvelopeIcon className="w-5 h-5 text-[#792CA2] dark:text-[#C084FC]" />
                </div>
                <h3 className="text-lg font-black text-[#111844] dark:text-[#F9F7F7] tracking-tight">Invite Team Member</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6 font-semibold">
                Pre-authorize an email address with a specialized system role. An invitation message will be sent.
              </p>

              {inviteSuccess ? (
                <div className="bg-green-500/10 dark:bg-green-950/45 border border-green-500/20 text-green-700 dark:text-green-400 rounded-xl p-4 text-xs font-bold text-center mb-4">
                  Invitation email sent successfully!
                </div>
              ) : (
                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 px-4 py-3 rounded-xl text-xs font-bold text-[#111844] dark:text-[#F9F7F7] focus:outline-none focus:ring-1 focus:ring-[#792CA2]/30 shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                      Authorized Role
                    </label>
                    <Dropdown placement="bottom-start" className="w-full">
                      <DropdownTrigger>
                        <Button
                          variant="flat"
                          className="w-full bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 px-4 py-3 h-auto min-h-[44px] rounded-xl text-xs font-extrabold text-[#111844] dark:text-[#F9F7F7] flex items-center justify-between transition-all"
                        >
                          <span>{inviteRole === "Viewer" ? "Viewer (Read-only Access)" : "Administrator (Full Access)"}</span>
                          <span className="text-[8px] opacity-75 ml-2">▼</span>
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Authorized Role Selector"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={new Set([inviteRole])}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0];
                          setInviteRole(selected);
                        }}
                        className="text-xs text-[#111844] dark:text-[#F9F7F7]"
                      >
                        <DropdownItem key="Viewer">Viewer (Read-only Access)</DropdownItem>
                        <DropdownItem key="Admin">Administrator (Full Access)</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  {inviteError && (
                    <div className="text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/10 rounded-xl p-3">
                      {inviteError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 font-bold py-3 rounded-xl text-xs transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={inviting}
                      className="flex-1 bg-gradient-to-r from-[#792CA2] to-[#9A4DCC] text-white font-bold py-3 rounded-xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      {inviting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Inviting...</span>
                        </>
                      ) : (
                        <span>Send Invitation</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
