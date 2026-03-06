"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Zap,
    Microscope,
    ScanText,
    History,
    LogOut,
    User,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

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
                    <NavLink href="/" active={pathname === "/"} icon={<Zap className="w-4 h-4" />}>Mission</NavLink>
                    {session && (
                        <>
                            <NavLink href="/scanner" active={pathname === "/scanner"} icon={<ScanText className="w-4 h-4" />}>Audit Scanner</NavLink>
                            <NavLink href="/dashboard" active={pathname === "/dashboard"} icon={<History className="w-4 h-4" />}>Audit History</NavLink>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <AnimatePresence mode="wait">
                        {status === "authenticated" ? (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center gap-4"
                            >
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                        Agent Online
                                    </span>
                                    <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest mt-1 truncate max-w-[100px]">
                                        {session.user?.name}
                                    </span>
                                </div>

                                <div className="w-px h-8 bg-slate-800 hidden sm:block mx-1" />

                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 p-0.5 flex items-center justify-center overflow-hidden">
                                        {session.user?.image ? (
                                            <img src={session.user.image} alt="User" className="w-full h-full rounded-lg object-cover" />
                                        ) : (
                                            <User className="w-5 h-5 text-slate-500" />
                                        )}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="w-10 h-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95"
                                        title="System Sign-Out"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : status === "unauthenticated" ? (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                            >
                                <Link
                                    href="/login"
                                    className="px-6 py-2.5 bg-white text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 shadow-2xl"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    Sign In
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 animate-pulse" />
                        )}
                    </AnimatePresence>
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
                active ? "text-white" : "text-slate-500 hover:text-slate-200"
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
