import axios from "axios";

interface SecurityIssue {
    header: string;
    status: "missing" | "ok" | "warning";
    description: string;
}

export async function scanSecurity(url: string, preFetchedHeaders?: any) {
    try {
        let headers = preFetchedHeaders;

        if (!headers) {
            const response = await axios.head(url, {
                timeout: 5000,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
            });
            headers = response.headers;
        }
        const issues: SecurityIssue[] = [];
        let score = 100;

        const checks = [
            {
                header: "content-security-policy",
                name: "Content-Security-Policy",
                description: "Helps prevent cross-site scripting (XSS) and other code injection attacks.",
                deduction: 25,
            },
            {
                header: "strict-transport-security",
                name: "Strict-Transport-Security",
                description: "Forces HTTPS connections, preventing man-in-the-middle attacks.",
                deduction: 20,
            },
            {
                header: "x-frame-options",
                name: "X-Frame-Options",
                description: "Protects against clickjacking attacks.",
                deduction: 15,
            },
            {
                header: "x-content-type-options",
                name: "X-Content-Type-Options",
                description: "Prevents browsers from MIME-sniffing the response away from the declared content-type.",
                deduction: 10,
            },
            {
                header: "referrer-policy",
                name: "Referrer-Policy",
                description: "Controls how much referrer information is passed on for each request.",
                deduction: 10,
            },
        ];

        for (const check of checks) {
            if (!headers[check.header]) {
                issues.push({
                    header: check.name,
                    status: "missing",
                    description: `The ${check.name} header is missing. ${check.description}`,
                });
                score -= check.deduction;
            } else {
                issues.push({
                    header: check.name,
                    status: "ok",
                    description: `The ${check.name} header is present and correctly configured.`,
                });
            }
        }

        return {
            securityScore: Math.max(score, 0),
            securityIssues: issues,
        };
    } catch (error: any) {
        console.error("Security Scanner Error:", error.message);
        return {
            securityScore: 0,
            securityIssues: [
                {
                    header: "Scan Error",
                    status: "warning",
                    description: "Failed to scan security headers for this URL.",
                },
            ],
        };
    }
}
