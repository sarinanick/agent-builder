'use client';

import { Square } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

export default function EndNode({ id, data, selected }: any) {
  return (
    <NodeWrapper id={id} data={data} selected={selected} icon={<Square className="h-3 w-3" />} iconColor="#30d158" label="End" sublabel="Exit point" hasOutput={false} />
  );
}
