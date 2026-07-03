'use client';

import { useState } from 'react';
import Modal from './Modal';
import { useFlowStore } from '@/store/flowStore';
import { Copy, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CodeModal({ isOpen, onClose }: CodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'chatkit' | 'sdk'>('chatkit');
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const { lang } = useI18n();

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
    <Modal isOpen={isOpen} onClose={onClose} title={lang === 'fa' ? 'خروجی کد' : 'Export Code'} maxWidth="max-w-3xl">
      <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: 'var(--secondary)' }}>
        <button onClick={() => setActiveTab('chatkit')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'chatkit' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
          {lang === 'fa' ? 'ChatKit (پیشنهادی)' : 'ChatKit (Recommended)'}
        </button>
        <button onClick={() => setActiveTab('sdk')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'sdk' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
          Agents SDK
        </button>
      </div>

      <div className="relative">
        <pre className="p-4 rounded-xl text-sm font-mono overflow-x-auto whitespace-pre-wrap" style={{ background: 'var(--secondary)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
          {activeCode}
        </pre>
        <button onClick={handleCopy}
          className="absolute top-3 right-3 btn-ios btn-ios-secondary !text-xs !px-2.5 !py-1 !rounded-lg">
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? (lang === 'fa' ? 'کپی شد' : 'Copied') : (lang === 'fa' ? 'کپی' : 'Copy')}
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>{lang === 'fa' ? 'JSON workflow' : 'Workflow JSON'}</h3>
        <pre className="p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-40" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
          {workflowJson}
        </pre>
      </div>
    </Modal>
  );
}
