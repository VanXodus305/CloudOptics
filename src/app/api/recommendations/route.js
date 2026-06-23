import { connectDB } from "../../../lib/mongodb";
import { Resource } from "../../../models/Resource";
import { Metric } from "../../../models/Metric";
import { verifySession } from "../../../lib/auth-helper";
import { calculateAlerts } from "../../../lib/alerts-helper";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "src/app/api/recommendations", "cache.json");
const CACHE_TTL = 60 * 60 * 1000; // 1 hour time-to-live

// Global in-memory cache variable (persists during process lifetime)
let memoryCache = null;

export async function GET(request) {
  try {
    const session = await verifySession(request);

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const forceRegenerate = url.searchParams.get("regenerate") === "true";

    // 1. Check in-memory cache first if not forcing regeneration
    if (!forceRegenerate && memoryCache && (Date.now() - memoryCache.timestamp < CACHE_TTL)) {
      return Response.json(memoryCache.data);
    }

    // 2. Check file-based cache if not forcing regeneration
    if (!forceRegenerate) {
      try {
        const cacheData = await fs.readFile(CACHE_FILE, "utf-8");
        const cache = JSON.parse(cacheData);
        // Validate cache is present, has not expired, and contains data
        if (cache && cache.timestamp && (Date.now() - cache.timestamp < CACHE_TTL) && cache.data) {
          memoryCache = cache; // Populate memory cache
          return Response.json(cache.data);
        }
      } catch (e) {
        // Cache file doesn't exist, is invalid, or expired; proceed to generate
      }
    }

    await connectDB();

    // 3. Fetch resources and calculate alerts for context
    const resources = await Resource.find({ status: "running" }).lean();
    
    if (resources.length === 0) {
      const emptyResponse = {
        aiSummary: {
          overview: "No running resources found to analyze.",
          keyFindings: [],
          nextSteps: []
        },
        totalActionsCount: 0,
        totalPotentialSavings: 0,
        recommendations: []
      };
      
      const cachePayload = {
        timestamp: Date.now(),
        data: emptyResponse
      };
      memoryCache = cachePayload;
      
      await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
      await fs.writeFile(CACHE_FILE, JSON.stringify(cachePayload, null, 2), "utf-8");
      
      return Response.json(emptyResponse);
    }

    const alerts = await calculateAlerts();

    // 4. Compile resource details for the prompt
    // We extrapolate hourly costs to projected monthly costs (720 hours)
    const resourceSummaries = resources.map((r) => {
      const matchingAlerts = alerts.filter((a) => a.resourceId === r.resourceId);
      return {
        resourceId: r.resourceId,
        serviceType: r.serviceType,
        instanceType: r.instanceType || "N/A",
        region: r.region || "us-east-1",
        environment: r.environment,
        department: r.department,
        costPerHour: r.costPerHour,
        projectedMonthlyCost: Math.round(r.costPerHour * 720),
        alerts: matchingAlerts.map((a) => ({
          type: a.type,
          severity: a.severity,
          message: a.message,
          potentialSavings: Math.round(a.potentialSavings)
        }))
      };
    });

    // 5. Initialize Gemini client
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in .env");
    }

    const ai = new GoogleGenAI({});

    // 6. Construct the prompt
    const promptText = `
You are a Cloud Cost Optimization Expert. Review the following JSON list of active cloud resources and their metrics/alerts:
${JSON.stringify(resourceSummaries, null, 2)}

Identify concrete actions for cost reduction and resource optimization. Group the recommendations into three categories:
1. "allocate": Allocation optimization (e.g. terminating idle resources, clean up unattached S3 storage).
2. "sizing": Right-sizing instances (e.g. downgrading oversized compute instances, moving to modern instance families).
3. "usage": Usage pattern optimizations (e.g. scheduling non-production resources, reserved instances, or shifting S3 access tiers).

Generate a response following the required JSON schema. Calculate realistic savings. Make recommendations highly detailed and specific to the actual resourceIds in the input.

CRITICAL INSTRUCTIONS FOR THE RESPONSE:
1. Do NOT use any first-person pronouns (do not use "I", "we", "our", "my", etc.). Instead, use professional third-person passive or active objective auditing style (e.g. "Analysis indicates...", "Potential monthly savings of $597 have been identified...", "Optimizations should focus on...").
2. The response must match the schema exactly.
3. Generate at least one recommendation for each of the three categories: "allocate", "sizing", and "usage". For the "usage" category, target resources in 'Development' or 'Testing' environments and recommend instance scheduling (e.g. night/weekend shutdown) or S3 lifecycle tier transitions.
4. Order the list of recommendations by impact (High first, then Medium, then Low) to highlight high-priority optimizations first.
`;

    // 7. Generate content with structured JSON schema
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            aiSummary: { 
              type: "OBJECT", 
              description: "A structured summary of findings and next steps. Do not use first-person language.",
              properties: {
                overview: {
                  type: "STRING",
                  description: "A brief, professional overview of the current cloud infrastructure spend and savings potential. Must NOT use first-person pronouns (I, we, our, etc.)."
                },
                keyFindings: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  description: "List of key issues identified (e.g. idle instances, oversized instances, unattached S3 storage). Max 3 items."
                },
                nextSteps: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  description: "List of recommended next steps to realize savings. Max 3 items."
                }
              },
              required: ["overview", "keyFindings", "nextSteps"]
            },
            totalActionsCount: { 
              type: "INTEGER", 
              description: "The total count of recommendations generated." 
            },
            totalPotentialSavings: { 
              type: "NUMBER", 
              description: "The sum of potential monthly savings across all recommendations." 
            },
            recommendations: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING", description: "Unique recommendation ID (e.g. rec-01, rec-02)" },
                  title: { type: "STRING", description: "Short specific title for the optimization (e.g. Downsize idle EC2 instance i-xyz)" },
                  description: { type: "STRING", description: "Detailed description of why this change is suggested and what it involves." },
                  category: { 
                    type: "STRING", 
                    enum: ["allocate", "sizing", "usage"],
                    description: "Category of the recommendation: allocate (allocation/termination), sizing (right-sizing), usage (usage patterns/scheduling)." 
                  },
                  impact: { 
                    type: "STRING", 
                    enum: ["High", "Medium", "Low"],
                    description: "Financial or operational impact of this recommendation." 
                  },
                  potentialSavings: { 
                    type: "NUMBER", 
                    description: "Potential monthly savings in dollars." 
                  },
                  resourceId: { type: "STRING", description: "The affected resourceId from the input resources." },
                  service: { 
                    type: "STRING", 
                    enum: ["EC2", "S3", "RDS"],
                    description: "The cloud service category."
                  },
                  actionableSteps: { 
                    type: "STRING", 
                    description: "Bullet-pointed lists of exact commands, console actions, or steps to implement the change." 
                  }
                },
                required: ["id", "title", "description", "category", "impact", "potentialSavings", "resourceId", "service", "actionableSteps"]
              }
            }
          },
          required: ["aiSummary", "totalActionsCount", "totalPotentialSavings", "recommendations"]
        }
      }
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || response.text;
    const result = JSON.parse(text);
    const cachePayload = {
      timestamp: Date.now(),
      data: result
    };

    memoryCache = cachePayload;

    // Ensure parent directory of cache file exists
    await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
    
    // Save to cache file
    await fs.writeFile(CACHE_FILE, JSON.stringify(cachePayload, null, 2), "utf-8");

    return Response.json(result);
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    return Response.json(
      { error: error.message || "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
