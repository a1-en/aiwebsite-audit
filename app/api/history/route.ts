import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Audit from "@/models/Audit";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Sort by most recent first
        const audits = await Audit.find({}).sort({ createdAt: -1 }).limit(20);

        return NextResponse.json(audits, { status: 200 });
    } catch (error: any) {
        console.error("API Error - /api/history:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
