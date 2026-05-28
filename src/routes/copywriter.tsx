import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Copy, PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppSection } from "@/components/app-section";
import { rewriteCopy } from "@/lib/api/ai.functions";

export const Route = createFileRoute("/copywriter")({
  component: CopywriterPage,
  head: () => ({
    meta: [
      { title: "AI Copywriter — WorkSmart AI Assistant" },
      {
        name: "description",
        content:
          "Paste your draft and choose a goal to get polished, audience-ready copy.",
      },
    ],
  }),
});

function Spinner() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}

type RewriteResult = {
  rewritten: string;
  changes: string;
};

function CopywriterPage() {
  const [original, setOriginal] = useState("");
  const [goal, setGoal] = useState<
    | "Clarify"
    | "Shorten"
    | "Lengthen"
    | "Persuade"
    | "Simplify"
    | "Formalize"
    | "Casualize"
  >("Clarify");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RewriteResult | null>(null);

  async function run() {
    if (original.trim().length < 5) {
      toast.error("Please paste some text to rewrite (at least 5 chars).");
      return;
    }
    setLoading(true);
    try {
      const res = await rewriteCopy({
        data: {
          original,
          goal,
          audience: audience || undefined,
          tone: tone || undefined,
        },
      });
      setResult(res as RewriteResult);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to rewrite copy.",
      );
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result.rewritten);
    toast.success("Rewritten copy copied to clipboard");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Copywriter</h1>
        <p className="text-muted-foreground">
          Paste your draft and choose a goal to get polished, audience-ready
          copy.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rewrite Copy</CardTitle>
          <CardDescription>
            Enter your text and select how you want it transformed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Original copy</Label>
            <Textarea
              rows={8}
              value={original}
              maxLength={10000}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste your email, paragraph, product description, or any draft here…"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Goal</Label>
              <Select
                value={goal}
                onValueChange={(v) => setGoal(v as never)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clarify">Clarify</SelectItem>
                  <SelectItem value="Shorten">Shorten</SelectItem>
                  <SelectItem value="Lengthen">Lengthen</SelectItem>
                  <SelectItem value="Persuade">Persuade</SelectItem>
                  <SelectItem value="Simplify">Simplify</SelectItem>
                  <SelectItem value="Formalize">Formalize</SelectItem>
                  <SelectItem value="Casualize">Casualize</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Audience (optional)</Label>
              <Input
                id="audience"
                value={audience}
                maxLength={200}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Executives, Gen Z customers"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Desired tone (optional)</Label>
              <Input
                id="tone"
                value={tone}
                maxLength={200}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g. Witty, empathetic, urgent"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={run} disabled={loading}>
              {loading ? <Spinner /> : <PenLine className="h-4 w-4" />}
              <span className="ml-2">
                {loading ? "Rewriting…" : "Rewrite"}
              </span>
            </Button>
            {result && (
              <Button variant="outline" onClick={copy}>
                <Copy className="h-4 w-4" />{" "}
                <span className="ml-2">Copy result</span>
              </Button>
            )}
          </div>

          {result && (
            <div className="space-y-4 mt-4 pt-4 border-t">
              <AppSection title="Rewritten copy">
                <Textarea
                  value={result.rewritten}
                  onChange={(e) =>
                    setResult({ ...result, rewritten: e.target.value })
                  }
                  rows={10}
                  className="font-mono text-sm resize-y"
                />
              </AppSection>
              <AppSection title="What changed">
                <p className="text-sm whitespace-pre-wrap">{result.changes}</p>
              </AppSection>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
