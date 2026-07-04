'use client';

import { useI18n } from '@/lib/i18n';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
}: ConfirmationDialogProps) {
  const { lang } = useI18n();

  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
    info: 'bg-blue-500 hover:bg-blue-600',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'oklch(0% 0 0 / 0.5)' }} onClick={onClose}>
      <div
        className="w-full max-w-md p-6 rounded-xl animate-scaleIn"
        style={{ background: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-raised)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ background: 'var(--surface-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
          >
            {cancelLabel || (lang === 'fa' ? 'لغو' : 'Cancel')}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors ${variantStyles[variant]}`}
          >
            {confirmLabel || (lang === 'fa' ? 'تأیید' : 'Confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
