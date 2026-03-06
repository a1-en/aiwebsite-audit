import mongoose, { Schema, Document } from "mongoose";

export interface IAudit extends Document {
    url: string;
    performanceScore: number;
    seoScore: number;
    accessibilityScore: number;
    bestPracticesScore: number;
    securityScore: number;

    // Scanned Details
    performanceDetails: {
        lcp: string;
        cls: string;
        loadTime: string;
        totalByteSize: number;
    };

    seoDetails: {
        title: string;
        metaDescription: string;
        h1Tags: string[];
        imageAltTags: { total: number; missing: number };
        hasSitemap: boolean;
        hasRobotsTxt: boolean;
    };

    securityIssues: Array<{
        header: string;
        status: "missing" | "ok" | "warning";
        description: string;
    }>;

    techStack: string[];

    // AI-powered report
    aiReport: string;

    createdAt: Date;
}

const AuditSchema: Schema = new Schema(
    {
        url: { type: String, required: true },
        performanceScore: { type: Number, default: 0 },
        seoScore: { type: Number, default: 0 },
        accessibilityScore: { type: Number, default: 0 },
        bestPracticesScore: { type: Number, default: 0 },
        securityScore: { type: Number, default: 0 },

        performanceDetails: {
            lcp: { type: String },
            cls: { type: String },
            loadTime: { type: String },
            totalByteSize: { type: Number },
        },

        seoDetails: {
            title: { type: String },
            metaDescription: { type: String },
            h1Tags: [{ type: String }],
            imageAltTags: {
                total: { type: Number },
                missing: { type: Number },
            },
            hasSitemap: { type: Boolean },
            hasRobotsTxt: { type: Boolean },
        },

        securityIssues: [
            {
                header: { type: String },
                status: { type: String, enum: ["missing", "ok", "warning"] },
                description: { type: String },
            },
        ],

        techStack: [{ type: String }],
        aiReport: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.Audit || mongoose.model<IAudit>("Audit", AuditSchema);
