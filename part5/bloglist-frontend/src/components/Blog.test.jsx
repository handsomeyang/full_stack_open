import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author without url and likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://somewhere.org',
    likes: 0,
    user: {
      id: '123456',
      username: 'John',
      name: 'John',
    }
  }

  const user = {
    token: '123456',
    username: 'John',
    name: 'John',
  }

  const bumpLikes = vi.fn()
  const removeBlog = vi.fn()

  render(<Blog blog={blog} user={user} bumpLikes={bumpLikes} removeBlog={removeBlog} />)

  const titleElement = screen.getByText('Component testing is done with react-testing-library', { exact: false })
  expect(titleElement).toBeVisible()

  const authorElement = screen.getByText('John Doe', { exact: false })
  expect(authorElement).toBeVisible()

  const urlElement = screen.getByText('https://somewhere.org', { exact: false })
  expect(urlElement).not.toBeVisible()

  const likesElement = screen.getByText(`likes ${blog.likes}`, { exact: false })
  expect(likesElement).not.toBeVisible()
})

// test('clicking the button calls event handler once', async () => {
//   const note = {
//     content: 'Component testing is done with react-testing-library',
//     important: true
//   }
//
//   const mockHandler = vi.fn()
//
//   render(
//     <Blog note={note} toggleImportance={mockHandler} />
//   )
//
//   const user = userEvent.setup()
//   const button = screen.getByText('make not important')
//   await user.click(button)
//
//   expect(mockHandler.mock.calls).toHaveLength(1)
// })