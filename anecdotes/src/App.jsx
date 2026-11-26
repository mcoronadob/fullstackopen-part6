//import { useAnecdotes } from "./store"
import AnecdoteForm from './AnecdoteForm'
import AnecdoteList from './AnecdoteList'

const App = () => {
  //const anecdotes = useAnecdotes()

  // const vote = (id) => {
  //   console.log("vote", id)
  // }

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />

      <h2>create new</h2>
      <AnecdoteForm />


      {/* {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))} */}
      {/* <h2>create new</h2>
      <form>
        <div>
          <input data-testid="new" />
        </div>
        <button>create</button>
      </form> */}
    </div>
  )
}

export default App
