const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared blogs')

    await Blog.insertMany(helper.initialBlogs)
    console.log('initiated blogs')

    await User.deleteMany({})
    console.log('cleared users')

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
    console.log('initiated users')
  })

  describe('viewing all blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')

      const titles = response.body.map(e => e.title)
      assert.strictEqual(titles.includes('Canonical string reduction'), true)
    })

    test('unique identifier property of the blog posts is named id', async () => {
      const response = await api.get('/api/blogs')

      const firstBlog = response.body[0]

      assert.ok(firstBlog.id, 'The property "id" should be defined')
      assert.strictEqual(firstBlog._id, undefined, 'The property "_id" should be removed')
    })
  })

  describe('viewing a specific blog', () => {
    test('a specific blog can be viewed', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added ', async () => {
      const newBlog = {
        title: 'Testing the backend',
        author: 'University of Helsinki',
        url: 'https://fullstackopen.com/en/part4/testing_the_backend',
        likes: 100,
      }

      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]
      const userForToken = {
        username: user.username,
        id: user.id,
      }
      const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('Testing the backend'))
    })

    test('a missing likes property defaults to 0', async () => {
      const newBlog = {
        title: 'Testing the backend',
        author: 'University of Helsinki',
        url: 'https://fullstackopen.com/en/part4/testing_the_backend'
      }

      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]
      const userForToken = {
        username: user.username,
        id: user.id,
      }
      const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)

      assert.strictEqual(response.body.likes, 0)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('missing title or url properties returns status code 400', async () => {
      const newBlog = {
        title: 'Testing the backend',
        author: 'University of Helsinki'
      }

      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]
      const userForToken = {
        username: user.username,
        id: user.id,
      }
      const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('adding a valid blog without token returns status code 401', async () => {
      const newBlog = {
        title: 'Testing the backend',
        author: 'University of Helsinki',
        url: 'https://fullstackopen.com/en/part4/testing_the_backend',
        likes: 100,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(n => n.title)
      assert(!titles.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('updating a blog', () => {
    test('succeeds if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

      console.log(updatedBlog)
      await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog)

      const updatedBlogInDb = await Blog.findById(blogToUpdate.id)

      assert.strictEqual(updatedBlog.likes, updatedBlogInDb.likes)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      const blog = new Blog({
        title: 'Testing the backend',
        author: 'University of Helsinki',
        url: 'https://fullstackopen.com/en/part4/testing_the_backend',
        likes: 100
      })

      await api.put(`/api/blogs/${validNonexistingId}`).send(blog).expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})




