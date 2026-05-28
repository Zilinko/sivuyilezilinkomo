import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Copy, RefreshCw, Mail } from "lucide-react";

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
import { generateEmail } from "@/lib/api/ai.functions";

export const Route = createFileRoute("/email")({
  component: EmailPage,
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkSmart AI Assistant" },
      {
        name: "description",
        content:
          "Generate professional emails tailored to your recipient and tone.",
      },
    ],
  }),
});

function Spinner() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}

function EmailPage() {
  const [recipientType, setRecipientType] = useState<
    "Client" | "Manager" | "Team"
  >("Client");
  const [tone, setTone] = useState<"Formal" | "Informal" | "Persuasive">(
    "Formal",
  );
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
      toast.error(
        e instanceof Error ? e.message : "Failed to generate email.",
      );
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(result);
    toast.success("Email copied to clipboard");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Smart Email Generator
        </h1>
        <p className="text-muted-foreground">
          Generate professional emails tailored to your recipient and tone.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose Email</CardTitle>
          <CardDescription>
            Fill in the details and let AI craft a professional email for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Recipient type</Label>
              <Select
                value={recipientType}
                onValueChange={(v) => setRecipientType(v as never)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select
                value={tone}
                onValueChange={(v) => setTone(v as never)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
              placeholder="&#8226; Timeline update&#10;&#8226; Budget approved&#10;&#8226; Next steps"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={run} disabled={loading}>
              {loading ? <Spinner /> : <Mail className="h-4 w-4" />}
              <span className="ml-2">
                {loading ? "Generating…" : "Generate Email"}
              </span>
            </Button>
            {result && (
              <Button variant="outline" onClick={run} disabled={loading}>
                <RefreshCw className="h-4 w-4" />{" "}
                <span className="ml-2">Regenerate</span>
              </Button>
            )}
          </div>

          {result && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between items-center">
                <Label>Generated email</Label>
                <Button size="sm" variant="ghost" onClick={copy}>
                  <Copy className="h-4 w-4" />{" "}
                  <span className="ml-1">Copy</span>
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
    </div>
  );
}
