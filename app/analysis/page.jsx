"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analysis() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [trendData, setTrendData] = useState({});
  const [renewAlerts, setRenewAlerts] = useState([]);

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://subs-back.onrender.com/api/subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const subs = res.data;
      setSubscriptions(subs);

      // Total monthly spending
      const total = subs.reduce((acc, sub) => acc + Number(sub.amount), 0);
      setMonthlyTotal(total);

      // Pie chart: spending by category (or first letter placeholder)
      const categoryMap = {};
      subs.forEach(sub => {
        const category = sub.category || sub.appName[0];
        if (!categoryMap[category]) categoryMap[category] = 0;
        categoryMap[category] += Number(sub.amount);
      });
      setCategoryData({
        labels: Object.keys(categoryMap),
        datasets: [{
          data: Object.values(categoryMap),
          backgroundColor: ['#39FF14', '#0FF0FC', '#FF1AFF', '#FF6F61', '#FFD700'],
        }]
      });

      // Trend chart: previous month vs current month
      const now = new Date();
      const currentMonth = now.getMonth();
      const previousMonth = currentMonth - 1 < 0 ? 11 : currentMonth - 1;
      const prevTotal = subs.filter(s => new Date(s.startDate).getMonth() === previousMonth)
        .reduce((a, b) => a + Number(b.amount), 0);
      setTrendData({
        labels: ['Previous Month', 'Current Month'],
        datasets: [{
          label: 'Total Spending',
          data: [prevTotal, total],
          borderColor: '#39FF14',
          backgroundColor: 'rgba(57,255,20,0.2)',
          tension: 0.4
        }]
      });

      // Upcoming renewals 7–15 days
      const alerts = subs.filter(sub => {
        const start = new Date(sub.startDate);
        const renewal = new Date(start);
        renewal.setMonth(start.getMonth() + sub.validityMonths);
        const diffDays = Math.ceil((renewal - now) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 15;
      });
      setRenewAlerts(alerts);

    } catch (err) {
      alert("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (sub) => {
    const start = new Date(sub.startDate);
    const now = new Date();
    const renewal = new Date(start);
    renewal.setMonth(start.getMonth() + sub.validityMonths);

    const totalDays = (renewal - start) / (1000 * 60 * 60 * 24);
    const daysPassed = (now - start) / (1000 * 60 * 60 * 24);
    const progress = Math.min((daysPassed / totalDays) * 100, 100);
    const daysLeft = Math.max(Math.ceil(totalDays - daysPassed), 0);

    return { progress, daysLeft, endDate: renewal.toLocaleDateString() };
  };

  const handleRenew = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://subs-back.onrender.com/api/subscriptions/${id}/renew`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubs();
      alert("Subscription renewed!");
    } catch (err) {
      alert("Failed to renew subscription");
    }
  };

  const handleStop = async (id) => {
    if (!confirm("Stop this subscription? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://subs-back.onrender.com/api/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubs();
      alert("Subscription stopped!");
    } catch (err) {
      alert("Failed to stop subscription");
    }
  };

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-28 px-6 lg:px-16">
      <Navbar />

      {/* Header */}
      <h2 className="text-4xl font-bold mb-3 text-center tracking-wide text-neon">
        Subscription Analytics
      </h2>
      <p className="text-center text-white/70 mb-12 max-w-3xl mx-auto">
        Monitor your active subscriptions, analyze spending trends, see upcoming renewals, and manage renewals or cancellations efficiently.
      </p>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-glass p-6 rounded-3xl shadow border border-white/20 flex flex-col items-center">
          <p className="text-white/70 text-sm mb-2">Total Monthly Spend</p>
          <p className="text-2xl font-bold text-neon">₹{monthlyTotal}</p>
        </div>
        <div className="bg-glass p-6 rounded-3xl shadow border border-white/20 flex flex-col items-center">
          <p className="text-white/70 text-sm mb-2">Active Subscriptions</p>
          <p className="text-2xl font-bold text-neon">{subscriptions.length}</p>
        </div>
        <div className="bg-glass p-6 rounded-3xl shadow border border-white/20 flex flex-col items-center">
          <p className="text-white/70 text-sm mb-2">Upcoming Renewals (7–15d)</p>
          <p className="text-2xl font-bold text-red-500">{renewAlerts.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Pie Chart */}
        <div className="bg-glass p-4 rounded-2xl shadow border border-white/20 flex flex-col items-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h3 className="text-lg font-semibold mb-4 text-neon text-center">Spending by Category</h3>
          <div style={{ width: 250, height: 250 }}>
            <Pie data={categoryData} />
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-glass p-4 rounded-2xl shadow border border-white/20 flex flex-col items-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h3 className="text-lg font-semibold mb-4 text-neon text-center">Spending Trend</h3>
          <div style={{ width: 300, height: 200 }}>
            <Line
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { labels: { color: 'white' } }
                }
              }}
            />
          </div>
        </div>
      </div>


      {/* Subscription Cards */}
      <h3 className="text-2xl font-bold mb-6 text-neon">Active Subscriptions</h3>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
        {subscriptions.map((sub) => {
          const { progress, daysLeft, endDate } = calculateProgress(sub);
          return (
            <div key={sub._id} className="relative bg-black/50 backdrop-blur-lg border border-white/20 rounded-3xl p-6 flex flex-col items-center shadow-2xl hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 rounded-3xl border-2 border-neon/20 pointer-events-none"></div>

              <div className="w-32 h-32 mb-4">
                <CircularProgressbar value={progress} text={`${daysLeft}d`} styles={buildStyles({
                  textColor: "#FFFFFF",
                  pathColor: "#39FF14",
                  trailColor: "rgba(255,255,255,0.1)",
                  textSize: '16px',
                })} />
              </div>

              <h3 className="text-2xl font-bold mb-1">{sub.appName}</h3>
              <p className="text-white/70 mb-1">Amount: ₹{sub.amount}</p>
              <p className="text-white/50 mb-3 text-sm">Valid till: <span className="font-medium">{endDate}</span></p>

              <div className="flex gap-4 mt-2 w-full justify-center">
                <button onClick={() => handleRenew(sub._id)} className="bg-neon px-5 py-2 rounded-xl font-semibold hover:brightness-110 transition-all">Renew</button>
                <button onClick={() => handleStop(sub._id)} className="bg-red-500 px-5 py-2 rounded-xl font-semibold hover:brightness-110 transition-all">Stop</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Renewals Table */}
      <div className="bg-glass p-6 rounded-3xl shadow border border-white/20 mb-12">
        <h3 className="text-lg font-semibold mb-4 text-neon">Upcoming Renewals (Next 7–15 Days)</h3>
        {renewAlerts.length === 0 ? (
          <p className="text-white/60">No upcoming renewals in this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 py-2">App Name</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Renewal Date</th>
                </tr>
              </thead>
              <tbody>
                {renewAlerts.map(sub => {
                  const start = new Date(sub.startDate);
                  const renewal = new Date(start);
                  renewal.setMonth(start.getMonth() + sub.validityMonths);
                  return (
                    <tr key={sub._id} className="border-b border-white/10 hover:bg-white/5 transition">
                      <td className="px-4 py-2">{sub.appName}</td>
                      <td className="px-4 py-2">₹{sub.amount}</td>
                      <td className="px-4 py-2">{renewal.toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="bg-glass p-6 rounded-3xl shadow border border-white/20 flex flex-col items-center">                 </div>
            <div className="bg-glass p-6 rounded-3xl shadow border border-white/20 flex flex-col items-center">                 </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
