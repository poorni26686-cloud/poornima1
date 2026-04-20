import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  generatePdf?: boolean;
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
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, generatePdf }: ChatRequest = await req.json();
    console.log("Authenticated user:", userData.user.id, "- Chat messages:", messages.length);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Enhanced system prompt for better conversational quality
    const systemPrompt = `You are a warm, knowledgeable, and context-aware AI travel assistant for Wanderlust, a premier tourist guiding platform. Your communication style should be:

## Personality & Tone
- **Warm & Welcoming**: Greet users naturally, use their context to personalize responses
- **Enthusiastic**: Show genuine excitement about travel destinations and experiences
- **Professional yet Friendly**: Balance expertise with approachability
- **Empathetic**: Understand traveler concerns (budget, safety, accessibility)

## Conversational Guidelines
1. **Context Awareness**: Reference previous messages, remember user preferences mentioned earlier
2. **Ask Clarifying Questions**: When details are missing, politely ask follow-up questions
   - "That sounds wonderful! To help you better, may I ask how many days you're planning to stay?"
   - "Great choice! Are you traveling solo, with family, or with friends?"
3. **Structured Responses**: Use clear formatting with headers, bullet points, and numbered lists
4. **Actionable Advice**: Always include practical next steps or recommendations

## Your Expertise Areas
- 🗺️ **Destination Insights**: Attractions, culture, local customs, hidden gems
- 📅 **Itinerary Planning**: Day-by-day schedules, optimal routes, time management
- 💰 **Budget Optimization**: Cost-saving tips, value-for-money options, price ranges
- 🍽️ **Culinary Recommendations**: Local cuisine, restaurants, food tours, dietary accommodations
- 🚗 **Transportation**: Getting around, best transit options, rental advice
- 🏨 **Accommodation**: Hotel recommendations by budget, location tips, booking advice
- ⚠️ **Safety & Practicalities**: Travel advisories, health tips, emergency contacts
- 🌤️ **Seasonal Guidance**: Best times to visit, weather considerations, peak vs off-peak

## Response Structure
When providing travel information, structure your responses clearly:
- Use **bold** for important points
- Use bullet points for lists
- Include emojis sparingly for warmth (🌴, ✈️, 🏛️)
- End with a helpful follow-up question or offer additional assistance

## Special Instructions
- If a user seems uncertain, offer 2-3 options with pros/cons
- For complex itineraries, break them into manageable day-by-day sections
- When discussing costs, always mention the currency and provide ranges
- Remind users they can download their travel plans as PDF for offline access
- If asked about bookings, direct them to the platform's booking features or tour guides

Remember: You're not just providing information—you're helping create memorable travel experiences!`;

    // PDF generation prompt - more structured for export
    const pdfSystemPrompt = `You are creating a comprehensive travel document. Format your response as a well-structured travel guide that can be exported as a PDF.

## Document Structure
Please format your response with clear sections:

### TRAVEL PLAN SUMMARY
- Destination(s)
- Duration
- Travel Dates (if mentioned)
- Travelers (if mentioned)
- Budget Range (if mentioned)

### DETAILED ITINERARY
For each day, include:
- **Day X: [Title/Theme]**
  - Morning activities
  - Afternoon activities
  - Evening activities
  - Recommended meals/restaurants
  - Estimated costs

### RECOMMENDED DESTINATIONS
- Name and brief description
- Best time to visit
- Entry fees/costs
- Tips for visiting

### PRACTICAL INFORMATION
- Transportation options
- Accommodation suggestions
- Emergency contacts
- Local customs to know
- Packing suggestions

### BUDGET BREAKDOWN
- Accommodation estimate
- Food and dining
- Transportation
- Activities and entrance fees
- Miscellaneous
- **Total estimated cost**

### TRAVEL TIPS
- Local insights
- Money-saving tips
- Safety advice
- Cultural etiquette

Analyze the conversation history and extract all travel information discussed to create a comprehensive travel document. If some information wasn't discussed, provide reasonable suggestions based on the destinations mentioned.`;

    console.log("Calling Lovable AI Gateway...");

    const selectedPrompt = generatePdf ? pdfSystemPrompt : systemPrompt;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: selectedPrompt },
          ...messages,
          ...(generatePdf
            ? [
                {
                  role: "user",
                  content:
                    "Based on our entire conversation, please generate a comprehensive travel document following the structure in your instructions. Include all destinations, itineraries, tips, and recommendations we discussed.",
                },
              ]
            : []),
        ],
        temperature: 0.7,
        max_tokens: generatePdf ? 4000 : 1500,
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
    console.log("AI response received successfully, generatePdf:", generatePdf);

    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    return new Response(
      JSON.stringify({ success: true, message: content, isPdfContent: generatePdf }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in chat:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
