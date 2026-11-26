import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useCounterUnicafe = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    good: () => set(state => ({ good: state.good + 1 })),
    neutral: () => set(state => ({ neutral: state.neutral + 1 })),
    bad: () => set(state => ({ bad: state.bad + 1 })),
    zero: () => set({ good: 0, neutral: 0, bad: 0 })
  }
}))

export const useValues = () =>
  useCounterUnicafe(
    useShallow(state => ({
      good: state.good,
      neutral: state.neutral,
      bad: state.bad,
    }))
  )

export const useActions = () => useCounterUnicafe(state => state.actions)