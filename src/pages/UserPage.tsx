import { useParams } from 'react-router-dom'

const UserPage = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>User Page</h1>
      {id ? (
        <p>Viewing user with ID: <strong>{id}</strong></p>
      ) : (
        <p>No user ID provided</p>
      )}
      <div style={{ marginTop: '20px' }}>
        <a href="/">← Back to Home</a>
      </div>
    </div>
  )
}

export default UserPage