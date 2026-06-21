"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UsersIcon, CheckBadgeIcon, ShieldExclamationIcon, ChevronRightIcon, KeyIcon } from "@heroicons/react/24/outline";

export default function UserAccessManagement() {
  const [selectedUser, setSelectedUser] = useState(1);

  const mockUsers = [
    { id: 1, name: "Alice Smith", email: "alice@example.com", status: "Active", role: "Manager" },
    { id: 2, name: "Bob Johnson", email: "bob@example.com", status: "Pending", role: "Developer" },
    { id: 3, name: "Charlie Davis", email: "charlie@example.com", status: "Active", role: "Viewer" },
  ];

  const selectedUserData = mockUsers.find(u => u.id === selectedUser);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
      className="relative flex flex-col h-full"
    >

      <div className="bg-white/60 backdrop-blur-xl rounded-3xl rounded-tl-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col flex-grow relative z-0 min-h-[400px]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-[#792CA2]/10 p-2 rounded-lg">
              <UsersIcon className="w-5 h-5 text-[#792CA2]" />
            </div>
            <h2 className="text-lg font-extrabold text-[#111844]">List of users given access</h2>
          </div>
          <div className="flex gap-2">
            <button className="bg-white px-4 py-1.5 rounded-lg text-xs font-bold text-[#792CA2] shadow-sm border border-[#792CA2]/20 hover:bg-[#792CA2]/5 transition-colors">
              Invite User
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 relative z-10 flex-grow">
          {/* User List */}
          <div className="flex-1 flex flex-col gap-2">
            {mockUsers.map(user => (
              <div 
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center justify-between group ${
                  selectedUser === user.id 
                    ? "bg-white border-[#792CA2]/30 shadow-md ring-1 ring-[#792CA2]/10" 
                    : "bg-white/50 border-white hover:bg-white hover:border-gray-200"
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold text-[#111844]">{user.name}</h4>
                  <p className="text-xs font-medium text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    user.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {user.status}
                  </span>
                  <ChevronRightIcon className={`w-4 h-4 transition-transform ${selectedUser === user.id ? "text-[#792CA2]" : "text-gray-300 group-hover:text-gray-500"}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Section 15 - Access Details */}
          <div className="flex-1 relative mt-8 md:mt-0">

            <div className="bg-gradient-to-br from-[#F9F7F7] to-white border border-gray-200/60 rounded-2xl p-6 shadow-inner h-full flex flex-col relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#9A4DCC]/10 rounded-full blur-2xl" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedUser}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 flex flex-col h-full"
                >
                  <h3 className="text-lg font-black text-[#111844] mb-1">Access Details</h3>
                  <p className="text-xs text-gray-500 font-medium mb-4">Currently viewing permissions for {selectedUserData?.name}</p>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="font-bold text-gray-500">{selectedUserData?.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#111844]">{selectedUserData?.role}</div>
                        <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
                          <CheckBadgeIcon className="w-3 h-3" /> Fully Verified
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-medium">Dashboard Access</span>
                        <span className="text-green-600 font-bold">Granted</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-medium">Billing Details</span>
                        <span className={selectedUserData?.role === "Manager" ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                          {selectedUserData?.role === "Manager" ? "Granted" : "Denied"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-medium">Manage Resources</span>
                        <span className={selectedUserData?.role !== "Viewer" ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                          {selectedUserData?.role !== "Viewer" ? "Granted" : "Denied"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
