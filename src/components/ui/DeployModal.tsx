'use client';

import Modal from './Modal';
import { Globe, Server, Download, ExternalLink } from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeployModal({ isOpen, onClose }: DeployModalProps) {
  const options = [
    {
      icon: Globe,
      title: 'Deploy to Vercel',
      description: 'One-click deployment to Vercel with serverless functions',
      color: '#000',
      badge: 'Recommended',
    },
    {
      icon: Server,
      title: 'Self-hosted',
      description: 'Deploy on your own infrastructure using Docker or Node.js',
      color: '#3b82f6',
      badge: null,
    },
    {
      icon: Download,
      title: 'Download Code',
      description: 'Export the workflow code and deploy anywhere',
      color: '#22c55e',
      badge: null,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deploy Workflow">
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.title}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-all text-left group"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white shrink-0"
              style={{ backgroundColor: option.color }}
            >
              <option.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {option.title}
                </span>
                {option.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-500 rounded-full">
                    {option.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {option.description}
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors shrink-0" />
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>Note:</strong> You need to publish a version before deploying. Click the version dropdown and select &quot;Publish&quot; to create a deployable version.
        </p>
      </div>
    </Modal>
  );
}
