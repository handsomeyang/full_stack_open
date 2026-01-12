import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import {setNotification, resetNotification} from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  })

  const sortedAnecdotes = useMemo(() => {
    console.log('Re-sorting anecdotes')
    return [...anecdotes].sort((a, b) => b.votes - a.votes)
  }, [anecdotes])

  return (
    <>
      <h2>Anecdotes</h2>
      {sortedAnecdotes.map(anecdote => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(voteAnecdote(anecdote))
            dispatch(setNotification({content: `You voted ${anecdote.content}`, error: false}))
            setTimeout(() => dispatch(resetNotification()), 5000)
          }}
        />
      ))}
    </>
  )
}

export default AnecdoteList