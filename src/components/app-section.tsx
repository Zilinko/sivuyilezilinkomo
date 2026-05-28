import { cn } from "@/lib/utils";

interface AppSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function AppSection({ title, children, className }: AppSectionProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      <h3 className="font-semibold text-primary mb-2">{title}</h3>
      {children}
    </div>
  );
}
