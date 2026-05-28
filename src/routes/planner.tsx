import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ListChecks, Copy } from "lucide-react";

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
import { planTasks } from "@/lib/api/ai.functions";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkSmart AI Assistant" },
      {
        name: "description",
        content:
          "Turn your task list into a structured daily plan with time blocks and tips.",
      },
    ],
  }),
});

function Spinner() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}

type PlanResult = {
  schedule: { timeBlock: string; task: string; notes: string }[];
  tips: string[];
};

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState(8);
  const [priority, setPriority] = useState<"Urgency" | "Importance" | "Balanced">(
    "Balanced",
  );
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
      toast.error(
        e instanceof Error ? e.message : "Failed to plan.",
      );
    } finally {
      setLoading(false);
    }
  }

  function copySchedule() {
    if (!result) return;
    const text = result.schedule
      .map((s) => `${s.timeBlock}\t${s.task}\t${s.notes}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Schedule copied");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Task Planner</h1>
        <p className="text-muted-foreground">
          Turn your task list into a structured daily plan with time blocks and
          tips.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Your Day</CardTitle>
          <CardDescription>
            Enter your tasks and preferences to get an optimized schedule.
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
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as never)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
            <span className="ml-2">
              {loading ? "Planning…" : "Generate Plan"}
            </span>
          </Button>

          {result && (
            <div className="space-y-4 mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Your Schedule</Label>
                <Button size="sm" variant="ghost" onClick={copySchedule}>
                  <Copy className="h-4 w-4" />
                  <span className="ml-1">Copy schedule</span>
                </Button>
              </div>
              <div className="rounded-lg border bg-card overflow-hidden">
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
                        <td className="px-3 py-2 font-medium whitespace-nowrap">
                          {s.timeBlock}
                        </td>
                        <td className="px-3 py-2">{s.task}</td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {s.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <AppSection title="Productivity tips">
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {result.tips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </AppSection>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
