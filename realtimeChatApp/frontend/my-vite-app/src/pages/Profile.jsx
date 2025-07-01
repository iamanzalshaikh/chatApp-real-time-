import React, { useRef, useState } from 'react'
import dp from "../assets/dp.webp"
import { IoCameraOutline } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../main'
import { setUserData } from '../redux/userSlice'

function Profile() {
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState(userData.name || "")
  const [frontendImage, setFrontendImage] = useState(userData.image || dp)
  const [backendImage, setBackendImage] = useState(null)
  const [saving, setSaving] = useState(false)
  const image = useRef()

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      if (backendImage) {
        formData.append("image", backendImage)
      }
      const result = await axios.put(`${serverUrl}/api/user/profile`, formData, { withCredentials: true })
      dispatch(setUserData(result.data))
      navigate("/")
    } catch (error) {
      console.log(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex flex-col justify-center items-center px-4">
      {/* Back Button */}
      <div className="fixed top-6 left-6 cursor-pointer" onClick={() => navigate("/")}>
        <IoIosArrowRoundBack className="w-10 h-10 text-white" />
      </div>

      {/* Profile Image */}
      <div
        className="relative bg-gray-900 border-4 border-sky-500 rounded-full shadow-xl overflow-hidden cursor-pointer"
        onClick={() => image.current.click()}
      >
        <div className="w-48 h-48 flex justify-center items-center rounded-full overflow-hidden">
          <img src={frontendImage} alt="profile" className="h-full object-cover" />
        </div>
        <div className="absolute bottom-4 right-4 bg-sky-500 w-9 h-9 rounded-full flex items-center justify-center shadow-md">
          <IoCameraOutline className="text-white w-5 h-5" />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleProfile}
        className="w-full max-w-md mt-8 flex flex-col gap-5 items-center"
      >
        <input type="file" accept="image/*" ref={image} hidden onChange={handleImage} />

        <input
          type="text"
          placeholder="Enter your name"
          className="w-full h-12 px-4 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-400 outline-none"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="text"
          readOnly
          className="w-full h-12 px-4 bg-gray-800 text-gray-400 border border-gray-600 rounded-md"
          value={userData?.userName}
        />

        <input
          type="email"
          readOnly
          className="w-full h-12 px-4 bg-gray-800 text-gray-400 border border-gray-600 rounded-md"
          value={userData?.email}
        />

        <button
          type="submit"
          disabled={saving}
          className={`w-full h-12 mt-4 rounded-md bg-sky-500 text-white font-bold hover:bg-sky-600 transition-all shadow-md ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  )
}

export default Profile
