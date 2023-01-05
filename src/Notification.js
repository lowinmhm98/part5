const Notification = ({ type,message }) => {
  if (message === '') {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}


export default  Notification