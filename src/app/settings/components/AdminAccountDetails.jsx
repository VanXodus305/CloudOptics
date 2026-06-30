"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircleIcon, ShieldCheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

export default function AdminAccountDetails() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Admin User";
  const userEmail = session?.user?.email || "admin@cloudoptics.io";
  const isViewer = session?.user?.role === "Viewer";

  // Modal & Editing state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOpenEditModal = () => {
    setEditName(userName);
    setEditEmail(userEmail);
    setOtpSent(false);
    setOtpCode("");
    setError("");
    setSuccess("");
    setShowEditModal(true);
  };

  const handleSaveNameOnly = async () => {
    if (!editName.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-name", name: editName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile name");

      setSuccess("Profile name updated! Refreshing session...");
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!editEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp", newEmail: editEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send verification code");

      setOtpSent(true);
      setSuccess(`Verification code sent to ${editEmail}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.trim().length !== 6) {
      setError("Verification code must be exactly 6 digits");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // 1. Verify OTP and change email
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-email", newEmail: editEmail, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to verify email address");

      // 2. If name is also changed, update it too
      if (editName.trim() !== userName) {
        const nameRes = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update-name", name: editName }),
        });
        const nameData = await nameRes.json();
        if (!nameRes.ok) throw new Error(nameData.error || "Failed to update profile name");
      }

      setSuccess("Profile updated successfully! Refreshing session...");
      setTimeout(() => {
        window.location.reload();
      }, 1250);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative flex-grow flex flex-col"
    >
      <div className="bg-white/60 dark:bg-[#0F122B]/60 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white dark:border-white/5 flex flex-col items-center flex-grow relative z-0 overflow-hidden min-h-[400px]">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#792CA2]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#9A4DCC]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC]">
            {isViewer ? "User Profile details" : "Admin Account details"}
          </h2>
          <button 
            onClick={handleOpenEditModal}
            className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-500 hover:text-[#792CA2] dark:text-gray-400"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 relative z-10 w-full mt-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#792CA2] to-[#DCCBFF] p-1 shadow-lg shadow-[#792CA2]/20">
              <div className="w-full h-full bg-white dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800">
                {session?.user?.image ? (
                  <img src={session.user.image} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <UserCircleIcon className="w-20 h-20 text-gray-300 dark:text-slate-600" />
                )}
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </div>
          </div>

          <div className="text-center mt-2">
            <h3 className="text-2xl font-black text-[#111844] dark:text-[#F9F7F7]">{userName}</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{userEmail}</p>
          </div>

          <div className="mt-6 bg-white/80 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 w-full flex items-center gap-4 shadow-md">
            <div className="bg-[#792CA2]/10 p-3 rounded-xl">
              <ShieldCheckIcon className="w-6 h-6 text-[#792CA2]" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Role & Permissions</p>
              <p className="text-sm font-bold text-[#111844] dark:text-[#F9F7F7] mt-0.5">
                {isViewer ? "Viewer" : "Admin"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROFILE EDIT MODAL ── */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#111844]/65 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0F122B] border border-white dark:border-white/5 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative text-left"
            >
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-[#792CA2]/10 p-2 rounded-lg">
                  <PencilIcon className="w-5 h-5 text-[#792CA2] dark:text-[#C084FC]" />
                </div>
                <h3 className="text-lg font-black text-[#111844] dark:text-[#F9F7F7] tracking-tight">Edit Profile Details</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6 font-semibold">
                Update your account name or email address. To change your email address, you must verify it with a 6-digit OTP code sent.
              </p>

              {error && (
                <div className="text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/10 rounded-xl p-3 mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-[11px] font-bold text-green-500 bg-green-500/10 border border-green-500/10 rounded-xl p-3 mb-4 animate-pulse">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={loading || otpSent}
                    placeholder="Enter full name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 px-4 py-3 rounded-xl text-xs font-bold text-[#111844] dark:text-[#F9F7F7] focus:outline-none focus:ring-1 focus:ring-[#792CA2]/30 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      disabled={loading || otpSent}
                      placeholder="Enter new email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="flex-grow bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 px-4 py-3 rounded-xl text-xs font-bold text-[#111844] dark:text-[#F9F7F7] focus:outline-none focus:ring-1 focus:ring-[#792CA2]/30 shadow-inner"
                    />
                    {editEmail.trim().toLowerCase() !== userEmail.trim().toLowerCase() && !otpSent && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="bg-gradient-to-r from-[#792CA2] to-[#9A4DCC] text-white text-[10px] font-bold px-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center whitespace-nowrap"
                      >
                        {loading ? "Sending..." : "Send OTP"}
                      </button>
                    )}
                  </div>
                </div>

                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#792CA2]/5 dark:bg-[#792CA2]/10 border border-[#792CA2]/10 rounded-2xl p-4 space-y-3"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-[#792CA2] dark:text-[#C084FC] uppercase tracking-wider mb-2">
                        Verification Code (OTP)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="6-digit code"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="flex-grow bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs font-black text-[#111844] dark:text-[#F9F7F7] tracking-widest text-center focus:outline-none focus:ring-1 focus:ring-[#792CA2]/30"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center whitespace-nowrap"
                        >
                          {loading ? "Verifying..." : "Verify & Update"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {(!otpSent || editName.trim() !== userName) && (
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 font-bold py-3 rounded-xl text-xs transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNameOnly}
                      disabled={loading || editName.trim() === userName || editEmail.trim().toLowerCase() !== userEmail.trim().toLowerCase()}
                      className="flex-1 bg-gradient-to-r from-[#792CA2] to-[#9A4DCC] text-white font-bold py-3 rounded-xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {loading ? "Saving..." : "Save Name"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
