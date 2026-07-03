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
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useFlowStore } from '@/store/flowStore';
import ThemeToggle from './ThemeToggle';
import { useState, useRef, useEffect } from 'react';

const VERSIONS = [
  { number: 1, name: 'v1', status: 'production' as const },
  { number: 2, name: 'v2', status: 'draft' as const },
  { number: 3, name: 'v3', status: 'archived' as const },
];

export default function TopToolbar() {
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
    <div className="flex items-center justify-between h-12 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 bg-transparent border-none outline-none focus:ring-0 px-1 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors max-w-[200px]"
        />

        {/* Version dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowVersionDropdown(!showVersionDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            {selectedVersion.name} · {selectedVersion.status}
            <ChevronDown className="h-3 w-3" />
          </button>

          {showVersionDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 py-1">
              {VERSIONS.map((v) => (
                <button
                  key={v.number}
                  onClick={() => {
                    setSelectedVersion(v);
                    setShowVersionDropdown(false);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                >
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {v.name} · {v.status}
                  </span>
                  {v.number === selectedVersion.number && (
                    <Check className="h-4 w-4 text-blue-500" />
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
          className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1.5">
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <Settings className="h-4 w-4" />
        </button>

        <ThemeToggle />

        <button
          onClick={() => setShowCodeModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Code className="h-4 w-4" />
          Code
        </button>

        <button
          onClick={() => setShowPreviewModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-800 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        >
          <Play className="h-4 w-4" />
          Preview
        </button>

        <button
          onClick={() => setShowDeployModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <Rocket className="h-4 w-4" />
          Deploy
        </button>
      </div>
    </div>
  );
}
