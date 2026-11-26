import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests'
import { useNotify } from './useNotify'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotify()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1
  })

  const newAnecdotesMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) ?? []
      queryClient.setQueryData(['anecdotes'], (anecdotes ?? []).concat(newAnecdote))
      notify(`anecdote '${newAnecdote.content}' created`)
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'error creating anecdote'

      notify(errorMessage)
    }
  })

  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const currentAnecdotes = queryClient.getQueryData(['anecdotes']) ?? []
      queryClient.setQueryData(
        ['anecdotes'],
        currentAnecdotes.map((a) =>
          a.id === updatedAnecdote.id ? updatedAnecdote : a
        )
      )
      notify(`anecdote '${updatedAnecdote.content}' voted`)
    },
    onError: (error) => {
      notify(error?.message || 'error voting anecdote')
    }
  })

  return {
    anecdotes: result.data ?? [],
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content) => newAnecdotesMutation.mutate({ content, votes: 0 }),
    voteAnecdote: (anecdote) => voteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }),
  }
}
