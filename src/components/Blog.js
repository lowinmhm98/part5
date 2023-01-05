import { useState } from 'react'


const Blog = ({ blog,modifyblog,delBlog }) => {
  const [view,setView] = useState('hide')
  const [likes,setLikes] = useState(blog.likes)


  const handleDelete = (id) => {
    delBlog(id)
  }
  const handleChange = () => {
    setLikes(likes+1)
    console.log(modifyblog)
    console.log(likes)

    modifyblog(
      {
        author:blog.author,
        likes: likes+1,
        url:blog.url,
        title: blog.title,
        id:blog.id,
        user:blog.user


      }

    )
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return(
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={() => {view==='hide'? setView('view'):setView('hide')}}>{view==='view'? 'hide':'view'}</button>
      {view==='hide'? null: ( <div className='defaulthidden'>{blog.url}<br></br>{likes} <button onClick={handleChange}>like</button><br></br> <button onClick={() => handleDelete(blog.id)}>Delete</button></div> )}



    </div>
  )
}

export default Blog