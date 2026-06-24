import React from 'react'
import { Routes, Route, href } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Home from './features/resume-analysis/pages/Home'
import Protected from './features/auth/components/Protected'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/' element={<Protected><Home /></Protected>} />
    </Routes>
  )
}

export default App