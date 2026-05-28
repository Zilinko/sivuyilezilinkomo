# WorkSmart AI Assistant

A modern, full-stack AI-powered workplace productivity web application built with [TanStack Start](https://tanstack.com/start), React, and Tailwind CSS. WorkSmart AI streamlines everyday professional tasks through a clean, responsive dashboard with six intelligent AI tools.

![WorkSmart AI](https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0994f6b7-1b18-4fa4-af17-dcdf54af63c2/id-preview-1f23dd2c--3e96f91a-593c-4031-87cc-c420809ae641.lovable.app-1779953154889.png)

## Features

### Smart Email Generator
Craft professional emails tailored to your recipient and tone. Select recipient type (Client, Manager, or Team), choose a tone (Formal, Informal, or Persuasive), enter a subject, and provide key points. The AI generates a polished, ready-to-send email that you can edit and copy.

### Meeting Notes Summarizer
Paste raw meeting notes and instantly extract a structured summary including key decisions, action items with owners, and deadlines. All outputs are editable so you can refine the results before sharing.

### AI Task Planner
Turn your task list into a structured daily plan. Enter your tasks, specify available hours, and choose a priority approach (Urgency, Importance, or Balanced). The AI generates a realistic schedule with time blocks and productivity tips.

### AI Research Assistant
Enter a topic, paste an article, or ask a question. The AI provides a plain-language summary, 3–5 key insights, and a recommended next step. Perfect for quickly understanding complex subjects.

### AI Copywriter
Paste any draft text and choose a goal — Clarify, Shorten, Lengthen, Persuade, Simplify, Formalize, or Casualize. Optionally specify your target audience and desired tone. The AI rewrites your copy and explains what changed.

### AI Chatbot
A real-time streaming chat interface for open-ended workplace questions. Ask about emails, meetings, planning, research, writing, or any work challenge and get instant AI assistance.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19 + Vite)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with CSS custom properties (oklch)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **AI**: [Lovable AI Gateway](https://ai.gateway.lovable.dev) with Google Gemini 3 Flash Preview
- **State**: React hooks, TanStack Query
- **Routing**: TanStack Router (file-based)
- **Server Functions**: TanStack Start `createServerFn`

## Project Structure

```
src/
  components/
    app-section.tsx        # Shared card component for feature outputs
    ui/                    # shadcn/ui components (button, card, sidebar, etc.)
  lib/
    ai-gateway.server.ts   # Lovable AI Gateway provider setup
    api/
      ai.functions.ts      # Server functions for all AI features
  routes/
    api/
      chat.ts              # Streaming chat API endpoint
    __root.tsx             # Root layout with sidebar navigation
    index.tsx              # Dashboard overview page
    email.tsx              # Smart Email Generator
    meeting.tsx            # Meeting Notes Summarizer
    planner.tsx            # AI Task Planner
    research.tsx           # AI Research Assistant
    copywriter.tsx         # AI Copywriter
    chat.tsx               # AI Chatbot (streaming)
  styles.css               # Tailwind entry + design tokens
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) or Node.js 20+
- A [Lovable AI Gateway](https://docs.lovable.dev) API key

### Installation

1. Clone the repository and install dependencies:

```bash
bun install
```

2. Set up environment variables by creating a `.env` file in the project root:

```env
LOVABLE_API_KEY=your_lovable_ai_gateway_key
```

3. Start the development server:

```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
bun run build
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LOVABLE_API_KEY` | Yes | Lovable AI Gateway API key for AI features |

## Key Design Decisions

- **Sidebar Navigation**: Collapsible sidebar built with shadcn/ui for a modern SaaS dashboard feel. Active route highlighting and tooltips on collapse.
- **Separate Routes**: Each feature lives in its own route file with dedicated metadata for SEO and deep linking.
- **Editable Outputs**: All AI-generated text outputs are rendered in editable textareas so users can refine before using.
- **Streaming Chat**: The chatbot uses a custom streaming implementation with `fetch` and `ReadableStream` for real-time AI responses.
- **Responsive Design**: Fully responsive layout that works on mobile (drawer sidebar) and desktop (persistent sidebar).

## Responsible AI

All AI-generated content includes a disclaimer and should be reviewed before use. Results may vary depending on prompt quality and model behavior.

## License

This project is built with [Lovable](https://lovable.dev).
