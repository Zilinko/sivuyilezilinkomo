import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, FileText, Copy } from "lucide-react";

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
import { summarizeMeeting } from "@/lib/api/ai.functions";

export const Route = createFileRoute("/meeting")({
  component: MeetingPage,
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkSmart AI Assistant" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and extract a structured summary, decisions, action items, and deadlines.",
      },
    ],
  }),
});

function Spinner() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}

type MeetingResult = {
  summary: string;
  decisions: string[];
  actionItems: { task: string; owner: string }[];
  deadlines: string[];
};

function MeetingPage() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MeetingResult | null>(null);

  async function run() {
    if (notes.trim().length < 10) {
      toast.error("Please paste meeting notes (at least 10 chars).");
      return;
    }
    setLoading(true);
    try {
      const res = await summarizeMeeting({ data: { notes } });
      setResult(res as MeetingResult);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to summarize.",
      );
    } finally {
      setLoading(false);
    }
  }

  function copyAll() {
    if (!result) return;
    const text = `Summary:\n${result.summary}\n\nDecisions:\n${result.decisions.join("\n")}\n\nAction Items:\n${result.actionItems.map((a) => `- ${a.task} (${a.owner})`).join("\n")}\n\nDeadlines:\n${result.deadlines.join("\n")}`;
    navigator.clipboard.writeText(text);
    toast.success("Summary copied to clipboard");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Meeting Notes Summarizer
        </h1>
        <p className="text-muted-foreground">
          Paste raw meeting notes and extract a structured summary, decisions,
          action items, and deadlines.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meeting Notes</CardTitle>
          <CardDescription>
            Paste your raw notes below and AI will structure them for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={10}
            value={notes}
            maxLength={20000}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste meeting notes here…"
          />
          <Button onClick={run} disabled={loading}>
            {loading ? <Spinner /> : <FileText className="h-4 w-4" />}
            <span className="ml-2">
              {loading ? "Summarizing…" : "Summarize"}
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
              <div className="grid gap-4 sm:grid-cols-2">
                <AppSection title="Summary" className="sm:col-span-2">
                  <Textarea
                    value={result.summary}
                    onChange={(e) =>
                      setResult({ ...result, summary: e.target.value })
                    }
                    rows={4}
                    className="text-sm resize-y"
                  />
                </AppSection>
                <AppSection title="Key Decisions">
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {result.decisions.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                    {result.decisions.length === 0 && (
                      <li className="text-muted-foreground">
                        None identified
                      </li>
                    )}
                  </ul>
                </AppSection>
                <AppSection title="Action Items">
                  <ul className="space-y-2 text-sm">
                    {result.actionItems.map((a, i) => (
                      <li
                        key={i}
                        className="flex justify-between gap-2 border-b pb-1"
                      >
                        <span>{a.task}</span>
                        <span className="font-medium text-primary whitespace-nowrap">
                          {a.owner}
                        </span>
                      </li>
                    ))}
                    {result.actionItems.length === 0 && (
                      <li className="text-muted-foreground">
                        None identified
                      </li>
                    )}
                  </ul>
                </AppSection>
                <AppSection title="Deadlines">
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {result.deadlines.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                    {result.deadlines.length === 0 && (
                      <li className="text-muted-foreground">
                        None mentioned
                      </li>
                    )}
                  </ul>
                </AppSection>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
