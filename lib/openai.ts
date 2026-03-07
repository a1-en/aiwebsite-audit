import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // Prevent the OpenAI call from hanging indefinitely and causing a 504
    timeout: 30000,
});

export async function generateAiReport(auditData: any): Promise<string> {
    const prompt = `
    You are an expert Website Audit Agent. Based on the following raw audit data, generate a professional, clear, and actionable audit report.
    Use Markdown for formatting.
    The report should include:
    - Executive Summary
    - Key Findings (Performance, SEO, Security, Tech Stack)
    - Actionable Recommendations (Prioritized list of fixes)
    Format it in a premium style with sections and clear headings.
    
    Audit Data:
    ${JSON.stringify(auditData, null, 2)}
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        return response.choices[0].message?.content || "Failed to generate report.";
    } catch (error: any) {
        console.error("OpenAI Error:", error);
        return "Error generating AI report. Please try again later.";
    }
}
