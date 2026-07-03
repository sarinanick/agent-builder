'use client';

import { Hand } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

export default function HumanApprovalNode({ id, data, selected }: any) {
  return (
    <NodeWrapper id={id} data={data} selected={selected} icon={<Hand className="h-3.5 w-3.5" />} iconColor="#ff9f0a" label={data.label as string} sublabel="Human Approval" />
  );
}
