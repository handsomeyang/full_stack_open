import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  beforeEach((context) => {
    context.blog = {
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

    context.user = {
      token: '123456',
      username: 'John',
      name: 'John',
    }

    context.bumpLikes = vi.fn()
    context.removeBlog = vi.fn()

    render(<Blog blog={context.blog} user={context.user} bumpLikes={context.bumpLikes} removeBlog={context.removeBlog}/>)
  })

  test('renders title and author without url and likes by default', () => {
    const titleElement = screen.getByText('Component testing is done with react-testing-library', { exact: false })
    expect(titleElement).toBeVisible()

    const authorElement = screen.getByText('John Doe', { exact: false })
    expect(authorElement).toBeVisible()

    const urlElement = screen.getByText('https://somewhere.org', { exact: false })
    expect(urlElement).not.toBeVisible()

    const likesElement = screen.getByText('likes 0', { exact: false })
    expect(likesElement).not.toBeVisible()
  })

  test('shows url and likes after clicking the view button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText('https://somewhere.org', { exact: false })
    expect(urlElement).toBeVisible()

    const likesElement = screen.getByText('likes 0', { exact: false })
    expect(likesElement).toBeVisible()
  })

  test('bumpLikes is called twice if the like button is clicked twice', async ({ bumpLikes }) => {
    const userSetup = userEvent.setup()
    const button = screen.getByText('like')
    await userSetup.click(button)
    await userSetup.click(button)

    expect(bumpLikes.mock.calls).toHaveLength(2)
  })
})