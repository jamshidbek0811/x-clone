import { create } from 'zustand'

interface RegisterModalState {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

const useEditModal = create<RegisterModalState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useEditModal