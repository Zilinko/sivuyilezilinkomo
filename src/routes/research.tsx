import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Lightbulb, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppSection } from "@/components/app-section";
import { researchTopic } from "@/lib/api/ai.functions";

export const Route = createFileRoute("/research")({
  component: ResearchPage,
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkSmart AI Assistant" },
      {
        name: "description",
        content:
          "Enter a topic or paste text to get a plain-language summary, insights, and recommendations.",
      },
    ],
  }),
});

function Spinner() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}

type ResearchResult = {
  summary: string;
  insights: string[];
  recommendation: string;
};

function ResearchPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  async function run() {
    if (input.trim().length < 3) {
      toast.error("Please provide a topic or text.");
      return;
    }
    setLoading(true);
    try {
      const res = await researchTopic({ data: { input } });
      setResult(res as ResearchResult);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to research.",
      );
    } finally {
      setLoading(false);
    }
  }

  function copyAll() {
    if (!result) return;
    const text = `Summary:\n${result.summary}\n\nKey Insights:\n${result.insights.map((i) => `- ${i}`).join("\n")}\n\nRecommendation:\n${result.recommendation}`;
    navigator.clipboard.writeText(text);
    toast.success("Research copied to clipboard");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          AI Research Assistant
        </h1>
        <p className="text-muted-foreground">
          Enter a topic, paste an article, or ask a question — get a
          plain-language summary, insights, and a next step.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Research Input</CardTitle>
          <CardDescription>
            Provide a topic, article text, or question to analyze.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={8}
            value={input}
            maxLength={10000}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Topic, article text, or question…"
          />
          <Button onClick={run} disabled={loading}>
            {loading ? <Spinner /> : <Lightbulb className="h-4 w-4" />}
            <span className="ml-2">
              {loading ? "Researching…" : "Analyze"}
            </span>
          </Button>

          {result && (
            <div className="space-y-4 mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Results</Label>
                <Button size="sm" variant="ghost" onClick={copyAll}>
                  <Copy className="h-4 w-4" />
                  <span className="ml-1">Copy all</span>
                </Button>
              </div>
              <AppSection title="Summary">
                <Textarea
                  value={result.summary}
                  onChange={(e) =>
                    setResult({ ...result, summary: e.target.value })
                  }
                  rows={4}
                  className="text-sm resize-y"
                />
              </AppSection>
              <AppSection title="Key insights">
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {result.insights.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </AppSection>
              <AppSection title="Recommended next step">
                <Textarea
                  value={result.recommendation}
                  onChange={(e) =>
                    setResult({ ...result, recommendation: e.target.value })
                  }
                  rows={3}
                  className="text-sm resize-y"
                />
              </AppSection>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
