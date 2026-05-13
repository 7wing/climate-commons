import { create } from 'zustand'

interface UIState {
  isMobileMenuOpen: boolean
  activeModal: string | null
  setMobileMenuOpen: (open: boolean) => void
  openModal: (modal: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  activeModal: null,
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}))