import { NextRequest, NextResponse } from "next/server";
import { runFullAudit } from "@/services/auditAgent";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Audit from "@/models/Audit";

// Tell Netlify/Next.js this function may run up to 60 seconds.
// Without this, Netlify's default serverless timeout is 10s and
// will return a 504 for slow PSI + GPT-4o responses.
export const maxDuration = 60;

export const POST = auth(async function POST(req: any) {
    if (!req.auth || !req.auth.user?.id) {
        console.warn("API /api/audit unauthorized request", {
            time: new Date().toISOString(),
        });
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { url } = await req.json();

        console.log("API /api/audit received request", {
            rawUrl: url,
            userId: req.auth.user.id,
            time: new Date().toISOString(),
        });

        if (!url) {
            console.warn("API /api/audit missing URL payload", {
                userId: req.auth.user.id,
                time: new Date().toISOString(),
            });
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const preDb = Date.now();
        await dbConnect();
        console.log("API /api/audit dbConnect completed", {
            durationMs: Date.now() - preDb,
            time: new Date().toISOString(),
        });

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const preCount = Date.now();
        const todayScanCount = await Audit.countDocuments({
            $or: [
                { userId: req.auth.user.id },
                { userId: { $exists: false } }
            ],
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        console.log("API /api/audit daily count result", {
            todayScanCount,
            durationMs: Date.now() - preCount,
            time: new Date().toISOString(),
        });

        if (todayScanCount >= 5) {
            console.warn("API /api/audit daily limit hit", {
                userId: req.auth.user.id,
                todayScanCount,
                time: new Date().toISOString(),
            });
            return NextResponse.json(
                { error: "Daily limit reached. You can only perform 5 audits per day." },
                { status: 429 }
            );
        }

        const auditStart = Date.now();
        const audit = await runFullAudit(url, req.auth.user.id);
        console.log("API /api/audit runFullAudit completed", {
            durationMs: Date.now() - auditStart,
            url,
            userId: req.auth.user.id,
            auditId: audit?._id?.toString?.(),
            time: new Date().toISOString(),
        });

        return NextResponse.json(audit, { status: 201 });
    } catch (error: any) {
        console.error("API Error - /api/audit:", {
            time: new Date().toISOString(),
            message: error?.message,
            stack: error?.stack,
            name: error?.name,
        });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});
