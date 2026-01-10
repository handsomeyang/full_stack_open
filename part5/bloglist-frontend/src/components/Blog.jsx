import { useState } from 'react'

const Blog = ({ blog, user, bumpLikes, removeBlog }) => {
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const label = visible ? 'hide' : 'view'

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{label}</button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div className="likesCount">
          likes {blog.likes} <button onClick={bumpLikes}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.username === user.username ? <button onClick={removeBlog}>remove</button> : null}
      </div>
    </div>
  )
}

export default Blog