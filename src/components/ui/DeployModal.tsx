'use client';

import Modal from './Modal';
import { Globe, Server, Download, ExternalLink } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeployModal({ isOpen, onClose }: DeployModalProps) {
  const { lang } = useI18n();

  const options = [
    { icon: Globe, title: lang === 'fa' ? 'استقرار در Vercel' : 'Deploy to Vercel', description: lang === 'fa' ? 'استقرار یک‌کلیکی در Vercel' : 'One-click deployment to Vercel', badge: lang === 'fa' ? 'پیشنهادی' : 'Recommended' },
    { icon: Server, title: lang === 'fa' ? 'میزبانی شخصی' : 'Self-hosted', description: lang === 'fa' ? 'استقرار روی زیرساخت خودتان' : 'Deploy on your own infrastructure', badge: null },
    { icon: Download, title: lang === 'fa' ? 'دانلود کد' : 'Download Code', description: lang === 'fa' ? 'خروجی کد و استقرار هر جا' : 'Export and deploy anywhere', badge: null },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lang === 'fa' ? 'استقرار workflow' : 'Deploy Workflow'}>
      <div className="space-y-2">
        {options.map((option) => (
          <button key={option.title}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-xl transition-all hover:shadow-lg text-left group"
            style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
              <option.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{option.title}</span>
                {option.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-md" style={{ background: 'var(--accent)', color: 'var(--muted-foreground)' }}>
                    {option.badge}
                  </span>
                )}
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{option.description}</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--muted-foreground)' }} />
          </button>
        ))}
      </div>
      <div className="mt-3 p-2.5 rounded-xl" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
        <p className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
          {lang === 'fa' ? 'قبل از استقرار، یک نسخه منتشر کنید.' : 'Publish a version before deploying.'}
        </p>
      </div>
    </Modal>
  );
}
