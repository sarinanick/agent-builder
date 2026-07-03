export interface WorkflowVersion {
  id: string;
  number: number;
  name: string;
  status: 'draft' | 'production' | 'archived';
  createdAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  versions: WorkflowVersion[];
  currentVersion: number;
}
