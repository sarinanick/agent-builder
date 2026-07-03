'use client';

import { Database } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

export default function SetStateNode({ id, data, selected }: any) {
  return (
    <NodeWrapper id={id} data={data} selected={selected} icon={<Database className="h-3.5 w-3.5" />} iconColor="#0a84ff" label={data.label as string} sublabel="Set State" />
  );
}
