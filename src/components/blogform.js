import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ author:'',title:'',url:'' })

  const handleChange = (event) => {
    console.log(event.target.getAttribute('id'))
    event.target.getAttribute('id')
    const changedBlog = { ...newBlog }
    changedBlog[event.target.getAttribute('id')] = event.target.value
    setNewBlog(changedBlog)
  }

  const addBlog = (event) => {
    event.preventDefault()
    console.log('im in add blog')
    createBlog({
      author: newBlog.author,
      title:newBlog.title,
      url:newBlog.url,

    })

    setNewBlog({ author:'',title:'',url:'' })
  }

  return (
    <div>
      <h2>Create a new Blog</h2>

      <form onSubmit={addBlog}>
        <label htmlFor='author'>Author</label>
        <input
          id="author"
          value={newBlog.author}
          onChange={handleChange}
        />
        <label htmlFor='title'>Title</label>
        <input
          id="title"
          value={newBlog.title}
          onChange={handleChange}
        />
        <label htmlFor='url'>Url</label>
        <input
          id="url"
          value={newBlog.url}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm