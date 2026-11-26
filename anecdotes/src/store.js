
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'
import { useNotificationStore } from './notificationStore'

export const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))

      useNotificationStore
        .getState()
        .actions.showNotification(`New anecdote '${newAnecdote.content}' created!`, 5)
    },

    vote: async (id) => {
      const anecdote = get().anecdotes.find(n => n.id === id)
      const updated = await anecdoteService.update(id, { ...anecdote, votes: anecdote.votes + 1 })
      set(state => ({
        anecdotes: state.anecdotes.map(n => n.id === id ? updated : n)
      }))

      useNotificationStore
        .getState()
        .actions.showNotification(`you voted '${anecdote.content}'`, 5)
    },

    remove: async (id) => {
      const anecdote = get().anecdotes.find(n => n.id === id)
      await anecdoteService.remove(id)
      set(state => ({
        anecdotes: state.anecdotes.filter(n => n.id !== id)
      }))

      useNotificationStore
        .getState()
        .actions.showNotification(`Anecdote '${anecdote?.content}' deleted`, 5)
    },

    setFilter: value => set(() => ({ filter: value })),
      initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
        set(() => ({ anecdotes }))
    }
  }
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  return anecdotes.filter(anecdote => 
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  ).sort((a, b) => b.votes - a.votes)
}

export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
