import { create } from 'zustand'

const STORAGE_KEY = 'nexo-workspace-name'

export const useWorkspace = create((set) => ({
  favoriteIds: [],
  taskFilter: 'all',
  toggleFavorite: (projectId) =>
    set((state) => {
      const exists = state.favoriteIds.includes(projectId)
      return {
        favoriteIds: exists
          ? state.favoriteIds.filter((id) => id !== projectId)
          : [...state.favoriteIds, projectId],
      }
    }),
  setTaskFilter: (value) => set({ taskFilter: value }),
}))

export const usePreferredWorkspace = create((set) => ({
  workspaceName: localStorage.getItem(STORAGE_KEY) || 'Estudio Norte',
  saveWorkspaceName: (value) => {
    const name = value.trim()
    if (!name) throw new Error('Escribe un nombre de espacio de trabajo válido')
    localStorage.setItem(STORAGE_KEY, name)
    set({ workspaceName: name })
  },
}))