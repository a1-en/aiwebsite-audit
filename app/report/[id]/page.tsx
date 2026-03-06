"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
    Zap,
    Shield,
    SearchCode,
    Accessibility,
    ArrowLeft,
    ExternalLink,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Cpu,
    BarChart3,
    Globe,
    Lock,
    Boxes,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ReportPage() {
    const { id } = useParams();
    const router = useRouter();

    const { data: audit, isLoading, error } = useQuery({
        queryKey: ["audit", id],
        queryFn: async () => {
            const response = await axios.get(`/api/audit/${id}`);
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
                <div className="relative w-24 h-24">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-b-2 border-blue-500 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border-t-2 border-purple-500 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu className="w-8 h-8 text-blue-500 animate-pulse" />
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Generating Insights</h2>
                    <p className="text-slate-500 animate-pulse">Our AI is analyzing the audit results...</p>
                </div>
            </div>
        );
    }

    if (error || !audit) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
                    <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Report Not Found</h2>
                <p className="text-slate-400">We couldn't retrieve the audit data for this URL.</p>
                <button
                    onClick={() => router.push("/")}
                    className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
                >
                    Return Home
                </button>
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-10 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 pb-12 border-b border-slate-800/50"
            >
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                            Live Audit
                        </div>
                        <span className="text-slate-600 text-xs">•</span>
                        <span className="text-slate-500 text-xs">{new Date(audit.createdAt).toLocaleString()}</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Audit Report</h1>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Globe className="w-4 h-4" />
                        <span className="truncate max-w-sm font-medium">{audit.url}</span>
                        <a href={audit.url} target="_blank" rel="noreferrer" className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
                            <ExternalLink className="w-4 h-4 text-blue-500" />
                        </a>
                    </div>
                </div>
                <div className="flex gap-4">
                    {/* Action buttons could go here */}
                </div>
            </motion.div>

            {/* Overview Scores Section */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
                <ScoreCard label="Performance" value={audit.performanceScore} icon={<Zap className="w-5 h-5" />} color="yellow" description="Core Web Vitals" />
                <ScoreCard label="SEO Optimization" value={audit.seoScore} icon={<SearchCode className="w-5 h-5" />} color="blue" description="Search Visibility" />
                <ScoreCard label="Accessibility" value={audit.accessibilityScore} icon={<Accessibility className="w-5 h-5" />} color="green" description="User Experience" />
                <ScoreCard label="Security Health" value={audit.securityScore} icon={<Lock className="w-5 h-5" />} color="red" description="Trust & Safety" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content: AI Report */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-8 space-y-8"
                >
                    <section className="bg-slate-900 shadow-2xl border border-slate-800 rounded-3xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                            <h2 className="text-xl font-semibold flex items-center gap-3 text-white">
                                <div className="p-2 bg-purple-500/10 rounded-xl">
                                    <Cpu className="w-5 h-5 text-purple-400" />
                                </div>
                                AI Intelligence Insights
                            </h2>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full">
                                Powerd by GPT-4o
                            </div>
                        </div>
                        <div className="p-8 lg:p-10">
                            <div className="markdown-content">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ node, ...props }) => {
                                            const text = String(props.children).replace(/^#\s*/, '');
                                            return <h1 className="text-3xl font-black text-white mt-10 mb-6 border-l-4 border-blue-500 pl-4">{text}</h1>
                                        },
                                        h2: ({ node, ...props }) => {
                                            const text = String(props.children).replace(/^##\s*/, '');
                                            return <h2 className="text-2xl font-bold text-slate-100 mt-8 mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">{text}</h2>
                                        },
                                        h3: ({ node, ...props }) => {
                                            const text = String(props.children).replace(/^###\s*/, '');
                                            return <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-3">{text}</h3>
                                        },
                                        p: ({ node, ...props }) => <p className="text-slate-400 mb-5 leading-relaxed text-base">{props.children}</p>,
                                        ul: ({ node, ...props }) => <ul className="mb-6 space-y-3 pl-2">{props.children}</ul>,
                                        li: ({ node, ...props }) => (
                                            <li className="flex gap-3 text-slate-300 items-start">
                                                <span className="text-blue-500 font-bold mt-0.5 shrink-0">→</span>
                                                <span>{props.children}</span>
                                            </li>
                                        ),
                                        strong: ({ node, ...props }) => <strong className="text-white font-bold">{props.children}</strong>,
                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-[3px] border-indigo-500 pl-6 py-3 my-8 italic text-slate-400 bg-indigo-500/5 rounded-r-2xl">{props.children}</blockquote>,
                                        a: ({ node, ...props }) => <a href={props.href} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 border-b border-dashed border-blue-500/50 hover:border-solid hover:border-blue-400 pb-0.5 transition-all">{props.children}</a>
                                    }}
                                >
                                    {audit.aiReport}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </section>

                    {/* Performance Details Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricBox label="LCP" value={audit.performanceDetails?.lcp} sub="Largest Contentful Paint" />
                        <MetricBox label="CLS" value={audit.performanceDetails?.cls} sub="Layout Stability" />
                        <MetricBox label="Speed Index" value={audit.performanceDetails?.loadTime} sub="Visual Completion" />
                        <MetricBox label="Total Weight" value={`${(audit.performanceDetails?.totalByteSize / 1024 / 1024).toFixed(2)} MB`} sub="Network Payload" />
                    </section>
                </motion.div>

                {/* Sidebar: Raw Details */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-4 space-y-8"
                >
                    {/* Tech Stack */}
                    <aside className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                        <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                            <Boxes className="w-5 h-5 text-blue-500" />
                            Detected Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {audit.techStack?.length > 0 ? (
                                audit.techStack.map((tech: string) => (
                                    <span key={tech} className="px-4 py-2 bg-slate-800 border border-slate-700/50 text-slate-300 rounded-xl text-xs font-semibold hover:border-blue-500/30 transition-colors">
                                        {tech}
                                    </span>
                                ))
                            ) : (
                                <div className="text-slate-600 text-sm italic py-4">Technology footprints hidden or unique stack.</div>
                            )}
                        </div>
                    </aside>

                    {/* Security Headers Breakdown */}
                    <aside className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                        <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-500" />
                            Security Check
                        </h3>
                        <div className="space-y-4">
                            {audit.securityIssues?.map((issue: any, idx: number) => (
                                <div key={idx} className="flex gap-4 p-3 rounded-2xl border border-transparent hover:bg-slate-800/30 hover:border-slate-800 transition-all group">
                                    {issue.status === "ok" ? (
                                        <div className="p-1.5 bg-green-500/10 rounded-lg shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        </div>
                                    ) : issue.status === "warning" ? (
                                        <div className="p-1.5 bg-yellow-500/10 rounded-lg shrink-0">
                                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                                        </div>
                                    ) : (
                                        <div className="p-1.5 bg-red-500/10 rounded-lg shrink-0">
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{issue.header}</h4>
                                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{issue.description.split('.')[0]}.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* SEO Details */}
                    <aside className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                        <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-emerald-500" />
                            Technical SEO
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Metadata Title</p>
                                <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-800 line-clamp-2 italic">{audit.seoDetails?.title || "No Title Defined"}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Description</p>
                                <p className="text-sm text-slate-400 leading-relaxed">{audit.seoDetails?.metaDescription || "Missing search description snippet."}</p>
                            </div>
                            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Sitemap</span>
                                    <div className={cn("text-xs font-bold flex items-center gap-1.5", audit.seoDetails?.hasSitemap ? "text-green-500" : "text-slate-600")}>
                                        {audit.seoDetails?.hasSitemap ? "Active" : "Not Found"}
                                        {audit.seoDetails?.hasSitemap && <CheckCircle2 className="w-3 h-3" />}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Robots.txt</span>
                                    <div className={cn("text-xs font-bold flex items-center gap-1.5", audit.seoDetails?.hasRobotsTxt ? "text-green-500" : "text-slate-600")}>
                                        {audit.seoDetails?.hasRobotsTxt ? "Active" : "Not Found"}
                                        {audit.seoDetails?.hasRobotsTxt && <CheckCircle2 className="w-3 h-3" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </motion.div>
            </div>

            <style jsx global>{`
        .markdown-content h1 { font-size: 1.75rem !important; font-weight: 800 !important; margin-top: 2.5rem !important; margin-bottom: 1.25rem !important; color: white !important; border-left: 4px solid #3b82f6 !important; padding-left: 1rem !important; }
        .markdown-content h2 { font-size: 1.5rem !important; font-weight: 700 !important; margin-top: 2rem !important; margin-bottom: 1rem !important; color: #f8fafc !important; display: flex !important; align-items: center !important; gap: 0.5rem !important; border-bottom: 1px solid #1e293b !important; padding-bottom: 0.5rem !important; }
        .markdown-content h3 { font-size: 1.2rem !important; font-weight: 600 !important; margin-top: 1.5rem !important; margin-bottom: 0.75rem !important; color: #93c5fd !important; }
        .markdown-content p { margin-bottom: 1.25rem !important; color: #94a3b8 !important; line-height: 1.8 !important; font-size: 1rem !important; }
        .markdown-content ul { margin-bottom: 1.5rem !important; list-style-type: none !important; padding-left: 0.5rem !important; }
        .markdown-content li { margin-bottom: 0.75rem !important; display: flex !important; gap: 0.75rem !important; align-items: start !important; color: #cbd5e1 !important; }
        .markdown-content li::before { content: "→" !important; color: #3b82f6 !important; font-weight: bold !important; flex-shrink: 0 !important; }
        .markdown-content strong { color: #f1f5f9 !important; font-weight: 700 !important; }
        .markdown-content code { background: #0f172a !important; padding: 0.2rem 0.4rem !important; border-radius: 0.4rem !important; color: #60a5fa !important; font-size: 0.9em !important; border: 1px solid #1e293b !important; }
        .markdown-content blockquote { border-left: 3px solid #6366f1 !important; padding-left: 1.5rem !important; margin: 2rem 0 !important; font-style: italic !important; color: #94a3b8 !important; background: rgba(99, 102, 241, 0.05) !important; padding-top: 1rem !important; padding-bottom: 1rem !important; border-radius: 0 1rem 1rem 0 !important; }
        .markdown-content a { color: #60a5fa !important; text-decoration: none !important; border-bottom: 1px dashed #3b82f6 !important; transition: all 0.2s !important; }
        .markdown-content a:hover { color: #93c5fd !important; border-bottom-style: solid !important; }
      `}</style>
        </div>
    );
}

function MetricBox({ label, value, sub }: { label: string, value: string | number, sub: string }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl group hover:border-slate-700 transition-colors">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors uppercase">{label}</p>
            <p className="text-xl font-bold text-white mb-1">{value || "N/A"}</p>
            <p className="text-[10px] text-slate-600 line-clamp-1">{sub}</p>
        </div>
    )
}

function ScoreCard({ label, value, icon, color, description }: { label: string; value: number; icon: React.ReactNode; color: string; description: string }) {
    const getVariants = (val: number) => {
        if (val >= 90) return { border: "border-green-500/20", bg: "bg-green-500/5", text: "text-green-500", progress: "bg-green-500" };
        if (val >= 50) return { border: "border-yellow-500/20", bg: "bg-yellow-500/5", text: "text-yellow-500", progress: "bg-yellow-500" };
        return { border: "border-red-500/20", bg: "bg-red-500/5", text: "text-red-500", progress: "bg-red-500" };
    };

    const variants = getVariants(value);

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, scale: 0.95 },
                show: { opacity: 1, scale: 1 }
            }}
            whileHover={{ y: -5 }}
            className={cn("p-6 rounded-[2rem] border shadow-lg backdrop-blur-sm transition-all duration-500", variants.border, variants.bg)}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={cn("p-2.5 rounded-xl bg-slate-900 shadow-inner", variants.text)}>
                    {icon}
                </div>
                <div className="flex flex-col items-end">
                    <span className={cn("text-4xl font-black tracking-tighter", variants.text)}>{value}</span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Score</span>
                </div>
            </div>
            <div>
                <p className="text-sm font-bold text-white mb-0.5">{label}</p>
                <p className="text-[10px] text-slate-500 font-medium mb-4">{description}</p>
            </div>
            <div className="w-full h-1.5 bg-slate-800/50 rounded-full overflow-hidden flex shadow-inner">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className={cn("h-full", variants.progress)}
                />
            </div>
        </motion.div>
    );
}
