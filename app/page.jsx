"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-28 px-6 lg:px-16">
      
      
       <Navbar/>
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h2 className="text-5xl font-extrabold leading-tight max-w-3xl">
          Take Control of Your
          <span className="text-neon"> Subscriptions</span>
        </h2>

        <p className="mt-6 text-white/70 max-w-2xl text-lg">
          Track all your subscriptions in one place.  
          Get renewal reminders, analyze spending, and stop paying for
          services you don’t use.
        </p>

        <div className="mt-10 flex gap-6">
          <Link
            href="/register"
            className="bg-neon px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90"
          >
            Start Free
          </Link>

          <Link
            href="/login"
            className="border border-white/20 px-8 py-3 rounded-lg text-lg hover:bg-white/5"
          >
            Login
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-10 py-20 bg-black rounded-4xl ">
        <h3 className="text-3xl font-bold text-center mb-14  ">
          Everything You Need
        </h3>

        <div className="grid md:grid-cols-3 gap-10 ">
          <FeatureCard
            title="Subscription Tracking"
            description="Keep all your Netflix, Spotify, SaaS, and app subscriptions organized in one dashboard."
          />

          <FeatureCard
            title="Renewal Reminders"
            description="Never get charged unexpectedly. Receive alerts before your subscriptions renew."
          />

          <FeatureCard
            title="Spending Analytics"
            description="Visualize your monthly and yearly spending with clean charts and insights."
          />

          <FeatureCard
            title="Smart Cancellation"
            description="Identify unused subscriptions and get suggestions to save money."
          />

          <FeatureCard
            title="Secure & Private"
            description="JWT authentication and encrypted passwords keep your data safe."
          />

          <FeatureCard
            title="Modern Dashboard"
            description="Minimal, fast, and responsive UI built with modern web technologies."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-10 py-20 border-t border-white/10">
        <h3 className="text-3xl font-bold text-center mb-14">
          How It Works
        </h3>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          <Step number="1" text="Create an account in seconds" />
          <Step number="2" text="Add your subscriptions" />
          <Step number="3" text="Track, analyze, and save money" />
        </div>
      </section>

      {/* CTA */}
      <section className="px-10 py-24 text-center bg-gradient-to-t from-black to-[#0a0a0a]">
        <h3 className="text-4xl font-bold mb-6">
          Start Managing Smarter Today
        </h3>
        <p className="text-white/70 mb-10">
          Stop losing money on forgotten subscriptions.
        </p>

        <Link
          href="/register"
          className="bg-neon px-10 py-4 rounded-xl text-lg font-semibold hover:opacity-90"
        >
          Create Free Account
        </Link>
      </section>

      {/* FOOTER */}
      <Footer/>
    </div>
  );
}

/* Components */

function FeatureCard({ title, description }) {
  return (
    <div className="bg-glass backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-neon transition">
      <h4 className="text-xl font-semibold mb-3">{title}</h4>
      <p className="text-white/70">{description}</p>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="bg-glass p-8 rounded-2xl border border-white/10">
      <div className="text-neon text-4xl font-bold mb-4">
        {number}
      </div>
      <p className="text-white/80">{text}</p>
    </div>
  );
}
