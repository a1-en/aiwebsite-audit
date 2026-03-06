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
    ShieldCheck,
    Menu,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <AnimatePresence mode="wait">
                        {status === "authenticated" ? (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center gap-4"
                            >


                                <div className="w-px h-8 bg-slate-800 hidden sm:block mx-1" />

                                <div className="flex items-center gap-2">
                                    <div className="group/user relative">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 p-0.5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all shadow-sm group-hover/user:shadow-blue-500/20">
                                            {session.user?.image ? (
                                                <img src={session.user.image} alt="User" className="w-full h-full rounded-lg object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-slate-500 group-hover/user:text-blue-400 transition-colors" />
                                            )}
                                        </div>
                                        <div className="absolute top-[calc(100%+0.5rem)] right-0 w-56 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-4 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 translate-y-2 group-hover/user:translate-y-0 z-[100]">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                                    <User className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-white font-bold text-sm truncate leading-tight">{session.user?.name}</span>
                                                    <span className="text-slate-400 text-[11px] truncate">{session.user?.email}</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-px bg-slate-800/50 my-2" />
                                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-500">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                System Access Granted
                                            </div>
                                        </div>
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

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-full left-0 w-full bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex flex-col gap-2 shadow-2xl"
                    >
                        <MobileNavLink href="/" active={pathname === "/"} onClick={() => setMobileMenuOpen(false)}>Mission</MobileNavLink>
                        {session && (
                            <>
                                <MobileNavLink href="/scanner" active={pathname === "/scanner"} onClick={() => setMobileMenuOpen(false)}>Audit Scanner</MobileNavLink>
                                <MobileNavLink href="/dashboard" active={pathname === "/dashboard"} onClick={() => setMobileMenuOpen(false)}>Audit History</MobileNavLink>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

function MobileNavLink({ href, active, children, onClick }: { href: string; active: boolean; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                active ? "bg-blue-600/10 text-blue-500 border border-blue-500/20" : "text-slate-400 hover:bg-slate-900 hover:text-white"
            )}
        >
            {children}
        </Link>
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
