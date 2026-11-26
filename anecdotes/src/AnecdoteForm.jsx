import { useAnecdoteActions } from './store'

const getId = () => (100000 * Math.random()).toFixed(0)

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()

  const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    add({ id: getId(), content, votes: 0 })
    e.target.reset()
  }

  return (
      <form onSubmit={addAnecdote}>
        <div>
          <input data-testid="new" name="anecdote"/>
        </div>
        <button type="submit">create</button>
      </form> 
  )
}

export default AnecdoteForm
