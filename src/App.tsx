import { Routes, Route, Link } from 'react-router-dom'
import UserPage from './pages/UserPage'

function App() {
  return (
    <div>
      <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
        <Link to="/users/1">User 1</Link>
        <Link to="/users/2" style={{ marginLeft: '10px' }}>User 2</Link>
        <Link to="/users/123" style={{ marginLeft: '10px' }}>User 123</Link>
      </nav>
      
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<div><h1>Welcome to React Router Demo</h1><p>Select a user from the navigation above to see dynamic routing in action.</p></div>} />
          <Route path="/users/:id" element={<UserPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App