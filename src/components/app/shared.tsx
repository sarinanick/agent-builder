import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Inbox } from "lucide-react";

// ─── Empty State ───
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-shell-hover text-text-on-shell-muted mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-text-on-shell mb-1">{title}</h3>
      {description && <p className="text-xs text-text-on-shell-muted max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}

// ─── Section Title ───
interface SectionTitleProps {
  children: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, description, action, className }: SectionTitleProps) {
  return (
    <div className={cn("flex items-end justify-between gap-3 mb-3", className)}>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-text-on-shell">{children}</h2>
        {description && <p className="text-xs text-text-on-shell-muted mt-0.5">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ─── Panel ───
interface PanelProps {
  children: React.ReactNode;
  className?: string;
  surface?: "ivory" | "shell";
}

export function Panel({ children, className, surface = "shell" }: PanelProps) {
  return (
    <div className={cn("rounded-[var(--radius-card)] border shadow-[var(--shadow-soft)]", surface === "ivory" ? "bg-surface text-text-primary border-border" : "bg-shell text-text-on-shell border-border-shell", className)}>
      {children}
    </div>
  );
}

// ─── Status Badge ───
interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "success" | "warning" | "error" | "info";
}

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  return <Badge variant={variant}>{status}</Badge>;
}
