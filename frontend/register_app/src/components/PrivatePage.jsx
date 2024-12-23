import React from 'react'
import { useNavigate } from 'react-router-dom'

const PrivatePage = () => {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }
  return (
    <div>
        <button onClick={handleLogout}>
            Logout
        </button>
      <h2>
        Welcome to Your own page in Register App!
      </h2>
    </div>
  )
}

export default PrivatePage
