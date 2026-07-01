import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Home from './features/resume-analysis/pages/Home'
import Protected from './features/auth/components/Protected'
import Report from './features/resume-analysis/pages/Report'
import Landing from './features/landing/pages/Landing'

function App() {
  return (
    <Routes>
      {/* Public Landing */}
      <Route path='/' element={<Landing />} />

      {/* Authentication */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />


      <Route path='/dashboard' element={<Protected><Home /></Protected>} />
      <Route path='/reports/:reportId' element={<Protected><Report /></Protected>} />
    </Routes>
  )
}

export default App