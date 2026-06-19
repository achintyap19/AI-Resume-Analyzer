import React, { useState } from 'react'
import { Link } from "react-router-dom";
import {useAuth} from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';

function Login() {

  const {loading, handleLogin} = useAuth()

  const navigate = useNavigate()

  //2-way binding
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const formHandler= async(e)=>{
    e.preventDefault()
    await handleLogin({email, password})
    navigate('/')
    setEmail('')
    setPassword('')
  }

  if(loading){
    return (
      <main>Loading....</main>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-cyan-900"></div>

      {/* Floating Blobs */}
      <div className="absolute w-72 h-72 bg-purple-500/30 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-cyan-500/30 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>

      {/* Card */}
      <div className="relative z-10 w-[420px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            ResumeAI
          </h1>

          <p className="text-gray-300 mt-2">
            Match your resume with your dream job
          </p>

        </div>

        <form 
        onSubmit={formHandler}
        className="space-y-5">

          <input
            onChange={(e)=>{
              setEmail(e.target.value)
            }}
            value={email}
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
          />

          <input
            onChange={(e)=>{
              setPassword(e.target.value)
            }}
            value={password}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
          />

          <button
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:scale-105 transition duration-300"
          >
            Login
          </button>

        </form>

        <p className="text-center text-gray-300 mt-6">
          Don't have an account?
          <Link
            to="/register"
            className="ml-2 text-cyan-400 hover:text-cyan-300"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;