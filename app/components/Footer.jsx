"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2
                       w-[95%] md:w-[90%] lg:w-[80%] xl:w-[70%] z-50
                       bg-black/30 backdrop-blur-xl border border-white/10
                       rounded-3xl shadow-2xl p-6 flex flex-col md:flex-row
                       items-center justify-between gap-4">
      
      {/* Left Section: Logo & Copyright */}
      <div className="flex flex-col md:flex-row items-center gap-2">
        <h1 className="text-neon text-xl font-bold">SubTrack</h1>
        <p className="text-white/60 text-sm">
          &copy; {new Date().getFullYear()} SubTrack. All rights reserved.
        </p>
      </div>

      {/* Center Section: Quick Links */}
      <div className="flex gap-6 text-white/70 text-sm font-medium">
        <a href="/" className="hover:text-neon transition-colors">Home</a>
        <a href="/subscription" className="hover:text-neon transition-colors">Subscriptions</a>
        <a href="/analysis" className="hover:text-neon transition-colors">About-us</a>
        <a href="/profile" className="hover:text-neon transition-colors">Contact-us</a>
      </div>

      {/* Right Section: Social Icons */}
      <div className="flex gap-4 text-white/70">
        <a href="#" className="hover:text-neon transition-colors"><FaFacebookF /></a>
        <a href="#" className="hover:text-neon transition-colors"><FaTwitter /></a>
        <a href="#" className="hover:text-neon transition-colors"><FaInstagram /></a>
        <a href="#" className="hover:text-neon transition-colors"><FaLinkedinIn /></a>
      </div>

    </footer>
  );
}
