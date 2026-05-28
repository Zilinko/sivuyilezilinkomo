import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Copy, RefreshCw, Mail, FileText, ListChecks, Lightbulb, Sparkles, PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";

import {
  generateEmail,
  summarizeMeeting,
  planTasks,
  researchTopic,
  rewriteCopy,
} from "@/lib/api/ai.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkSmart AI Assistant" },
      {
        name: "description",
        content:
          "AI-powered workplace productivity: email writer, meeting summarizer, task planner, and research assistant.",
      },
    ],
  }),
  component: Index,
});

function Spinner() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}

function Index() {
  return (
    <div className="min-h-screen bg-slate-50 text-foreground flex flex-col">
      <header className="bg-primary text-primary-foreground shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-3">
          <Sparkles className="h-7 w-7" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              WorkSmart AI Assistant
            </h1>
            <p className="text-xs sm:text-sm opacity-80">
              Your AI-powered workplace productivity companion
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full h-auto gap-1">
            <TabsTrigger value="email" className="gap-2 py-2">
              <Mail className="h-4 w-4" /> Email
            </TabsTrigger>
            <TabsTrigger value="meeting" className="gap-2 py-2">
              <FileText className="h-4 w-4" /> Meeting
            </TabsTrigger>
            <TabsTrigger value="planner" className="gap-2 py-2">
              <ListChecks className="h-4 w-4" /> Planner
            </TabsTrigger>
            <TabsTrigger value="research" className="gap-2 py-2">
              <Lightbulb className="h-4 w-4" /> Research
            </TabsTrigger>
            <TabsTrigger value="copywriter" className="gap-2 py-2">
              <PenLine className="h-4 w-4" /> Copywriter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-6">
            <EmailGenerator />
          </TabsContent>
          <TabsContent value="meeting" className="mt-6">
            <MeetingSummarizer />
          </TabsContent>
          <TabsContent value="planner" className="mt-6">
            <TaskPlanner />
          </TabsContent>
          <TabsContent value="research" className="mt-6">
            <ResearchAssistant />
          </TabsContent>
          <TabsContent value="copywriter" className="mt-6">
            <Copywriter />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs sm:text-sm text-muted-foreground">
          AI-generated content should be reviewed before use. Results may vary.
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

/* ---------------- 1. Email Generator ---------------- */
function EmailGenerator() {
  const [recipientType, setRecipientType] = useState<"Client" | "Manager" | "Team">("Client");
  const [tone, setTone] = useState<"Formal" | "Informal" | "Persuasive">("Formal");
  const [subject, setSubject] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!subject.trim() || !keyPoints.trim()) {
      toast.error("Please fill subject and key points.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateEmail({
        data: { recipientType, tone, subject, keyPoints },
      });
      setResult(res.email);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate email.");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(result);
    toast.success("Email copied to clipboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Email Generator</CardTitle>
        <CardDescription>
          Generate professional emails tailored to your recipient and tone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Recipient type</Label>
            <Select value={recipientType} onValueChange={(v) => setRecipientType(v as never)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Client">Client</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as never)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Informal">Informal</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            maxLength={200}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Project update for Q4 launch"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kp">Key points to include</Label>
          <Textarea
            id="kp"
            rows={5}
            value={keyPoints}
            maxLength={2000}
            onChange={(e) => setKeyPoints(e.target.value)}
            placeholder="• Timeline update&#10;• Budget approved&#10;• Next steps"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={run} disabled={loading}>
            {loading ? <Spinner /> : <Mail className="h-4 w-4" />}
            <span className="ml-2">{loading ? "Generating…" : "Generate Email"}</span>
          </Button>
          {result && (
            <Button variant="outline" onClick={run} disabled={loading}>
              <RefreshCw className="h-4 w-4" /> <span className="ml-2">Regenerate</span>
            </Button>
          )}
        </div>

        {result && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Generated email</Label>
              <Button size="sm" variant="ghost" onClick={copy}>
                <Copy className="h-4 w-4" /> <span className="ml-1">Copy</span>
              </Button>
            </div>
            <Textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              rows={14}
              className="font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------- 2. Meeting Summarizer ---------------- */
type MeetingResult = {
  summary: string;
  decisions: string[];
  actionItems: { task: string; owner: string }[];
  deadlines: string[];
};

function MeetingSummarizer() {
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
      toast.error(e instanceof Error ? e.message : "Failed to summarize.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Notes Summarizer</CardTitle>
        <CardDescription>
          Paste raw meeting notes and extract a structured summary, decisions, action items, and deadlines.
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
          <span className="ml-2">{loading ? "Summarizing…" : "Summarize"}</span>
        </Button>

        {result && (
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <Section title="Summary">
              <p className="text-sm whitespace-pre-wrap">{result.summary}</p>
            </Section>
            <Section title="Key Decisions">
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {result.decisions.map((d, i) => <li key={i}>{d}</li>)}
                {result.decisions.length === 0 && <li className="text-muted-foreground">None identified</li>}
              </ul>
            </Section>
            <Section title="Action Items">
              <ul className="space-y-2 text-sm">
                {result.actionItems.map((a, i) => (
                  <li key={i} className="flex justify-between gap-2 border-b pb-1">
                    <span>{a.task}</span>
                    <span className="font-medium text-primary whitespace-nowrap">{a.owner}</span>
                  </li>
                ))}
                {result.actionItems.length === 0 && <li className="text-muted-foreground">None identified</li>}
              </ul>
            </Section>
            <Section title="Deadlines">
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {result.deadlines.map((d, i) => <li key={i}>{d}</li>)}
                {result.deadlines.length === 0 && <li className="text-muted-foreground">None mentioned</li>}
              </ul>
            </Section>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="font-semibold text-primary mb-2">{title}</h3>
      {children}
    </div>
  );
}

/* ---------------- 3. Task Planner ---------------- */
type PlanResult = {
  schedule: { timeBlock: string; task: string; notes: string }[];
  tips: string[];
};

function TaskPlanner() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState(8);
  const [priority, setPriority] = useState<"Urgency" | "Importance" | "Balanced">("Balanced");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);

  async function run() {
    if (!tasks.trim()) {
      toast.error("Please enter at least one task.");
      return;
    }
    setLoading(true);
    try {
      const res = await planTasks({ data: { tasks, hours, priority } });
      setResult(res as PlanResult);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Task Planner</CardTitle>
        <CardDescription>
          Turn your task list into a structured daily plan with time blocks and tips.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tasks (one per line)</Label>
          <Textarea
            rows={6}
            value={tasks}
            maxLength={5000}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="Write Q4 report&#10;Reply to client emails&#10;Prep slides for Friday"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Available hours per day</Label>
            <Input
              type="number"
              min={1}
              max={24}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Priority preference</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as never)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Urgency">Urgency</SelectItem>
                <SelectItem value="Importance">Importance</SelectItem>
                <SelectItem value="Balanced">Balanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={run} disabled={loading}>
          {loading ? <Spinner /> : <ListChecks className="h-4 w-4" />}
          <span className="ml-2">{loading ? "Planning…" : "Generate Plan"}</span>
        </Button>

        {result && (
          <div className="space-y-4 mt-4">
            <div className="rounded-lg border bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="text-left px-3 py-2 w-40">Time</th>
                    <th className="text-left px-3 py-2">Task</th>
                    <th className="text-left px-3 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((s, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2 font-medium whitespace-nowrap">{s.timeBlock}</td>
                      <td className="px-3 py-2">{s.task}</td>
                      <td className="px-3 py-2 text-muted-foreground">{s.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Section title="Productivity tips">
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {result.tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </Section>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------- 4. Research Assistant ---------------- */
type ResearchResult = {
  summary: string;
  insights: string[];
  recommendation: string;
};

function ResearchAssistant() {
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
      toast.error(e instanceof Error ? e.message : "Failed to research.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Research Assistant</CardTitle>
        <CardDescription>
          Enter a topic, paste an article, or ask a question — get a plain-language summary, insights, and a next step.
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
          <span className="ml-2">{loading ? "Researching…" : "Analyze"}</span>
        </Button>

        {result && (
          <div className="grid gap-4 mt-4">
            <Section title="Summary">
              <p className="text-sm whitespace-pre-wrap">{result.summary}</p>
            </Section>
            <Section title="Key insights">
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {result.insights.map((i, idx) => <li key={idx}>{i}</li>)}
              </ul>
            </Section>
            <Section title="Recommended next step">
              <p className="text-sm whitespace-pre-wrap">{result.recommendation}</p>
            </Section>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
