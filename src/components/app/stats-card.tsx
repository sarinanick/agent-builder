import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  note: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "teal" | "amber" | "blue" | "purple";
}

const ACCENT_CONFIG = {
  teal: { bg: "bg-accent-muted", text: "text-accent" },
  amber: { bg: "bg-warning/15", text: "text-warning" },
  blue: { bg: "bg-info/15", text: "text-info" },
  purple: { bg: "bg-purple-500/15", text: "text-purple-400" },
};

export function StatsCard({ label, value, note, icon: Icon, accent = "teal" }: StatsCardProps) {
  const config = ACCENT_CONFIG[accent];
  return (
    <div className="rounded-[var(--radius-card)] border border-border-shell bg-shell-hover p-4 transition-all hover:border-accent/40">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", config.bg, config.text)}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-text-on-shell tabular-nums">{value}</p>
        <p className="text-xs font-medium text-text-on-shell">{label}</p>
        <p className="text-[11px] text-text-on-shell-muted leading-relaxed">{note}</p>
      </div>
    </div>
  );
}
