"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Loader2, Zap, Shield, SearchCode, Accessibility } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ScannerPage() {
    const [url, setUrl] = useState("");
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (targetUrl: string) => {
            const response = await axios.post("/api/audit", { url: targetUrl });
            return response.data;
        },
        onMutate: () => {
            toast.loading("Analyzing website performance and SEO...", { id: "audit-toast" });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["history"] });
            toast.success("Audit completed successfully!", { id: "audit-toast" });
            router.push(`/report/${data._id}`);
        },
        onError: (error: any) => {
            const message = error.response?.data?.error || "Audit failed. The URL might be unreachable or restricted.";
            toast.error(message, { id: "audit-toast" });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url) {
            mutation.mutate(url);
        }
    };

    return (
        <div className="relative isolate px-6 pt-2 lg:px-8 overflow-hidden min-h-[calc(100vh-64px)]">
            {/* Background decoration */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [30, 35, 30],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#9333ea] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>

            <div className="mx-auto max-w-4xl py-12 sm:py-20 lg:py-24">
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold tracking-tight text-white sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400"
                    >
                        AI-Powered <br /> Website Audits
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mt-8 text-lg leading-8 text-slate-400 max-w-2xl mx-auto"
                    >
                        Instantly surface performance bottlenecks, SEO gaps, security vulnerabilities, and accessibility issues with our intelligent audit agent.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-12 flex items-center justify-center gap-x-6"
                    >
                        <form onSubmit={handleSubmit} className="w-full max-w-xl">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Paste your URL (e.g., https://example.com)"
                                    className={cn(
                                        "w-full bg-slate-900 border border-slate-700/50 rounded-2xl py-6 px-7 pl-16 pr-32 sm:pr-40 text-white text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]",
                                        mutation.isPending && "opacity-50 cursor-not-allowed"
                                    )}
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={mutation.isPending}
                                />
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-7 h-7 group-focus-within:text-blue-500 transition-colors" />
                                <button
                                    type="submit"
                                    disabled={mutation.isPending || !url}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed shadow-lg active:scale-95"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        "Audit Now"
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    <AnimatePresence>
                        {mutation.isError && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 text-red-400 text-sm font-medium"
                            >
                                {(mutation.error as any).response?.data?.error || "Audit failed. Please ensure the URL is correct and public."}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="mt-24 grid grid-cols-2 gap-8 sm:grid-cols-4"
                    >
                        <Feature icon={<Zap className="w-6 h-6" />} label="Performance" delay={0.5} />
                        <Feature icon={<SearchCode className="w-6 h-6" />} label="SEO Scan" delay={0.6} />
                        <Feature icon={<Accessibility className="w-6 h-6" />} label="Web Standards" delay={0.7} />
                        <Feature icon={<Shield className="w-6 h-6" />} label="Security" delay={0.8} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function Feature({ icon, label, delay }: { icon: React.ReactNode; label: string; delay: number }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="flex flex-col items-center gap-3 text-slate-500 hover:text-white transition-colors cursor-default"
        >
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl group shadow-inner">
                <div className="group-hover:text-blue-500 transition-colors">
                    {icon}
                </div>
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase">{label}</span>
        </motion.div>
    );
}
