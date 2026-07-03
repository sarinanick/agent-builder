'use client';

import { FileSearch } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

export default function FileSearchNode({ id, data, selected }: any) {
  return (
    <NodeWrapper id={id} data={data} selected={selected} icon={<FileSearch className="h-3.5 w-3.5" />} iconColor="#ff9f0a" label={data.label as string} sublabel="File Search" />
  );
}
