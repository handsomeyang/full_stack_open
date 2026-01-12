import { useSelector } from 'react-redux'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  const notification = useSelector(({notification}) => notification)

  if (notification === null) {
    return null
  }

  return <div style={{ ...style, color: notification.error ? 'red' : 'green' }}>{notification.content}</div>
}

export default Notification
