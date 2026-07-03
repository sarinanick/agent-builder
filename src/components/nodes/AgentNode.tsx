'use client';

import { Bot } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

export default function AgentNode({ id, data, selected }: any) {
  return (
    <NodeWrapper id={id} data={data} selected={selected} icon={<Bot className="h-3.5 w-3.5" />} iconColor="#bf5af2" label={data.label as string} sublabel="Agent" />
  );
}
