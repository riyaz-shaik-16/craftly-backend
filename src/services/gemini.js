import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Use env variable!

async function parseResume(filePath) {
    const portfolioSchema = {
        personal: {
            name: "",
            title: "",
            email: "",
            phone: "",
            location: "",
            bio: "",
            avatar: ""
        },
        projects: [
            {
                title: "",
                description: "",
                techStack: [],
                githubLink: "",
                demoLink: "",
                liveLink: "",
                images: [],
                featured: false
            }
        ],
        experience: [
            {
                company: "",
                role: "",
                startDate: null,
                endDate: null,
                current: false,
                description: ""
            }
        ],
        skills: [
            {
                name: "",
                category: "",
                level: 0
            }
        ],
        education: [
            {
                institution: "",
                degree: "",
                field: "",
                startDate: null,
                endDate: null
            }
        ],
        certifications: [
            {
                name: "",
                issuer: "",
                issueDate: null,
                images: []
            }
        ],
        achievements: [
            {
                title: "",
                description: "",
                date: null,
                images: []
            }
        ],
        socialLinks: {
            github: "",
            linkedin: "",
            twitter: "",
            website: ""
        }
    };

    const prompt = `Analyze this resume and extract ALL information into a JSON object matching this EXACT schema. Return ONLY valid JSON, no markdown, no explanations.

Schema:
${JSON.stringify(portfolioSchema, null, 2)}

Instructions:
1. Extract personal details (name, email, phone, location)
2. For title/bio: Infer from resume summary or objective
3. Extract ALL work experiences with dates (use ISO format: "2023-01-15" or null if not found)
4. Extract ALL projects mentioned (with tech stack as array of strings)
5. Extract ALL skills - categorize them as: "Frontend", "Backend", "Database", "Tools", "Soft Skills", etc.
6. For skill level: estimate 1-5 based on experience or proficiency mentioned
7. Extract education details with dates
8. Extract certifications if any
9. Extract achievements, awards, or notable accomplishments
10. Find social links (GitHub, LinkedIn, Twitter, personal website)

If a field is not found in the resume, use empty string "", empty array [], or null for dates.
Ensure the JSON is valid and matches the schema exactly.

Return ONLY the JSON object, nothing else.`;

    const contents = [
        { text: prompt },
        {
            inlineData: {
                mimeType: 'application/pdf',
                data: Buffer.from(fs.readFileSync(filePath)).toString("base64")
            }
        }
    ];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview", // Fixed model name - gemini-3 doesn't exist
            contents: contents,
            generationConfig: {
                temperature: 0.2, // Lower temperature for more consistent JSON
                responseMimeType: "application/json" // This forces JSON output
            }
        });

        const jsonText = response.text;
        
        // Parse and validate the JSON
        const portfolioData = JSON.parse(jsonText);
        
        return portfolioData;
        
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.log("Raw response:", response.text);
        }
        
        throw error;
    }
}


export { parseResume } 