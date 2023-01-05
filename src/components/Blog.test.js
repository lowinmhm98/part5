import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './blogform'

test('renders  only author and title', () => {
  const blog = {
    author: 'author',
    url: 'test.com',
    title: 'test title',
  }

  const { container }= render(<Blog blog={blog} />)

  const title = screen.getByText('test title' , { exact: false })
  const author = screen.getByText('author' , { exact: false })
  const div = container.querySelector('.defaulthidden')
  expect(title).toBeDefined()
  expect(author).toBeDefined()
  !expect(div).toBeDefined()
})


test('clicking the button likes and url', async () => {
  const blog = {
    author: 'author',
    url: 'test.com',
    title: 'test title',
    likes: 1
  }



  render(<Blog blog={blog}  />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.getByText('test.com' , { exact: false })
  const likes = screen.getByText(1 , { exact: false })
  expect(likes).toBeDefined()
  expect(url).toBeDefined()

})


test('if i like 2 times modifyblog gets called two times', async () => {
  const blog = {
    author: 'author',
    url: 'test.com',
    title: 'test title',
    likes: 1
  }
  const mockHandler = jest.fn()
  render(<Blog blog={blog}  modifyblog={mockHandler}/>)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const like = screen.getByText('like')
  await user.click(like)
  await user.click(like)
  expect(mockHandler.mock.calls).toHaveLength(2)
})


test('<NoteForm /> updates parent state and calls onSubmit',  async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()
  render(<BlogForm createBlog={createBlog} />)

  const input = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input[0], 'author')
  await  user.type(input[1], 'title')
  await  user.type(input[2], 'url')
  screen.debug(sendButton)
  screen.debug(input[0])
  screen.debug(input[1])
  screen.debug(input[2])
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].author).toBe('author')
  expect(createBlog.mock.calls[0][0].title).toBe('title')
  expect(createBlog.mock.calls[0][0].url).toBe('url')
})