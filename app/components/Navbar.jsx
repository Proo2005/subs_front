"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Subscriptions", href: "/subscription" },
    { name: "Analysis", href: "/analysis" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 
                    w-[95%] md:w-[90%] lg:w-[80%] xl:w-[70%] z-50 
                    flex items-center justify-between px-6 md:px-8 py-4 
                    bg-black/30 backdrop-blur-xl border border-white/10 
                    rounded-3xl shadow-2xl transition-all">

      {/* LOGO */}
      <Link href="/" className="text-2xl font-bold text-neon">
        SubTrack
      </Link>

      {/* DESKTOP LINKS */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-white hover:text-neon transition-colors"
          >
            {link.name}
          </Link>
        ))}

        {/* PROFILE */}
        {!user ? (
          <div className="flex gap-4">
            <Link href="/login" className="text-white hover:text-neon transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-neon px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Signup
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-2 text-white hover:text-neon transition-colors"
            >
              <span className="font-medium">{user.name}</span>
              <span className="text-sm">▾</span>
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-3 w-44 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl shadow-lg overflow-hidden">
                <Link
                  href="/profile"
                  className="block px-4 py-3 hover:bg-white/5 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MOBILE HAMBURGER */}
      <div className="md:hidden flex items-center gap-4">
        <button onClick={() => setOpenMobile(!openMobile)} className="text-white text-2xl">
          {openMobile ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {openMobile && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-[90%] bg-black/80 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl flex flex-col gap-4 p-6 md:hidden z-40 animate-slideDown">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white text-lg hover:text-neon transition-colors"
              onClick={() => setOpenMobile(false)}
            >
              {link.name}
            </Link>
          ))}

          {!user ? (
            <div className="flex flex-col gap-3 mt-3">
              <Link
                href="/login"
                className="text-white text-lg hover:text-neon transition-colors"
                onClick={() => setOpenMobile(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-neon px-4 py-2 rounded-lg font-semibold text-center hover:opacity-90 transition-all"
                onClick={() => setOpenMobile(false)}
              >
                Signup
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-3">
              <Link
                href="/profile"
                className="text-white hover:text-neon transition-colors"
                onClick={() => setOpenMobile(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => { handleLogout(); setOpenMobile(false); }}
                className="text-red-400 hover:text-red-500 transition-colors text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
