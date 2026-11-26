import { create } from 'zustand'

let timeoutId = null

export const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    showNotification: (message, seconds = 5) => {
      // Si ya había un temporizador corriendo, lo cancelamos para que no borre el nuevo mensaje antes de tiempo
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      set({ notification: message })

      timeoutId = setTimeout(() => {
        set({ notification: null })
        timeoutId = null
      }, seconds * 1000)
    }
  }
}))

export const useNotification = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)