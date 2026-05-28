import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import process from "node:process";

import { createLovableAiGatewayProvider } from "../ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(MODEL);
}

// 1. Email Generator
export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      recipientType: z.enum(["Client", "Manager", "Team"]),
      tone: z.enum(["Formal", "Informal", "Persuasive"]),
      subject: z.string().min(1).max(200),
      keyPoints: z.string().min(1).max(2000),
    }),
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a professional email writing assistant. Write clear, well-structured emails. Output ONLY the email body (with greeting and sign-off). Do not include 'Subject:' line or any commentary.",
      prompt: `Write a ${data.tone.toLowerCase()} email to a ${data.recipientType.toLowerCase()}.

Subject: ${data.subject}

Key points to cover:
${data.keyPoints}`,
    });
    return { email: text };
  });

// 2. Meeting Notes Summarizer
export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(10).max(20000) }))
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: getModel(),
      output: Output.object({
        schema: z.object({
          summary: z.string(),
          decisions: z.array(z.string()),
          actionItems: z.array(
            z.object({ task: z.string(), owner: z.string() }),
          ),
          deadlines: z.array(z.string()),
        }),
      }),
      prompt: `Analyze these meeting notes and extract structured info.\n\nNotes:\n${data.notes}`,
    });
    return output;
  });

// 3. Task Planner
export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tasks: z.string().min(1).max(5000),
      hours: z.number().min(1).max(24),
      priority: z.enum(["Urgency", "Importance", "Balanced"]),
    }),
  )
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: getModel(),
      output: Output.object({
        schema: z.object({
          schedule: z.array(
            z.object({
              timeBlock: z.string(),
              task: z.string(),
              notes: z.string(),
            }),
          ),
          tips: z.array(z.string()),
        }),
      }),
      prompt: `Create a daily plan.

Available hours: ${data.hours}
Priority approach: ${data.priority}

Tasks:
${data.tasks}

Generate a realistic schedule with time blocks (e.g. "9:00 - 10:30") and 3-5 productivity tips.`,
    });
    return output;
  });

// 4. Research Assistant
export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(z.object({ input: z.string().min(3).max(10000) }))
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: getModel(),
      output: Output.object({
        schema: z.object({
          summary: z.string(),
          insights: z.array(z.string()).min(3).max(5),
          recommendation: z.string(),
        }),
      }),
      prompt: `Research and analyze the following. Provide a plain-language summary, 3-5 key insights, and a recommended next step.\n\nInput:\n${data.input}`,
    });
    return output;
  });

// 5. Copywriter / Rewrite
export const rewriteCopy = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      original: z.string().min(5).max(10000),
      goal: z.enum(["Clarify", "Shorten", "Lengthen", "Persuade", "Simplify", "Formalize", "Casualize"]),
      audience: z.string().max(200).optional(),
      tone: z.string().max(200).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: getModel(),
      output: Output.object({
        schema: z.object({
          rewritten: z.string(),
          changes: z.string(),
        }),
      }),
      prompt: `Rewrite the following copy. Goal: ${data.goal}. ${data.audience ? `Target audience: ${data.audience}.` : ""} ${data.tone ? `Desired tone: ${data.tone}.` : ""}

Original copy:
${data.original}`,
    });
    return output;
  });
