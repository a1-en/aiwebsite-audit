import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Audit from "@/models/Audit";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    let resolvedParams;
    try {
        resolvedParams = await params;
        const { id } = resolvedParams;
        await dbConnect();

        const audit = await Audit.findById(id);

        if (!audit) {
            return NextResponse.json({ error: "Audit not found" }, { status: 404 });
        }

        return NextResponse.json(audit, { status: 200 });
    } catch (error: any) {
        console.error(`API Error - /api/audit/${resolvedParams?.id}:`, error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
