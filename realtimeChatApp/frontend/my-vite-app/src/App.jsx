import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import Profile from './pages/Profile'
import getCurrentUser from './customHooks/getCurrentUser'
import getOtherUsers from './customHooks/getOtherUsers'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from './main'
import { io } from 'socket.io-client'
import { SocketContext } from './context/SocketContext'
import { setOnlineUsers } from './redux/userSlice'

function App() {
  getCurrentUser()
  getOtherUsers()
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [socket, setSocket] = React.useState(null)

  useEffect(() => {
    if (userData) {
      const socketInstance = io(serverUrl, {
        auth: { userId: userData._id }
      })

      setSocket(socketInstance)

      socketInstance.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users))
      })

      return () => socketInstance.disconnect()
    } else {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
    }
  }, [userData])

  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        <Route path='/login' element={!userData ? <Login /> : <Navigate to="/" />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/profile" />} />
        <Route path='/' element={userData ? <Home /> : <Navigate to="/login" />} />
        <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/signup" />} />
      </Routes>
    </SocketContext.Provider>
  )
}

export default App
