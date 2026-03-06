"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Zap, Microscope, ScanText, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-[100] w-full bg-[#020617]/70 backdrop-blur-xl border-b border-white/5 py-4">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-4 group">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        className="p-2.5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[1.2rem] shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)]"
                    >
                        <Microscope className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-white tracking-widest uppercase">Audit<span className="text-blue-500">Agent</span></span>
                        <span className="text-[9px] font-bold text-slate-500 tracking-[0.3em] uppercase -mt-1 ml-0.5">Intelligence Matrix</span>
                    </div>
                </Link>

                <div className="hidden md:flex items-center p-1.5 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-3xl shadow-2xl">
                    <NavLink href="/" active={pathname === "/"} icon={<ScanText className="w-4 h-4" />}>Audit Scanner</NavLink>
                    <NavLink href="/dashboard" active={pathname === "/dashboard"} icon={<History className="w-4 h-4" />}>Audit History</NavLink>
                </div>

                <div className="flex items-center gap-4 items-center">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            System Active
                        </span>
                        <span className="text-[9px] font-medium text-slate-600 uppercase tracking-widest mt-1">Node: West-US-1</span>
                    </div>

                    <div className="w-px h-8 bg-slate-800 hidden sm:block mx-2" />

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <Zap className="w-5 h-5" />
                    </motion.div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, active, children, icon }: { href: string; active: boolean; children: React.ReactNode; icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={cn(
                "relative flex items-center gap-3 px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-xl overflow-hidden group",
                active ? "text-white bg-blue-600/10" : "text-slate-500 hover:text-slate-200"
            )}
        >
            {active && (
                <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-blue-600/10 border-b-2 border-blue-500 -z-10"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            <div className={cn("transition-transform group-hover:scale-110", active ? "text-blue-500" : "text-slate-600")}>
                {icon}
            </div>
            {children}
        </Link>
    );
}
