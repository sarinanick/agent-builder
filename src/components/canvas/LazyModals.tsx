'use client';

import dynamic from 'next/dynamic';

// Audit item #3: Lazy load modals
export const LazyCodeModal = dynamic(() => import('@/components/ui/CodeModal'), { ssr: false });
export const LazyPreviewModal = dynamic(() => import('@/components/ui/PreviewModal'), { ssr: false });
export const LazyDeployModal = dynamic(() => import('@/components/ui/DeployModal'), { ssr: false });

// Audit item #4: Lazy load node components
export const LazyAgentNode = dynamic(() => import('@/components/nodes/AgentNode'));
export const LazyConditionNode = dynamic(() => import('@/components/nodes/ConditionNode'));
export const LazyFileSearchNode = dynamic(() => import('@/components/nodes/FileSearchNode'));
export const LazyGuardrailsNode = dynamic(() => import('@/components/nodes/GuardrailsNode'));
export const LazyMcpNode = dynamic(() => import('@/components/nodes/McpNode'));
export const LazyWhileNode = dynamic(() => import('@/components/nodes/WhileNode'));
export const LazyHumanApprovalNode = dynamic(() => import('@/components/nodes/HumanApprovalNode'));
export const LazyTransformNode = dynamic(() => import('@/components/nodes/TransformNode'));
export const LazySetStateNode = dynamic(() => import('@/components/nodes/SetStateNode'));
