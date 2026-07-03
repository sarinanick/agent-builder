'use client';

import Modal from './Modal';
import { Globe, Server, Download, ExternalLink } from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeployModal({ isOpen, onClose }: DeployModalProps) {
  const options = [
    { icon: Globe, title: 'Deploy to Vercel', description: 'One-click deployment to Vercel', badge: 'Recommended' },
    { icon: Server, title: 'Self-hosted', description: 'Deploy on your own infrastructure', badge: null },
    { icon: Download, title: 'Download Code', description: 'Export and deploy anywhere', badge: null },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deploy Workflow">
      <div className="space-y-2">
        {options.map((option) => (
          <button key={option.title}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-border bg-background hover:bg-accent transition-colors text-left group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground shrink-0">
              <option.icon className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{option.title}</span>
                {option.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded-md">
                    {option.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </button>
        ))}
      </div>
      <div className="mt-3 p-2.5 rounded-lg bg-muted">
        <p className="text-[11px] text-muted-foreground">
          Publish a version before deploying. Click the version dropdown and select &quot;Publish&quot;.
        </p>
      </div>
    </Modal>
  );
}
