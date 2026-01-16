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
  <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full px-4">
    {/* INNER CONTAINER (controls width) */}
    <div
      className="
        max-w-5xl mx-auto
        flex items-center justify-between
        px-6 py-3
        bg-black/40 backdrop-blur-xl
        border border-white/10
        rounded-2xl shadow-2xl
        transition-all
      "
    >
      {/* LOGO */}
      <Link href="/" className="text-xl font-bold text-neon">
        SubTrack
      </Link>

      {/* DESKTOP DROPDOWN */}
      <div className="hidden md:block relative">
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="
            flex items-center gap-2
            px-4 py-2
            rounded-xl
            bg-black/50 backdrop-blur-md
            border border-white/20
            text-white hover:text-neon
            transition
          "
        >
          <span className="font-medium">
            {user ? user.name : "Menu"}
          </span>
          <span className="text-sm">▾</span>
        </button>

        {openProfile && (
          <div
            className="
              absolute right-0 mt-3 w-52
              bg-black/80 backdrop-blur-xl
              border border-white/10
              rounded-2xl shadow-2xl
              overflow-hidden
            "
          >
            {/* NAV LINKS */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpenProfile(false)}
                className="
                  block px-5 py-3
                  text-white
                  hover:bg-white/5 hover:text-neon
                  transition
                "
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-white/10" />

            {/* AUTH / PROFILE */}
            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpenProfile(false)}
                  className="block px-5 py-3 text-white hover:bg-white/5 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpenProfile(false)}
                  className="block px-5 py-3 text-neon font-semibold hover:bg-white/5 transition"
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  onClick={() => setOpenProfile(false)}
                  className="block px-5 py-3 text-white hover:bg-white/5 transition"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpenProfile(false);
                  }}
                  className="w-full text-left px-5 py-3 text-red-400 hover:bg-white/5 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* MOBILE HAMBURGER */}
      <div className="md:hidden">
        <button
          onClick={() => setOpenMobile(!openMobile)}
          className="text-white text-2xl"
        >
          {openMobile ? <HiX /> : <HiMenu />}
        </button>
      </div>
    </div>

    {/* MOBILE MENU */}
    {openMobile && (
      <div
        className="
          md:hidden
          absolute top-full left-1/2 -translate-x-1/2 mt-4
          w-[90%]
          bg-black/80 backdrop-blur-lg
          border border-white/10
          rounded-2xl shadow-xl
          p-6 z-40
          animate-slideDown
        "
      >
        {/* NAV LINKS */}
        <div className="flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white text-lg hover:text-neon transition"
              onClick={() => setOpenMobile(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <hr className="border-white/20 my-4" />

        {/* AUTH / PROFILE */}
        {!user ? (
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="text-center border border-white/20 py-2 rounded-lg text-white hover:text-neon transition"
              onClick={() => setOpenMobile(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-center bg-neon py-2 rounded-lg font-semibold hover:brightness-110 transition"
              onClick={() => setOpenMobile(false)}
            >
              Signup
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Link
              href="/profile"
              className="text-center border border-white/20 py-2 rounded-lg text-white hover:text-neon transition"
              onClick={() => setOpenMobile(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setOpenMobile(false);
              }}
              className="text-center bg-red-500 py-2 rounded-lg text-white hover:brightness-110 transition"
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