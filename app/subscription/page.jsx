"use client";

import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Subscriptions() {
  const [form, setForm] = useState({
    appName: "",
    amount: "",
    startDate: null, // DatePicker expects null initially
    validityMonths: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Convert Date object to ISO string before sending
      const payload = {
        ...form,
        startDate: form.startDate ? form.startDate.toISOString() : null,
      };

      await axios.post("https://subs-back.onrender.com/api/subscriptions", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Subscription added successfully!");
      setForm({
        appName: "",
        amount: "",
        startDate: null,
        validityMonths: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-black/80 backdrop-blur-md border border-white/20 rounded-3xl p-10 shadow-xl flex flex-col gap-5"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Add New Subscription
          </h2>
          <p className="text-white/70 text-center text-sm mb-6">
            Track your subscriptions and manage your spending efficiently.
          </p>

          {/* App Name */}
          <div className="flex flex-col">
            <label className="text-white/80 mb-1 font-medium">App Name</label>
            <input
              name="appName"
              placeholder="e.g., Netflix, Spotify"
              value={form.appName}
              onChange={handleInputChange}
              required
              className="bg-black/50 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-neon rounded-lg px-4 py-3 transition-all outline-none"
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col">
            <label className="text-white/80 mb-1 font-medium">Amount</label>
            <input
              name="amount"
              type="number"
              placeholder="Enter monthly amount"
              value={form.amount}
              onChange={handleInputChange}
              required
              className="bg-black/50 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-neon rounded-lg px-4 py-3 transition-all outline-none"
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-white/80 mb-1 font-medium">Start Date</label>
            <DatePicker
              selected={form.startDate}
              onChange={(date) => handleChange("startDate", date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select start date"
              className="bg-black/50 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-neon rounded-lg px-4 py-3 transition-all outline-none w-full"
            />
          </div>

          {/* Validity */}
          <div className="flex flex-col">
            <label className="text-white/80 mb-1 font-medium">Validity (Months)</label>
            <input
              name="validityMonths"
              type="number"
              placeholder="e.g., 12"
              value={form.validityMonths}
              onChange={handleInputChange}
              required
              className="bg-black/50 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-neon rounded-lg px-4 py-3 transition-all outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mx-auto w-3/4 bg-white text-black py-3 rounded-xl font-semibold hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Subscription"}
          </button>

          {/* Info Footer */}
          <p className="text-white/50 text-xs mt-3 text-center">
            All your subscription data is safe and private.
          </p>
        </form>
      </div>

     
    </div>
  );
}
