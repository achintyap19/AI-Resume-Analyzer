import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Home from './features/resume-analysis/pages/Home'
import Protected from './features/auth/components/Protected'
import Report from './features/resume-analysis/pages/Report'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/' element={<Protected><Home /></Protected>} />
      <Route path='/reports/:reportId' element={<Protected><Report /></Protected>} />
    </Routes>
  )
}

export default App