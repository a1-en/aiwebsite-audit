import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Audit from "@/models/Audit";
import { auth } from "@/auth";

export const GET = auth(async function GET(req: any) {
    if (!req.auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();

        // Sort by most recent first
        const audits = await Audit.find({}).sort({ createdAt: -1 }).limit(20);

        return NextResponse.json(audits, { status: 200 });
    } catch (error: any) {
        console.error("API Error - /api/history:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});
