import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TripRequest {
  destination: string;
  days: number;
  budget: string;
  interests: string[];
  travelType: string;
  season: string;
  pace: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tripData: TripRequest = await req.json();
    console.log("Authenticated user:", claimsData.claims.sub, "- Trip request:", tripData.destination);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an intelligent travel planning assistant specializing in creating personalized, detailed travel itineraries. You have extensive knowledge of destinations worldwide, including local attractions, restaurants, cultural tips, and hidden gems.

Your responses should be:
- Practical and actionable
- Culturally sensitive and respectful
- Budget-conscious based on the user's specified range
- Tailored to the travel type (solo, couple, family, friends)
- Adjusted for the preferred pace (relaxed, moderate, fast)

Always provide structured, well-organized travel plans with specific recommendations.`;

    const userPrompt = `Create a comprehensive travel plan based on these details:

**Destination:** ${tripData.destination}
**Duration:** ${tripData.days} days
**Budget:** ${tripData.budget}
**Interests:** ${tripData.interests.join(", ")}
**Travel Type:** ${tripData.travelType}
**Season/Month:** ${tripData.season}
**Preferred Pace:** ${tripData.pace}

Please provide a detailed response in the following JSON format:
{
  "summary": "A brief 2-3 sentence overview of the trip",
  "highlights": ["Array of 5 must-see attractions/experiences"],
  "itinerary": [
    {
      "day": 1,
      "title": "Day theme/title",
      "morning": "Morning activities with specific places",
      "afternoon": "Afternoon activities with specific places",
      "evening": "Evening activities and dinner recommendations"
    }
  ],
  "restaurants": [
    {
      "name": "Restaurant name",
      "cuisine": "Type of cuisine",
      "priceRange": "$, $$, or $$$",
      "specialty": "What they're known for"
    }
  ],
  "tips": ["Array of 5 practical local travel tips"],
  "bestTimes": [
    {
      "place": "Attraction name",
      "bestTime": "Best time to visit",
      "reason": "Why this time is best"
    }
  ],
  "safety": ["Array of 3 safety and cultural tips"],
  "budget": {
    "accommodation": "Estimated daily cost",
    "food": "Estimated daily cost",
    "activities": "Estimated daily cost",
    "transport": "Estimated daily cost",
    "total": "Estimated total trip cost"
  }
}

Ensure all recommendations are specific, actionable, and tailored to the user's preferences. Include real place names and practical advice.`;

    console.log("Calling Lovable AI Gateway...");

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
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI response received successfully");

    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Try to parse as JSON, or return raw content
    let tripPlan;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      tripPlan = JSON.parse(jsonString);
    } catch (parseError) {
      console.log("Could not parse as JSON, returning raw content");
      tripPlan = { rawContent: content };
    }

    return new Response(
      JSON.stringify({ success: true, tripPlan }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating trip:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
