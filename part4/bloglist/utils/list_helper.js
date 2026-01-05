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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}