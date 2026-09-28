import { createServerFn } from "@tanstack/react-start";
import { createOpenAI } from "@ai-sdk/openai";
import { NoObjectGeneratedError, Output, streamText } from "ai";
import { z } from "zod";

const PlanInput = z.object({
  age: z.coerce.number().int().min(18).max(100),
  dietPreference: z.enum(["Vegetarian", "Vegan", "Eggetarian", "Non-vegetarian"]),
  primaryGoal: z.enum(["Feel more energetic", "Build strength", "Manage weight", "Improve overall wellness"]),
  activityLevel: z.enum(["Mostly sedentary", "Lightly active", "Moderately active", "Very active"]),
  description: z.string().trim().min(10).max(600),
});

const PlanSchema = z.object({
  summary: z.string(),
  dailyHabits: z.array(z.string()),
  mealPlan: z.array(z.object({ meal: z.string(), suggestion: z.string() })),
  activities: z.array(z.string()),
  wellnessTips: z.array(z.string()),
});

export type WellnessPlan = z.infer<typeof PlanSchema>;

export const generateWellnessPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI planning is not configured yet.");

    const { createLovableAiGatewayRunIdFetch } = await import("./ai-gateway.server");
    const runIdFetch = createLovableAiGatewayRunIdFetch();
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const prompt = `Create a practical, culturally relevant starter wellness plan for a South Indian woman.
Age: ${data.age}
Diet: ${data.dietPreference}
Primary goal: ${data.primaryGoal}
Activity level: ${data.activityLevel}
Her description: ${data.description}

Use familiar, accessible South Indian foods where appropriate. Keep the tone warm, concise, and non-judgmental. Give 4 daily habits, breakfast/lunch/snack/dinner meal suggestions, 3 activity recommendations, and 4 wellness tips. Do not diagnose, prescribe, promise outcomes, or give exact calorie targets. Mention that this is general wellness guidance, not medical advice, in the summary.`;

    try {
      const result = streamText({
        model: lovable.responses("openai/gpt-6-astra"),
        output: Output.object({ schema: PlanSchema }),
        prompt,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      return await result.output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        throw new Error("We couldn't shape your plan this time. Please try again.");
      }
      const message = error instanceof Error ? error.message : "Plan generation failed.";
      throw new Error(message);
    }
  });

const WaitlistInput = z.object({
  fullName: z.string().trim().min(1, "Please enter your full name.").min(2, "Please enter at least two characters for your name.").max(100, "Please enter a shorter name."),
  email: z.string().trim().min(1, "Please enter your email address.").toLowerCase().email("Please enter a valid email address.").max(254, "Please enter a shorter email address."),
});

function validateWaitlistInput(input: unknown) {
  const result = WaitlistInput.safeParse(input);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Please check your details and try again.");
  }
  return result.data;
}

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator(validateWaitlistInput)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("waitlist_signups").insert({
      full_name: data.fullName,
      email: data.email,
    });

    if (error?.code === "23505") {
      return { success: true, alreadyJoined: true };
    }
    if (error) throw new Error("We couldn't save your place. Please try again.");
    return { success: true, alreadyJoined: false };
  });