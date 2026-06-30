import { create } from 'zustand'

export type Appearance = 'light' | 'dark' | 'system'
export type ResolvedAppearance = 'light' | 'dark'

interface AppearanceState {
  appearance: Appearance
  resolvedAppearance: ResolvedAppearance
  setAppearance: (appearance: Appearance) => void
  setResolvedAppearance: (resolvedAppearance: ResolvedAppearance) => void
}

const STORAGE_KEY = 'geowork.appearance'

function getSystemAppearance(): ResolvedAppearance {
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function getInitialAppearance(): Appearance {
  if (typeof window === 'undefined') return 'system'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
  return 'system'
}

const initialAppearance = getInitialAppearance()

export const useAppearanceStore = create<AppearanceState>((set) => ({
  appearance: initialAppearance,
  resolvedAppearance:
    initialAppearance === 'system' ? getSystemAppearance() : initialAppearance,

  setAppearance: (appearance) => {
    window.localStorage.setItem(STORAGE_KEY, appearance)
    set({
      appearance,
      resolvedAppearance:
        appearance === 'system' ? getSystemAppearance() : appearance,
    })
  },

  setResolvedAppearance: (resolvedAppearance) => {
    set({ resolvedAppearance })
  },
}))
