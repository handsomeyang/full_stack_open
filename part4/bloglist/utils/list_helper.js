const _ = require('lodash');

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce((prev, current) => {
      return (prev.likes > current.likes) ? prev : current
    })
}

const mostBlogs = (blogs) => {
  return blogs.length === 0
    ? null
    : _.chain(blogs)
      .countBy('author')
      .map((val, key) => ({
        author: key,
        blogs: val // <--- Custom name defined here
      }))
      .maxBy('blogs') // <--- Must match the custom name above
      .value()
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}