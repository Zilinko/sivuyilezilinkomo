import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = await request.json();
        const key = process.env.LOVABLE_API_KEY;
        if (!key) throw new Error("Missing LOVABLE_API_KEY");
        const model = createLovableAiGatewayProvider(key)(
          "google/gemini-3-flash-preview",
        );

        const result = streamText({
          model,
          system:
            "You are WorkSmart AI, a helpful workplace productivity assistant. You help professionals with emails, meetings, task planning, research, writing, and general workplace questions. Be concise, professional, and actionable. When appropriate, suggest specific next steps. Format responses with clear headings and bullet points when helpful.",
          messages,
        });

        return result.toDataStreamResponse();
      },
    },
  },
});
