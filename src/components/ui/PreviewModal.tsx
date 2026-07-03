'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your agent. Ask me anything.' },
  ]);
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isRunning) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsRunning(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `[Preview] Simulated response. In production, "${userMessage}" would flow through: Query rewrite → Classify → Route to agent.`,
        },
      ]);
      setIsRunning(false);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Preview Workflow" maxWidth="max-w-lg">
      <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
              msg.role === 'user'
                ? 'bg-foreground text-background rounded-br-sm'
                : 'bg-muted text-foreground rounded-bl-sm'
            }`}>{msg.content}</div>
            {msg.role === 'user' && (
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}
        {isRunning && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="px-3 py-2 rounded-xl bg-muted rounded-bl-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        <button onClick={handleSend} disabled={!input.trim() || isRunning}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background hover:opacity-90 disabled:opacity-40 transition-opacity">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground text-center mt-2">Preview mode — responses are simulated.</p>
    </Modal>
  );
}
