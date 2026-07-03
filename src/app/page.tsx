'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { useEffect } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import TopToolbar from '@/components/toolbar/TopToolbar';
import EditorCanvas from '@/components/canvas/EditorCanvas';
import PropertiesPanel from '@/components/panel/PropertiesPanel';
import CodeModal from '@/components/ui/CodeModal';
import PreviewModal from '@/components/ui/PreviewModal';
import DeployModal from '@/components/ui/DeployModal';
import { useFlowStore } from '@/store/flowStore';
import { useUIStore } from '@/store/uiStore';

function EditorContent() {
  const loadTemplate = useFlowStore((s) => s.loadTemplate);
  const nodes = useFlowStore((s) => s.nodes);
  const showCodeModal = useUIStore((s) => s.showCodeModal);
  const setShowCodeModal = useUIStore((s) => s.setShowCodeModal);
  const showPreviewModal = useUIStore((s) => s.showPreviewModal);
  const setShowPreviewModal = useUIStore((s) => s.setShowPreviewModal);
  const showDeployModal = useUIStore((s) => s.showDeployModal);
  const setShowDeployModal = useUIStore((s) => s.setShowDeployModal);
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);

  // Load template on first mount
  useEffect(() => {
    if (nodes.length === 0) {
      loadTemplate();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useFlowStore.getState().undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        useFlowStore.getState().redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        useFlowStore.getState().redo();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;
        useFlowStore.getState().deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <TopToolbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <EditorCanvas />
        {selectedNodeId && <PropertiesPanel />}
      </div>

      <CodeModal isOpen={showCodeModal} onClose={() => setShowCodeModal(false)} />
      <PreviewModal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} />
      <DeployModal isOpen={showDeployModal} onClose={() => setShowDeployModal(false)} />
    </div>
  );
}

export default function Home() {
  return (
    <ReactFlowProvider>
      <EditorContent />
    </ReactFlowProvider>
  );
}
