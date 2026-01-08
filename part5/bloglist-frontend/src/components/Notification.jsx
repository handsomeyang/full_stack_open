const Notification = ({ message }) => {
  const baseStyle = {
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  if (message === null) {
    return null
  }

  return (
    <div style={{ ...baseStyle, color: message.error ? 'red' : 'green' }}>
      {message.content}
    </div>
  )
}

export default Notification