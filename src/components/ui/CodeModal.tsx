'use client';

import { useState } from 'react';
import Modal from './Modal';
import { useFlowStore } from '@/store/flowStore';
import { Copy, Check } from 'lucide-react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CodeModal({ isOpen, onClose }: CodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'chatkit' | 'sdk'>('chatkit');
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);

  const workflowJson = JSON.stringify({ nodes, edges }, null, 2);

  const chatkitCode = `import { ChatKit } from '@openai/chatkit-react'

// Use the published workflow ID
const workflowId = "wf_${Date.now().toString(36)}"

export default function AgentChat() {
  return (
    <ChatKit
      workflowId={workflowId}
      style={{ width: '100%', height: '600px' }}
    />
  )
}`;

  const sdkCode = `import { AgentBuilder } from 'openai'

const client = new AgentBuilder()

// Run the workflow with input
const result = await client.runs.create({
  workflow_id: "wf_${Date.now().toString(36)}",
  input: {
    messages: [
      { role: "user", content: "Hello!" }
    ]
  }
})

console.log(result.output)`;

  const activeCode = activeTab === 'chatkit' ? chatkitCode : sdkCode;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Code" maxWidth="max-w-3xl">
      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
        <button
          onClick={() => setActiveTab('chatkit')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'chatkit'
              ? 'bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          ChatKit (Recommended)
        </button>
        <button
          onClick={() => setActiveTab('sdk')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'sdk'
              ? 'bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          Agents SDK
        </button>
      </div>

      {/* Code block */}
      <div className="relative">
        <pre className="p-4 rounded-xl bg-zinc-900 text-zinc-100 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
          {activeCode}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Workflow JSON */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Workflow Definition (JSON)</h3>
        <pre className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono overflow-x-auto max-h-48 text-zinc-600 dark:text-zinc-400">
          {workflowJson}
        </pre>
      </div>
    </Modal>
  );
}
