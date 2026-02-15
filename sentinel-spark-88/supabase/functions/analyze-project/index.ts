import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Task {
  id: string;
  name: string;
  status: string;
  deadline: string;
  lastUpdatedDays: number;
  priority: string;
}

interface Message {
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log("Missing or invalid authorization header");
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.log("Invalid token:", claimsError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    const { tasks, messages } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Sanitize data - only extract metadata, no sensitive info
    const sanitizedTasks = (tasks as Task[]).map(t => ({
      name: t.name,
      status: t.status,
      deadline: t.deadline,
      daysInactive: t.lastUpdatedDays,
      priority: t.priority,
    }));

    const sanitizedMessages = (messages as Message[]).map(m => m.content);

    const today = new Date().toISOString().split('T')[0];
    
    const systemPrompt = `You are an AI project analyst for Project Sentinel. Your job is to analyze project data and provide actionable insights.

IMPORTANT RULES:
1. Only analyze the metadata provided - never request access to files, code, or sensitive data
2. Focus on detecting risks and blockers
3. Be concise and actionable
4. Use simple language that any team member can understand

You must respond with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "projectHealth": {
    "status": "on-track" | "needs-attention" | "high-risk",
    "score": number (0-100),
    "tasksCompleted": number,
    "totalTasks": number,
    "blockedTasks": number,
    "overdueTasks": number
  },
  "alerts": [
    {
      "id": string,
      "level": "info" | "warning" | "critical",
      "title": string (short, 5-10 words),
      "description": string (1-2 sentences explaining the issue and impact)
    }
  ],
  "summary": string (3-5 sentences summarizing the project status, key risks, and recommended actions)
}`;

    const userPrompt = `Today's date: ${today}

Analyze this project data:

TASKS:
${JSON.stringify(sanitizedTasks, null, 2)}

TEAM MESSAGES:
${sanitizedMessages.map((m, i) => `${i + 1}. "${m}"`).join('\n')}

Detect:
1. Blocked tasks (look for words like "waiting", "blocked", "stuck", "pending" in messages)
2. Deadline risks (tasks with deadlines soon and high inactivity)
3. Communication issues (frustration, delays mentioned)
4. Tasks that are overdue (deadline before today: ${today})

Generate alerts for each issue found and provide an overall health assessment.`;

    console.log("Calling AI gateway for project analysis...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received:", content.substring(0, 200));

    // Parse the JSON response
    let analysis;
    try {
      // Remove any potential markdown code blocks
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw content:", content);
      throw new Error("Failed to parse AI analysis response");
    }

    // Add timestamps to alerts
    const alertsWithTimestamp = (analysis.alerts || []).map((alert: any, index: number) => ({
      ...alert,
      id: alert.id || `alert-${Date.now()}-${index}`,
      timestamp: new Date().toISOString(),
    }));

    return new Response(JSON.stringify({
      projectHealth: analysis.projectHealth,
      alerts: alertsWithTimestamp,
      summary: analysis.summary,
      analyzedAt: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Analysis failed" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
