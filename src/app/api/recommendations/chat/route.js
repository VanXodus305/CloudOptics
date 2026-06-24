import { connectDB } from "../../../../lib/mongodb";
import { Resource } from "../../../../models/Resource";
import { Metric } from "../../../../models/Metric";
import { verifySession } from "../../../../lib/auth-helper";
import { calculateAlerts } from "../../../../lib/alerts-helper";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const session = await verifySession(request);

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "messages array is required" }, { status: 400 });
    }

    // 1. Fetch active resources
    const resources = await Resource.find({ status: "running" }).lean();
    const resourceIds = resources.map((r) => r.resourceId);

    // 2. Fetch 30-day average metrics per resource
    const latestMetric = await Metric.findOne()
      .sort({ timestamp: -1 })
      .select("timestamp")
      .lean();
    const latestTimestamp = latestMetric ? new Date(latestMetric.timestamp) : new Date();
    const thirtyDaysBeforeLatest = new Date(latestTimestamp);
    thirtyDaysBeforeLatest.setDate(thirtyDaysBeforeLatest.getDate() - 30);

    const utilizationStats = await Metric.aggregate([
      {
        $match: {
          resourceId: { $in: resourceIds },
          timestamp: { $gte: thirtyDaysBeforeLatest, $lte: latestTimestamp },
        },
      },
      {
        $group: {
          _id: "$resourceId",
          avgCpu: { $avg: "$cpuUtilization" },
          avgMemory: { $avg: "$memoryUtilization" },
          avgStorage: { $avg: "$storageSizeGB" },
          totalCost: { $sum: "$costIncurred" },
        },
      },
    ]);

    const utilizationMap = {};
    utilizationStats.forEach((stat) => {
      utilizationMap[stat._id] = stat;
    });

    const enrichedResources = resources.map((r) => {
      const stats = utilizationMap[r.resourceId] || {
        avgCpu: 0,
        avgMemory: 0,
        avgStorage: 0,
        totalCost: 0,
      };
      return {
        resourceId: r.resourceId,
        serviceType: r.serviceType,
        instanceType: r.instanceType || "N/A",
        region: r.region,
        environment: r.environment,
        department: r.department,
        costPerHour: r.costPerHour,
        projectedMonthlyCost: Math.round(r.costPerHour * 720),
        avgCpu: Math.round(stats.avgCpu || 0),
        avgMemory: Math.round(stats.avgMemory || 0),
        avgStorage: Math.round(stats.avgStorage || 0),
        cost30Days: Math.round(stats.totalCost || 0),
      };
    });

    // 3. Fetch active alerts
    const alerts = await calculateAlerts();
    const formattedAlerts = alerts.map((a) => ({
      resourceId: a.resourceId,
      type: a.type,
      severity: a.severity,
      message: a.message,
      potentialSavings: Math.round(a.potentialSavings),
    }));

    // 4. Construct System Instruction with context data
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const isSimpleGreeting = /^\s*(hello|hi|hey|greetings|good\s+morning|good\s+afternoon|good\s+evening|yo|hola|hello\s+there|hi\s+there)\s*[.!?]*\s*$/i.test(lastUserMessage);

    let systemInstruction = "";
    if (isSimpleGreeting) {
      systemInstruction = `
You are CloudOptics AI Chatbot, a friendly and professional AWS cloud optimization assistant.
The user has sent a greeting: "${lastUserMessage}".
Respond with a short, warm, human-like greeting (1 sentence, e.g., "Hello! How can I help you optimize your cloud costs today?").
Do NOT list any cloud resources, costs, alerts, or details. Keep it conversational and brief.
`;
    } else {
      systemInstruction = `
You are CloudOptics AI Chatbot, an advanced assistant powered by Gemini. You have direct access to the real-time cloud inventory, metrics, and FinOps alerts of the organization's AWS infrastructure.

Here is the current snapshot of active cloud resources (including 30-day average metrics and calculated costs):
${JSON.stringify(enrichedResources, null, 2)}

Here are the active cost-saving / optimization alerts currently triggered:
${JSON.stringify(formattedAlerts, null, 2)}

Rules for your responses:
1. Provide specific, data-backed answers referencing actual resourceIds (e.g. "i-xyz") from the data.
2. Address cost savings directly using values from the snapshots.
3. Be professional, direct, and concise. Format your responses using markdown, such as bullet points, bold text, or tables when explaining complex lists.
4. Avoid using first-person pronouns (I, we, our, etc.) in system analysis (e.g., write "Analysis indicates..." instead of "I think..."). But you can say "Hello, I am your CloudOptics AI Assistant" in the greeting or welcome message.
5. If the user asks about a resource or alert not present in the data, state that it is not currently detected in the active inventory.
6. Provide actionable remediation steps for cost optimizations (e.g., downsizing, instance scheduling, deleting unattached storage) based on the context data.
7. If the user's message is a simple greeting (like "Hello", "Hi", "Hey", "Good morning", etc.), respond with a short, warm, human-like greeting (1-2 sentences max, e.g. "Hello! How can I help you optimize your cloud costs today?") without listing resources, costs, alerts, or details. Keep it conversational and brief.
`;
    }


    // 5. Initialize Gemini Client
    const ai = new GoogleGenAI({});

    // 6. Map message history into Gemini Contents structure
    // Role must be either 'user' or 'model'
    const contents = messages.map((msg) => {
      let role = "user";
      if (msg.role === "assistant" || msg.role === "model" || msg.role === "system") {
        role = "model";
      }
      return {
        role,
        parts: [{ text: msg.content || "" }],
      };
    });

    // 7. Request chat completion
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents,
      config: {
        systemInstruction,
      },
    });

    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || response.text || "I was unable to process your request.";

    return Response.json({ message: responseText });
  } catch (error) {
    console.error("Error in AI recommendations chatbot:", error);
    return Response.json(
      { error: error.message || "Failed to process chat" },
      { status: 500 },
    );
  }
}
