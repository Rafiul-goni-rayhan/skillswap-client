"use client";

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 🚀 আপনার ব্যাকএন্ডের ওরিজনাল এপিআই পোর্ট বা ইউআরএল এখানে দিন
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // যদি আপনার লোকালহোস্টে চলে তবে credentials: "include" দিতে পারেন
          }
        });

        const resData = await response.json();

        if (resData.success) {
          setUsers(resData.data);
        } else {
          toast.error(resData.message || "Failed to load users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Network error while loading users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 text-white bg-[#0B0B0F] min-h-screen">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-4">
        Manage Users
      </h1>
      
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading users node list...</p>
      ) : (
        <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user._id} className="text-gray-300">
                  <td className="py-3 font-semibold">{user.name}</td>
                  <td className="py-3 text-gray-400">{user.email}</td>
                  <td className="py-3 capitalize">{user.role}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${user.isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}