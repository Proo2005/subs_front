"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiUser, FiLock } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      const userData = res.data.user;

      // Store user info including createdAt
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: userData.name,
          email: userData.email,
          createdAt: userData.createdAt,
        })
      );

      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <Navbar />
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-black/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col gap-6"
        >
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-neon mb-2">Welcome Back</h2>
            <p className="text-white/70 text-sm">
              Log in to manage your subscriptions and track your spending.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center text-sm font-medium">{error}</p>
          )}

          {/* Email Input */}
          <div className="relative">
            <FiUser className="absolute top-3 left-3 text-white/70" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-neon outline-none transition"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <FiLock className="absolute top-3 left-3 text-white/70" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-neon outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="mx-auto w-3/4 bg-white text-black py-3 rounded-xl font-semibold hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Signup Link */}
          <p className="text-white/70 text-center text-sm mt-2">
            Don't have an account?{" "}
            <a href="/register" className="text-neon font-medium hover:underline">
              Signup
            </a>
          </p>

          {/* Optional Footer */}
          <p className="text-white/50 text-xs text-center mt-4">
            Your credentials are safe & private.
          </p>
        </form>
      </div>
      <Footer/>
    </div>
  );
}
