import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'

function ReceiverMessage({ image, message }) {
  const scroll = useRef()
  const { selectedUser } = useSelector(state => state.user)

  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" })
  }, [message, image])

  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className='flex items-start gap-3 px-2'>
      {/* User avatar */}
      <div className='w-10 h-10 rounded-full overflow-hidden flex justify-center items-center bg-white shadow-md'>
        <img src={selectedUser?.image || dp} alt="user" className='h-full w-full object-cover' />
      </div>

      {/* Message box */}
      <div
        ref={scroll}
        className='max-w-[75%] px-4 py-2 bg-sky-600 text-white text-[16px] rounded-2xl rounded-tl-none shadow-md flex flex-col gap-2'
      >
        {image && (
          <img
            src={image}
            alt="attached"
            className='w-[150px] rounded-lg'
            onLoad={handleImageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>
    </div>
  )
}

export default ReceiverMessage
