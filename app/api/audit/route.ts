import { NextRequest, NextResponse } from "next/server";
import { runFullAudit } from "@/services/auditAgent";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Audit from "@/models/Audit";

export const POST = auth(async function POST(req: any) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        await dbConnect();

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayScanCount = await Audit.countDocuments({
            $or: [
                { userId: req.auth.user.id },
                { userId: { $exists: false } }
            ],
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        if (todayScanCount >= 5) {
            return NextResponse.json(
                { error: "Daily limit reached. You can only perform 5 audits per day." },
                { status: 429 }
            );
        }

        const audit = await runFullAudit(url, req.auth.user.id);

        return NextResponse.json(audit, { status: 201 });
    } catch (error: any) {
        console.error("API Error - /api/audit:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});
