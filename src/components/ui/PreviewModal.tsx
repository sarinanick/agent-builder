'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const { lang } = useI18n();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: lang === 'fa' ? 'سلام! من ایجنت شما هستم. هر سوالی دارید بپرسید.' : 'Hello! I\'m your agent. Ask me anything.' },
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
          content: `[Preview] ${lang === 'fa' ? 'پاسخ شبیه‌سازی شده. در حالت واقعی، "' + userMessage + '" از طریق: بازنویسی کوئری → طبقه‌بندی → مسیریابی به ایجنت پردازش می‌شد.` : 'Simulated response. In production, "' + userMessage + '" would flow through: Query rewrite → Classify → Route to agent.'}`,
        },
      ]);
      setIsRunning(false);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lang === 'fa' ? 'پیش‌نمایش workflow' : 'Preview Workflow'} maxWidth="max-w-lg">
      <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex h-7 w-7 items-center justify-center rounded-xl shrink-0" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
              msg.role === 'user'
                ? 'bg-foreground text-background rounded-br-md'
                : 'rounded-bl-md'
            }`} style={msg.role === 'assistant' ? { background: 'var(--secondary)', color: 'var(--foreground)' } : {}}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="flex h-7 w-7 items-center justify-center rounded-xl shrink-0" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}
        {isRunning && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="px-3 py-2 rounded-2xl rounded-bl-sm" style={{ background: 'var(--secondary)' }}>
              <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: 'var(--muted-foreground)' }} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={lang === 'fa' ? 'پیامی بنویسید...' : 'Type a message...'}
          className="panel-input flex-1 !h-10" />
        <button onClick={handleSend} disabled={!input.trim() || isRunning}
          className="btn-ios btn-ios-primary !h-10 !w-10 !px-0 !rounded-xl">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-[11px] text-center mt-2" style={{ color: 'var(--muted-foreground)' }}>
        {lang === 'fa' ? 'حالت پیش‌نمایش — پاسخ‌ها شبیه‌سازی شده‌اند.' : 'Preview mode — responses are simulated.'}
      </p>
    </Modal>
  );
}
