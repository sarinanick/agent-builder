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
    { role: 'assistant', content: 'Hello! I\'m your agent. Ask me anything and I\'ll help you with your homework.' },
  ]);
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isRunning) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsRunning(true);

    // Simulate agent response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `[Preview Mode] This is a simulated response from the workflow. In production, the workflow would process "${userMessage}" through the configured nodes (Query rewrite → Classify → Route to appropriate agent).`,
        },
      ]);
      setIsRunning(false);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Preview Workflow" maxWidth="max-w-xl">
      {/* Chat area */}
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 shrink-0">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {isRunning && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 rounded-bl-md">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message to test the workflow..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isRunning}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-zinc-400 text-center mt-3">
        This is a preview mode. Responses are simulated to demonstrate the workflow.
      </p>
    </Modal>
  );
}
