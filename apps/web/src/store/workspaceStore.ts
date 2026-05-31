import { create } from "zustand";

export interface WorkspaceMember {
  id: string;
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: "FREE" | "PRO" | "BUSINESS";
  ownerId: string;
  maxPostsPerMonth: number;
  monthlyPostCount: number;
  maxTeamMembers: number;
  createdAt: string;
  members?: WorkspaceMember[];
}

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  loading: boolean;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, name: string) => void;
  removeWorkspace: (id: string) => void;
  setLoading: (loading: boolean) => void;
  clearWorkspaces: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  activeWorkspace: null,
  loading: false,

  setWorkspaces: (workspaces) =>
    set({ workspaces, activeWorkspace: workspaces[0] ?? null }),

  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),

  addWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
      activeWorkspace: state.activeWorkspace ?? workspace,
    })),

  updateWorkspace: (id, name) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === id ? { ...ws, name } : ws
      ),
      activeWorkspace:
        state.activeWorkspace?.id === id
          ? { ...state.activeWorkspace, name }
          : state.activeWorkspace,
    })),

  removeWorkspace: (id) =>
    set((state) => {
      const filtered = state.workspaces.filter((ws) => ws.id !== id);
      return {
        workspaces: filtered,
        activeWorkspace:
          state.activeWorkspace?.id === id
            ? filtered[0] ?? null
            : state.activeWorkspace,
      };
    }),

  setLoading: (loading) => set({ loading }),

  clearWorkspaces: () => set({ workspaces: [], activeWorkspace: null }),
}));
