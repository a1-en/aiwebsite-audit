"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    Zap,
    SearchCode,
    Accessibility,
    Shield,
    History,
    ExternalLink,
    ChevronRight,
    TrendingUp,
    LayoutDashboard,
    Calendar,
    Globe,
    Timer,
    Cpu,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
    const router = useRouter();

    const { data: audits, isLoading, error } = useQuery({
        queryKey: ["history"],
        queryFn: async () => {
            const response = await axios.get("/api/history");
            return response.data;
        },
    });

    const avgPerformance = audits?.length > 0
        ? Math.round(audits.reduce((acc: number, cur: any) => acc + cur.performanceScore, 0) / audits.length)
        : 0;

    const avgSeo = audits?.length > 0
        ? Math.round(audits.reduce((acc: number, cur: any) => acc + cur.seoScore, 0) / audits.length)
        : 0;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-5"
                >
                    <div className="p-4 bg-blue-600 rounded-[2rem] shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)]">
                        <LayoutDashboard className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Intelligence Hub</h1>
                        <p className="text-slate-500 font-medium">Your centralized audit and performance repository</p>
                    </div>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/")}
                    className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-2xl text-sm transition-all shadow-2xl flex items-center gap-3 shrink-0"
                >
                    <Plus className="w-5 h-5" />
                    Analyze New Site
                </motion.button>
            </div>

            {/* Stats Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
            >
                <StatCard label="Total Reports" value={audits?.length || 0} sub="Lifetime Scans" icon={<History className="w-6 h-6 text-blue-400" />} />
                <StatCard label="Avg Performance" value={avgPerformance} sub="Global Average" icon={<Zap className="w-6 h-6 text-yellow-400" />} color="yellow" />
                <StatCard label="Avg SEO Health" value={avgSeo} sub="Search Optimized" icon={<SearchCode className="w-6 h-6 text-emerald-400" />} color="emerald" />
                <StatCard label="Security Focus" value={audits?.length > 0 ? "Enabled" : "Waiting"} sub="Proactive Monitor" icon={<Shield className="w-6 h-6 text-red-400" />} />
            </motion.div>

            {/* History Table Implementation */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] shadow-[-20px_20px_60px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                <div className="px-10 py-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-xl">
                            <Timer className="w-5 h-5 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Recent Scans</h2>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        Real-time Activity
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-10 py-6">Website Entity</th>
                                <th className="px-10 py-6 text-center">Score Matrix</th>
                                <th className="px-10 py-6">Intelligence</th>
                                <th className="px-10 py-6">Timestamp</th>
                                <th className="px-10 py-6 text-right">Review</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            <AnimatePresence>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-10 py-8"><div className="h-4 bg-slate-800 rounded w-48 mb-2"></div><div className="h-3 bg-slate-800/50 rounded w-32"></div></td>
                                            <td className="px-10 py-8"><div className="flex gap-2 justify-center"><div className="h-10 w-10 bg-slate-800 rounded-xl"></div><div className="h-10 w-10 bg-slate-800 rounded-xl"></div></div></td>
                                            <td className="px-10 py-8"><div className="h-4 bg-slate-800 rounded w-24"></div></td>
                                            <td className="px-10 py-8"><div className="h-4 bg-slate-800 rounded w-20"></div></td>
                                            <td className="px-10 py-8 text-right"><div className="h-10 w-10 bg-slate-800 rounded-xl ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : audits?.length > 0 ? (
                                    audits.map((audit: any, idx: number) => (
                                        <motion.tr
                                            key={audit._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="hover:bg-blue-600/5 transition-all duration-300 group cursor-default border-transparent hover:border-blue-500/10"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3 text-white font-bold group-hover:text-blue-400 transition-colors">
                                                    <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-500 text-sm overflow-hidden border border-slate-700/50 group-hover:border-blue-500/30">
                                                        {new URL(audit.url).hostname.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="truncate max-w-[220px] tracking-tight">{new URL(audit.url).hostname}</span>
                                                        <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-500">
                                                            <Globe className="w-3 h-3" />
                                                            <span className="text-[10px] font-medium truncate max-w-[180px] tracking-wide">{audit.url}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center justify-center gap-2">
                                                    <CircleScore score={audit.performanceScore} />
                                                    <CircleScore score={audit.seoScore} />
                                                    <CircleScore score={audit.securityScore} />
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                    {audit.techStack?.slice(0, 2).map((tech: string) => (
                                                        <span key={tech} className="px-3 py-1 bg-slate-800/80 text-slate-400 text-[10px] font-bold rounded-lg border border-slate-700 group-hover:border-blue-500/20 group-hover:text-slate-300 transition-all uppercase tracking-tighter">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {audit.techStack?.length > 2 && (
                                                        <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                            +{audit.techStack.length - 2}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="text-[11px] font-bold tracking-tight uppercase">{new Date(audit.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button
                                                    onClick={() => router.push(`/report/${audit._id}`)}
                                                    className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-800 text-slate-600 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/10 transition-all shadow-sm active:scale-95 group/btn"
                                                >
                                                    <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr className="hover:bg-transparent">
                                        <td colSpan={5} className="px-10 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 bg-slate-800 rounded-full opacity-20">
                                                    <History className="w-12 h-12 text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 font-bold tracking-tight text-xl italic drop-shadow-sm">No Intelligence Gathered Yet</p>
                                                <button onClick={() => router.push("/")} className="text-blue-500 font-black uppercase text-xs tracking-widest hover:underline mt-2">Start First Audit</button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}

function StatCard({ label, value, sub, icon, color = "blue" }: { label: string; value: string | number; sub: string; icon: React.ReactNode; color?: string }) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="p-8 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="w-16 h-16 text-white" />
            </div>
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform duration-500">{icon}</div>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white tracking-widest leading-none drop-shadow-lg">{value}</p>
                    {typeof value === "number" && <span className="text-slate-700 font-black text-sm">%</span>}
                </div>
                <p className="text-[11px] font-bold text-slate-600 mt-3 flex items-center gap-1.5 uppercase tracking-tight">
                    <Cpu className="w-3 h-3" />
                    {sub}
                </p>
            </div>
        </motion.div>
    );
}

function CircleScore({ score }: { score: number }) {
    const getColors = (s: number) => {
        if (s >= 90) return "text-green-500 border-green-500/40 bg-green-500/5 shadow-[0_0_15px_-5px_rgba(34,197,94,0.3)]";
        if (s >= 50) return "text-yellow-500 border-yellow-500/40 bg-yellow-500/5 shadow-[0_0_15px_-5px_rgba(234,179,8,0.3)]";
        return "text-red-500 border-red-500/40 bg-red-500/5 shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]";
    };

    return (
        <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center text-[11px] font-black transition-all", getColors(score))}>
            {score}
        </div>
    );
}
