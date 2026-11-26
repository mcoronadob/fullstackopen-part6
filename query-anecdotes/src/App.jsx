import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {
  const { anecdotes, isPending, isError, voteAnecdote } = useAnecdotes()

  const handleVote = (anecdote) => {
    voteAnecdote(anecdote)
  }

  if (isPending) {
    return <div>loading data...</div>
  }else if (isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  return (
    <div>

      <AnecdoteForm />
      <Notification />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <span>{anecdote.content}</span>{' '}
          <span>has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </span>
        </div>
      ))}
    </div>
  )
}

export default App