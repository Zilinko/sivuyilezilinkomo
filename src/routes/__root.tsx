import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Zap,
  Mail,
  FileText,
  ListChecks,
  Lightbulb,
  PenLine,
  MessageSquare,
} from "lucide-react";

import appCss from "../styles.css?url";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", href: "/", icon: Zap },
  { title: "Email Generator", href: "/email", icon: Mail },
  { title: "Meeting Notes", href: "/meeting", icon: FileText },
  { title: "Task Planner", href: "/planner", icon: ListChecks },
  { title: "Research", href: "/research", icon: Lightbulb },
  { title: "Copywriter", href: "/copywriter", icon: PenLine },
  { title: "AI Chat", href: "/chat", icon: MessageSquare },
];

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn&apos;t load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "WorkSmart AI Assistant" },
      {
        name: "description",
        content:
          "WorkSmart AI Assistant streamlines workplace tasks with AI-powered tools for email, notes, planning, research, writing, and chat.",
      },
      { name: "author", content: "Lovable" },
      {
        property: "og:title",
        content: "WorkSmart AI Assistant",
      },
      {
        property: "og:description",
        content:
          "WorkSmart AI Assistant streamlines workplace tasks with AI-powered tools for email, notes, planning, research, writing, and chat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      {
        name: "twitter:title",
        content: "WorkSmart AI Assistant",
      },
      {
        name: "twitter:description",
        content:
          "WorkSmart AI Assistant streamlines workplace tasks with AI-powered tools for email, notes, planning, research, writing, and chat.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0994f6b7-1b18-4fa4-af17-dcdf54af63c2/id-preview-1f23dd2c--3e96f91a-593c-4031-87cc-c420809ae641.lovable.app-1779953154889.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0994f6b7-1b18-4fa4-af17-dcdf54af63c2/id-preview-1f23dd2c--3e96f91a-593c-4031-87cc-c420809ae641.lovable.app-1779953154889.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-svh">
        <div className="hidden md:block w-64 shrink-0 border-r bg-sidebar" />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">{children}</div>
          <footer className="border-t px-6 py-3 text-xs text-muted-foreground">
            AI-generated content should be reviewed before use. Results may
            vary.
          </footer>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            <span className="font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              WorkSmart AI
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link to={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 py-2 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
            AI-generated content should be reviewed before use.
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm text-muted-foreground hidden sm:inline">
            WorkSmart AI Assistant
          </span>
        </header>
        <div className="flex-1 p-6 overflow-auto">{children}</div>
        <footer className="border-t px-6 py-3 text-xs text-muted-foreground">
          AI-generated content should be reviewed before use. Results may
          vary.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell>
        <Outlet />
      </AppShell>
    </QueryClientProvider>
  );
}
