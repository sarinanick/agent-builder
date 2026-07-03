'use client';

import { Shield } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

export default function GuardrailsNode({ id, data, selected }: any) {
  return (
    <NodeWrapper id={id} data={data} selected={selected} icon={<Shield className="h-3.5 w-3.5" />} iconColor="#ff9f0a" label={data.label as string} sublabel="Guardrails" />
  );
}
