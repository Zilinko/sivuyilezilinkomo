import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Lightbulb,
  PenLine,
  MessageSquare,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Smart Email Generator",
    description: "Craft professional emails tailored to any recipient and tone.",
    icon: Mail,
    href: "/email",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Extract summaries, decisions, action items, and deadlines from raw notes.",
    icon: FileText,
    href: "/meeting",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "AI Task Planner",
    description: "Turn your task list into a structured daily plan with time blocks.",
    icon: ListChecks,
    href: "/planner",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "AI Research Assistant",
    description: "Get plain-language summaries, insights, and recommendations on any topic.",
    icon: Lightbulb,
    href: "/research",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    title: "AI Copywriter",
    description: "Rewrite, clarify, or adjust the tone of any text for your audience.",
    icon: PenLine,
    href: "/copywriter",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    title: "AI Chatbot",
    description: "Chat with WorkSmart AI for instant workplace productivity help.",
    icon: MessageSquare,
    href: "/chat",
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
];

export const Route = createFileRoute("/")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — WorkSmart AI Assistant" },
      {
        name: "description",
        content:
          "AI-powered workplace productivity dashboard with email, meetings, planning, research, and chat tools.",
      },
    ],
  }),
});

function DashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
          <Zap className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to WorkSmart AI. Choose a tool to get started.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.href} to={feature.href}>
            <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer h-full group">
              <CardHeader className="pb-3">
                <div
                  className={`h-10 w-10 rounded-lg ${feature.bg} flex items-center justify-center mb-2`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-primary font-medium">
                  Open tool
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Tips for getting the most out of WorkSmart AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-medium">1.</span>
              Be specific in your prompts — include context, audience, and goals.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-medium">2.</span>
              Review AI-generated content before sending or sharing.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-medium">3.</span>
              Use the chat for open-ended questions and quick workplace advice.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-medium">4.</span>
              All outputs are editable — refine them to match your voice.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
