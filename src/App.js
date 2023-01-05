import { useState, useEffect,useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './Notification'
import './style.css'
import LoginForm from './components/loginform'
import Togglable from './components/toggable'
import BlogForm from './components/blogform'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [type,setType] = useState('')
  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )

  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addNewBlog=  async (blogtoadd) => {


    blogFormRef.current.toggleVisibility()
    try {
      await blogService.create(blogtoadd)

      setErrorMessage(`${blogtoadd.title} by ${blogtoadd.author} was added correctly`)
      setType('success')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
      setBlogs([...blogs,blogtoadd])
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setType('error')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const modifyBlog =async (modifiedblog) => {
    try {
      console.log(modifiedblog)
      await blogService.update(modifiedblog.id,modifiedblog)

      setErrorMessage(`${modifiedblog.title} by ${modifiedblog.author} was modified correctly ${modifiedblog.likes}`)
      setType('success')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setType('error')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }

    return
  }



  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      console.log(user)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage(`${user.name || user.username} logged in correctly`)
      setType('success')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setErrorMessage(exception.response.data.error)
      setType('error')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const logOut = () => {
    setUser(null)
    window.localStorage.clear()
    blogService.setToken(null)

  }

  const loginForm = () => {

    return (
      <div>


        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />


      </div>
    )
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addNewBlog} />
    </Togglable>
  )

  const deleteBlog = async(id) => {

    try {
      console.log()
      await blogService.deleteBlog(id)

      setErrorMessage('blog was deleted correctly ')
      setType('success')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
      setBlogs(blogs.filter((blog) => {if(blog.id!==id) {return(blog)}else return(null)}))
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setType('error')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }

  }



  return (
    <div>
      <h1>Blogs</h1>

      <Notification type= {type} message= {errorMessage}/>

      {user === null ?
        <Togglable buttonLabel="login">{ loginForm()} </Togglable> :
        <div>
          <p>{user.name||user.username} logged-in <button onClick={logOut}>Log out</button></p>
          {blogForm()}
        </div>
      }


      <ul>

        {blogs.sort((prev,curr) => (prev.likes-curr.likes)).map((blog) =>
          <Blog
            key={blog.id}
            blog={blog}
            modifyblog= {modifyBlog}
            delBlog= {deleteBlog}

          />
        )}
      </ul>


    </div>
  )
}

export default App
