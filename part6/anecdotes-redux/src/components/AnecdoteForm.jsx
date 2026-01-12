import {useDispatch} from 'react-redux'
import {createAnecdote} from '../reducers/anecdoteReducer'
import {setNotification, resetNotification} from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(setNotification({content: `You created ${content}`, error: false}))
    setTimeout(() => dispatch(resetNotification()), 5000)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote"/>
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </>
  )
}

export default AnecdoteForm