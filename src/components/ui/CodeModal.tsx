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
      <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg">
        <button onClick={() => setActiveTab('chatkit')}
          className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'chatkit' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}>ChatKit</button>
        <button onClick={() => setActiveTab('sdk')}
          className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'sdk' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}>Agents SDK</button>
      </div>

      <div className="relative">
        <pre className="p-4 rounded-lg bg-background border border-border text-sm font-mono overflow-x-auto whitespace-pre-wrap text-foreground">
          {activeCode}
        </pre>
        <button onClick={handleCopy}
          className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted hover:bg-accent text-muted-foreground text-xs transition-colors">
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-xs font-medium text-muted-foreground mb-2">Workflow JSON</h3>
        <pre className="p-4 rounded-lg bg-background border border-border text-xs font-mono overflow-x-auto max-h-40 text-muted-foreground">
          {workflowJson}
        </pre>
      </div>
    </Modal>
  );
}
