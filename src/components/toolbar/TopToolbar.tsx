'use client';

import {
  Code,
  Play,
  Rocket,
  Undo2,
  Redo2,
  Settings,
  ChevronDown,
  Check,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import { useFlowStore } from '@/store/flowStore';
import ThemeToggle from './ThemeToggle';
import { useI18n } from '@/lib/i18n';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useState, useRef, useEffect } from 'react';

const VERSIONS = [
  { number: 1, name: 'v1', status: 'production' as const },
  { number: 2, name: 'v2', status: 'draft' as const },
  { number: 3, name: 'v3', status: 'archived' as const },
];

export default function TopToolbar() {
  const { lang } = useI18n();
  const projectName = useUIStore((s) => s.projectName);
  const setProjectName = useUIStore((s) => s.setProjectName);
  const setShowCodeModal = useUIStore((s) => s.setShowCodeModal);
  const setShowPreviewModal = useUIStore((s) => s.setShowPreviewModal);
  const setShowDeployModal = useUIStore((s) => s.setShowDeployModal);
  const undo = useFlowStore((s) => s.undo);
  const redo = useFlowStore((s) => s.redo);
  const canUndo = useFlowStore((s) => s.canUndo);
  const canRedo = useFlowStore((s) => s.canRedo);

  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(VERSIONS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowVersionDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="toolbar-ios flex items-center justify-between h-12 px-4">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="text-sm font-semibold text-foreground bg-transparent border-none outline-none focus:ring-0 px-1.5 py-0.5 rounded hover:bg-accent transition-colors max-w-[200px]"
        />

        {/* Version dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowVersionDropdown(!showVersionDropdown)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted-foreground border border-border hover:bg-accent transition-colors"
          >
            {selectedVersion.name} · {selectedVersion.status}
            <ChevronDown className="h-3 w-3" />
          </button>

          {showVersionDropdown && (
              <div
                className="absolute top-full left-0 mt-1 w-44 bg-popover border border-border rounded-lg shadow-lg z-50 py-1 animate-fadeIn"
              >
                {VERSIONS.map((v) => (
                  <button
                    key={v.number}
                    onClick={() => {
                      setSelectedVersion(v);
                      setShowVersionDropdown(false);
                    }}
                    className="flex items-center justify-between w-full px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                  >
                    <span className="text-foreground">
                      {v.name} · {v.status}
                    </span>
                    {v.number === selectedVersion.number && (
                      <Check className="h-3.5 w-3.5 text-foreground" />
                    )}
                  </button>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Center section */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="btn-3d btn-3d-secondary btn-3d-icon !w-8 !h-8 !p-0 disabled:opacity-25 disabled:cursor-not-allowed"
          title={lang === 'fa' ? 'بازگشت' : 'Undo'}
          aria-label={lang === 'fa' ? 'بازگشت' : 'Undo'}
        >
          <Undo2 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="btn-3d btn-3d-secondary btn-3d-icon !w-8 !h-8 !p-0 disabled:opacity-25 disabled:cursor-not-allowed"
          title={lang === 'fa' ? 'بازانجام' : 'Redo'}
          aria-label={lang === 'fa' ? 'بازانجام' : 'Redo'}
        >
          <Redo2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        <button className="btn-3d btn-3d-secondary btn-3d-icon !w-8 !h-8 !p-0"
          aria-label={lang === 'fa' ? 'تنظیمات' : 'Settings'}>
          <Settings className="h-3.5 w-3.5" />
        </button>

        <ThemeToggle />

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-shell)' }} />

        <button onClick={() => setShowCodeModal(true)}
          className="btn-3d btn-3d-secondary !text-xs !px-3 !py-1.5"
          aria-label={lang === 'fa' ? 'خروجی کد' : 'Export code'}>
          <Code className="h-3.5 w-3.5" />
          {lang === 'fa' ? 'کد' : 'Code'}
        </button>

        <button onClick={() => setShowPreviewModal(true)}
          className="btn-3d btn-3d-primary !text-xs !px-3 !py-1.5"
          aria-label={lang === 'fa' ? 'پیش‌نمایش' : 'Preview'}>
          <Play className="h-3 w-3 fill-current" />
          {lang === 'fa' ? 'پیش‌نمایش' : 'Preview'}
        </button>

        <Link href="/marketplace"
          className="btn-3d btn-3d-secondary !text-xs !px-3 !py-1.5 inline-flex"
          aria-label={lang === 'fa' ? 'بازار' : 'Marketplace'}>
          <Store className="h-3.5 w-3.5" />
          {lang === 'fa' ? 'بازار' : 'Marketplace'}
        </Link>

        <button onClick={() => setShowDeployModal(true)}
          className="btn-3d btn-3d-secondary !text-xs !px-3 !py-1.5"
          aria-label={lang === 'fa' ? 'استقرار' : 'Deploy'}>
          {lang === 'fa' ? 'استقرار' : 'Deploy'}
        </button>
      </div>
    </div>
  );
}
