import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignUp() {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const dispatch = useDispatch()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, {
        userName, email, password
      }, { withCredentials: true })
      dispatch(setUserData(result.data))
      navigate("/profile")
      setEmail("")
      setPassword("")
      setUserName("")
      setLoading(false)
      setErr("")
    } catch (error) {
      console.log(error)
      setLoading(false)
      setErr(error?.response?.data?.message || "Signup failed")
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-[#1e293b]/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-10 text-white">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-sky-300 tracking-wide">Join <span className="text-white">Chattrix</span></h1>
          <p className="text-sm text-gray-300 mt-1">Create your account and start chatting</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Username"
            className="w-full h-12 px-4 rounded-md bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full h-12 px-4 rounded-md bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              className="w-full h-12 px-4 rounded-md bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <span
              className="absolute right-4 top-3 text-sm text-sky-300 cursor-pointer hover:underline select-none"
              onClick={() => setShow(prev => !prev)}
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>

          {err && <p className="text-sm text-red-400 text-center -mt-2">*{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-12 rounded-md bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all shadow-md ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-300 text-sm">
          Already have an account?{' '}
          <span
            onClick={() => navigate("/login")}
            className="font-semibold underline cursor-pointer text-sky-300 hover:text-sky-200"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignUp
