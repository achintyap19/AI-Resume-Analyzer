import React from 'react'
import { Link } from "react-router-dom";
import {useAuth} from '../hooks/useAuth'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {

  const navigate = useNavigate()

  const {loading, handleRegister } = useAuth()


  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const formHandler= async(e)=>{
    e.preventDefault()
    await handleRegister({
      email,username,password
    })
    navigate('/')
    setEmail('')
    setPassword('')
    setUsername('')

  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-pink-900"></div>

      <div className="absolute w-80 h-80 bg-pink-500/30 blur-3xl rounded-full top-0 left-0 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-indigo-500/30 blur-3xl rounded-full bottom-0 right-0 animate-pulse"></div>

      <div className="relative z-10 w-[450px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Start optimizing your resume today
        </p>

        <form 
        onSubmit={formHandler}
        className="space-y-5">

          <input
            onChange={(e)=>{
              setUsername(e.target.value)
            }}
            required
            value={username}
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
          />

          <input
            onChange={(e)=>{
              setEmail(e.target.value)
            }}
            required
            value={email}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
          />

          <input
            onChange={(e)=>{
              setPassword(e.target.value)
            }}
            required
            value={password}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
          />

          <button
          type='submit'
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-semibold hover:scale-105 transition duration-300"
          >
            Register
          </button>

        </form>

        <p className="text-center text-gray-300 mt-6">
          Already have an account?
          <Link
            to="/"
            className="ml-2 text-pink-400"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;