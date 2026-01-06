const _ = require('lodash')

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
        blogs: val
      }))
      .maxBy('blogs')
      .value()
}

const mostLikes = (blogs) => {
  return blogs.length === 0
    ? null
    : _.chain(blogs)
      .groupBy('author')
      .map((authorBlogs, name) => ({
        author: name,
        likes: _.sumBy(authorBlogs, 'likes')
      }))
      .maxBy('likes')
      .value()
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}