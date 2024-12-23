import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate()
  return (
    <div>
          <button onClick={() => navigate("/register")}>
           Register
        </button>
      <h2>Welcome to Home Page of Register App !</h2>
    </div>
  )
}

export default HomePage
