const config = require('./utils/config')
const logger = require('./utils/logger')
const Blog = require('./models/blog')
const mongoose = require('mongoose')

console.log(process.argv.length)
if (process.argv.length > 2 && process.argv.length < 6) {
    console.log('too few arguments')
    process.exit(1)
}

if (process.argv.length > 6) {
    console.log('too many arguments')
    process.exit(1)
}

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
      logger.info('connected to MongoDB')
  })
  .catch((error) => {
      logger.error('error connection to MongoDB:', error.message)
  })

if (process.argv.length === 7) {
    const blog = new Blog({
        title: process.argv[3],
        author: process.argv[4],
        url: process.argv[5],
        likes: Number(process.argv[6]),
    })

    blog.save().then(() => {
        console.log(`added ${blog.title} ${blog.author} ${blog.url} ${blog.likes} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Blog.find({}).then(result => {
        console.log('bloglist:')
        result.forEach(blog => {
            console.log(`${blog.title} ${blog.author} ${blog.url} ${blog.likes}`)
        })
        mongoose.connection.close()
    })
}