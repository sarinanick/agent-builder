import { create } from 'zustand';

interface UIState {
  selectedNodeId: string | null;
  searchQuery: string;
  collapsedCategories: string[];
  projectName: string;
  showCodeModal: boolean;
  showPreviewModal: boolean;
  showDeployModal: boolean;
  setSelectedNodeId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleCategory: (categoryId: string) => void;
  setProjectName: (name: string) => void;
  setShowCodeModal: (show: boolean) => void;
  setShowPreviewModal: (show: boolean) => void;
  setShowDeployModal: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedNodeId: null,
  searchQuery: '',
  collapsedCategories: [],
  projectName: 'Homework helper',
  showCodeModal: false,
  showPreviewModal: false,
  showDeployModal: false,

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleCategory: (categoryId) =>
    set((state) => ({
      collapsedCategories: state.collapsedCategories.includes(categoryId)
        ? state.collapsedCategories.filter((c) => c !== categoryId)
        : [...state.collapsedCategories, categoryId],
    })),
  setProjectName: (name) => set({ projectName: name }),
  setShowCodeModal: (show) => set({ showCodeModal: show }),
  setShowPreviewModal: (show) => set({ showPreviewModal: show }),
  setShowDeployModal: (show) => set({ showDeployModal: show }),
}));
