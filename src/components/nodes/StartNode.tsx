'use client';

import { Play } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

export default function StartNode({ id, data, selected }: any) {
  return (
    <NodeWrapper id={id} data={data} selected={selected} icon={<Play className="h-3 w-3 fill-current" />} iconColor="#30d158" label="Start" sublabel="Entry point" hasInput={false} />
  );
}
