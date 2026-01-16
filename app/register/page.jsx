"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
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
        "https://subs-back.onrender.com/api/auth/register",
        form
      );

      // Save JWT
      localStorage.setItem("token", res.data.token);

      // Redirect to login
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
            <h2 className="text-4xl font-bold text-neon mb-2">Create Account</h2>
            <p className="text-white/70 text-sm">
              Sign up to start managing your subscriptions efficiently.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center text-sm font-medium">{error}</p>
          )}

          {/* Name Input */}
          <div className="relative">
            <FiUser className="absolute top-3 left-3 text-white/70" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-neon outline-none transition"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <FiMail className="absolute top-3 left-3 text-white/70" />
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
            {loading ? "Creating account..." : "Register"}
          </button>


          {/* Login Link */}
          <p className="text-white/70 text-center text-sm mt-2">
            Already have an account?{" "}
            <a href="/login" className="text-neon font-medium hover:underline">
              Login
            </a>
          </p>

          {/* Footer */}
          <p className="text-white/50 text-xs text-center mt-4">
            Your information is safe & secure.
          </p>
        </form>
      </div>
      
    </div>
  );
}
