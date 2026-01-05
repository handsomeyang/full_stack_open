const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty array is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  const biggerList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a6763245d17f8',
      title: 'You Dont Know JS',
      author: 'Kile Simpson',
      url: 'https://github.com/getify/You-Dont-Know-JS',
      likes: 17,
      __v: 0
    },
    {
      _id: 'hjfks2aa71b54a676234d17f8',
      title: 'Introduction to testing',
      author: 'University of Helsinki',
      url: 'https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing',
      likes: 6,
      __v: 0
    }
  ]

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(biggerList)
    assert.strictEqual(result, 28)
  })
})

describe('favorite blog', () => {
  test('of empty array is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  })

  const biggerList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a6763245d17f8',
      title: 'You Dont Know JS',
      author: 'Kile Simpson',
      url: 'https://github.com/getify/You-Dont-Know-JS',
      likes: 17,
      __v: 0
    },
    {
      _id: 'hjfks2aa71b54a676234d17f8',
      title: 'Introduction to testing',
      author: 'University of Helsinki',
      url: 'https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing',
      likes: 6,
      __v: 0
    }
  ]

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(biggerList)
    assert.deepStrictEqual(result, biggerList[1])
  })
})