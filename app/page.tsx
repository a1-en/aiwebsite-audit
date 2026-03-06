"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  Shield,
  SearchCode,
  Accessibility,
  ArrowRight,
  History,
  LayoutDashboard,
  Cpu,
  Globe,
  Microscope
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="relative isolate">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-blue-600/10 via-slate-950 to-slate-950 -z-10" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 sm:pt-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-8 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full w-fit"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400">Next-Gen Intelligence v2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tighter text-white sm:text-8xl mb-8 leading-[0.9]"
          >
            Surface The <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Invisible</span> Truth.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 leading-relaxed font-medium mb-12 max-w-xl"
          >
            AuditAgent deployment. Instantly analyze performance bottlenecks, security flaws, and SEO gaps with our advanced AI-driven matrix.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link
              href="/login"
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
            >
              Initialize System
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-10 py-5 bg-slate-900 border border-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-slate-800"
            >
              Feature Protocol
            </Link>
          </motion.div>
        </div>

        {/* Visual Representation */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-16 lg:mt-0 lg:flex-shrink-0 lg:flex-grow relative"
        >
          <div className="relative w-full aspect-square max-w-xl mx-auto">
            <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent h-1/2 z-10" />

            <div className="relative aspect-square border border-white/5 bg-slate-900/40 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl p-10 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
                <FloatingFeature
                  icon={<Zap className="w-8 h-8 text-yellow-400" />}
                  label="Speed"
                  value="99/100"
                  delay={0}
                />
                <FloatingFeature
                  icon={<Shield className="w-8 h-8 text-blue-400" />}
                  label="Security"
                  value="A+"
                  delay={0.1}
                />
                <FloatingFeature
                  icon={<SearchCode className="w-8 h-8 text-emerald-400" />}
                  label="SEO"
                  value="95%"
                  delay={0.2}
                />
                <FloatingFeature
                  icon={<Accessibility className="w-8 h-8 text-purple-400" />}
                  label="Standard"
                  value="Passed"
                  delay={0.3}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-32 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center max-w-2xl mx-auto">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-4 italic">Capabilities Overview</h2>
            <h3 className="text-4xl font-black text-white tracking-tight mb-6">Comprehensive Intelligence In One Dashboard</h3>
            <p className="text-slate-500 font-medium">Deploy our specialized agents across 4 critical domains of website excellence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Zap />}
              title="Performance"
              desc="Real-time analysis of load times, TTFB, and visual stability scores."
            />
            <FeatureCard
              icon={<SearchCode />}
              title="SEO Insights"
              desc="Deep scan of meta structures, link health, and crawlability metrics."
            />
            <FeatureCard
              icon={<Shield />}
              title="Security Protocol"
              desc="Active monitoring for SSL health, header vulnerabilities, and leaks."
            />
            <FeatureCard
              icon={<Cpu />}
              title="Tech Detection"
              desc="AI-powered identification of full tech stacks and framework versions."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            className="p-16 bg-gradient-to-b from-blue-700 to-indigo-900 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
            <h4 className="text-4xl font-black text-white tracking-tighter mb-8">Ready to audit your future?</h4>
            <Link
              href="/login"
              className="px-12 py-5 bg-white text-slate-950 font-black rounded-2xl inline-flex items-center gap-4 transition-all hover:scale-105 hover:bg-slate-100 shadow-xl"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FloatingFeature({ icon, label, value, delay }: { icon: React.ReactNode; label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 + delay, duration: 0.8 }}
      className="p-6 bg-slate-800/50 border border-white/5 rounded-3xl backdrop-blur-md"
    >
      <div className="mb-4">{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500/30 transition-all group">
      <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h5 className="text-xl font-black text-white tracking-tight mb-4">{title}</h5>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
