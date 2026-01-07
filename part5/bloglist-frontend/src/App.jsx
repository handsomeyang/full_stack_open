import {useState, useEffect, useRef} from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => a.likes - b.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({username, password})

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')

      setErrorMessage({content: `${user.name} logged in`, error: false})
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch {
      setErrorMessage({content: 'wrong credentials', error: true})
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    try {
      setErrorMessage({content: `${user.name} logged out`, error: false})
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
      blogService.setToken(null)
    } catch {
      setErrorMessage({content: `error logging out ${user.name}`, error: true})
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleCreation = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      setErrorMessage({content: `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`, error: false})
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage({content: error.response.data.error, error: true})
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={handleCreation} />
    </Togglable>
  )

  const bumpLikesOf = id => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = {...blog, likes: blog.likes + 1}

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id === id ? returnedBlog : blog))
      })
      .catch(() => {
        setErrorMessage(
          `Blog '${blog.title}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setBlogs(blogs.filter(n => n.id !== id))
      })
  }

  const removeBlogOf = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {

      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(n => n.id !== blog.id))

        setErrorMessage({content: `Blog ${blog.title} by ${blog.author} removed`, error: false})
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      } catch (error) {
        setErrorMessage({content: error.response.data.error, error: true})
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  return (
    <div>
      <Notification message={errorMessage}/>

      {!user && loginForm()}
      {user && (
        <div>
          <h2>Blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} user={user} bumpLikes={() => bumpLikesOf(blog.id)} removeBlog={() => removeBlogOf(blog)} />
          )}
        </div>
      )}
    </div>
  )
}

export default App