"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/api/register", formData);
            toast.success("Registration successful! Please sign in.");
            router.push("/login");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 relative overflow-hidden py-20">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20"
                    >
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">Create Account</h1>
                    <p className="text-slate-400 font-medium">Initialize your Intelligence Matrix profile</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Full Identity</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                required
                                type="text"
                                placeholder="Agent name"
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Secure Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                required
                                type="email"
                                placeholder="name@company.com"
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Access Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Verify Lock</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 disabled:bg-slate-800 disabled:text-slate-500 border border-blue-400/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Provisioning...
                            </>
                        ) : (
                            <>
                                Initialize Agent
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        Already have an active protocol?{" "}
                        <Link href="/login" className="text-blue-500 hover:text-blue-400 font-bold ml-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
