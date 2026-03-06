import { NextRequest, NextResponse } from "next/server";
import { runFullAudit } from "@/services/auditAgent";

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const audit = await runFullAudit(url);

        return NextResponse.json(audit, { status: 201 });
    } catch (error: any) {
        console.error("API Error - /api/audit:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
