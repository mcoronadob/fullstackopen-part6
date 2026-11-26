import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'
import { useAnecdoteStore } from './store'
import anecdoteService from './services/anecdotes'
import AnecdoteList from './AnecdoteList'

// Interceptamos el servicio para no depender de json-server
vi.mock('./services/anecdotes')

// --- EJERCICIO 14 (Paso 11): Inicialización desde el backend ---
describe('anecdoteStore', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.clearAllMocks()
  })

  test('el estado se inicializa con las anécdotas devueltas por el backend', async () => {
    const mockAnecdotes = [
      { id: '1', content: 'If it hurts, do it more often', votes: 0 },
      { id: '2', content: 'Premature optimization is the root of all evil', votes: 5 },
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    await useAnecdoteStore.getState().actions.initialize()

    const state = useAnecdoteStore.getState()
    expect(state.anecdotes).toHaveLength(2)
    expect(state.anecdotes).toEqual(mockAnecdotes)
    expect(anecdoteService.getAll).toHaveBeenCalledTimes(1)
  })
})

// --- EJERCICIOS 15 y 16 (Pasos 12 y 13): Ordenamiento y Filtrado en AnecdoteList ---
describe('AnecdoteList', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: '1', content: 'React is a great library', votes: 2 },
        { id: '2', content: 'Zustand makes state easy', votes: 15 },
        { id: '3', content: 'Learning react hooks', votes: 7 },
      ],
      filter: '',
    })
  })

  // Ejercicio 15 (Paso 12)
  test('muestra las anécdotas ordenadas de mayor a menor por votos', () => {
    render(<AnecdoteList />)

    const voteButtons = screen.getAllByRole('button', { name: /vote/i })
    const renderedAnecdotes = voteButtons.map(
      (btn) => btn.parentElement.parentElement.textContent
    )

    expect(renderedAnecdotes).toHaveLength(3)
    expect(renderedAnecdotes[0]).toContain('Zustand makes state easy') // 15 votos
    expect(renderedAnecdotes[1]).toContain('Learning react hooks')     // 7 votos
    expect(renderedAnecdotes[2]).toContain('React is a great library') // 2 votos
  })

  // Ejercicio 16 (Paso 13)
  test('muestra únicamente las anécdotas que coinciden con el filtro', () => {
    useAnecdoteStore.setState({ filter: 'REACT' })

    render(<AnecdoteList />)

    expect(screen.getByText('React is a great library')).toBeInTheDocument()
    expect(screen.getByText('Learning react hooks')).toBeInTheDocument()
    expect(screen.queryByText('Zustand makes state easy')).not.toBeInTheDocument()
  })

  // Ejercicio 17 (Paso 14): Votar aumenta los votos
  test('votar aumenta el número de votos de una anécdota', async () => {
    // 1. ARRANGE: Preparamos una anécdota con 5 votos en el store
    const anecdoteToVote = { id: '1', content: 'Anécdota para votar', votes: 5 }
    useAnecdoteStore.setState({
      anecdotes: [anecdoteToVote],
      filter: '',
    })

    // Simulamos la respuesta del backend al actualizar (sube de 5 a 6 votos)
    // (Si tu método en services/anecdotes.js se llama diferente a "update", cambia ".update" por ese nombre)
    if (anecdoteService.update) {
      anecdoteService.update.mockResolvedValue({ ...anecdoteToVote, votes: 6 })
    }

    render(<AnecdoteList />)

    // Verificamos que inicialmente tiene 5 votos en pantalla
    expect(screen.getByText(/has 5/i)).toBeInTheDocument()

    // 2. ACT: Simulamos que el usuario hace clic en el botón "vote"
    const voteButton = screen.getByRole('button', { name: /vote/i })
    fireEvent.click(voteButton)

    // 3. ASSERT: Esperamos a que se actualice el estado y verificamos que ahora muestra 6 votos
    expect(await screen.findByText(/has 6/i)).toBeInTheDocument()
    expect(useAnecdoteStore.getState().anecdotes[0].votes).toBe(6)
  })
})