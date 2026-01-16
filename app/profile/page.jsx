"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";



export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://subs-back.onrender.com/api/subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptions(res.data);
    } catch (err) {
      alert("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const calculateRenewal = (sub) => {
    const start = new Date(sub.startDate);
    const renewal = new Date(start);
    renewal.setMonth(start.getMonth() + sub.validityMonths);
    const now = new Date();
    const daysLeft = Math.max(Math.ceil((renewal - now) / (1000 * 60 * 60 * 24)), 0);
    return { renewalDate: renewal.toLocaleDateString(), daysLeft };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-28 px-6 lg:px-16">
      <Navbar />

      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* User Info Card */}
        <div className="bg-black/50 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-neon mb-2">{user?.name}</h2>
            <p className="text-white/70 mb-1">Email: {user?.email}</p>
            <p className="text-white/50 text-sm">Registered Date: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-black/50 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-2xl font-bold text-neon mb-6 text-center">Your Subscriptions</h3>

          {loading ? (
            <p className="text-white text-center">Loading subscriptions...</p>
          ) : subscriptions.length === 0 ? (
            <p className="text-white/60 text-center">You have no active subscriptions.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-white/70 border-b border-white/10">
                    <th className="py-3 px-4">App Name</th>
                    <th className="py-3 px-4">Amount (₹)</th>
                    <th className="py-3 px-4">Renewal Date</th>
                    <th className="py-3 px-4">Days Left</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => {
                    const { renewalDate, daysLeft } = calculateRenewal(sub);
                    return (
                      <tr key={sub._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-medium">{sub.appName}</td>
                        <td className="py-3 px-4">{sub.amount}</td>
                        <td className="py-3 px-4">{renewalDate}</td>
                        <td className={`py-3 px-4 font-semibold ${daysLeft <= 3 ? 'text-red-400' : 'text-neon'}`}>
                          {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
      <Footer/>
    </div>
  );
}
