import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'
import { serverUrl } from "../main"; // ✅ Must add this


function SenderMessage({ image, message }) {
  const scroll = useRef()
  const { userData } = useSelector(state => state.user)

  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" })
  }, [message, image])

  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className='flex items-start gap-3 px-2 justify-end'>
      {/* Message bubble */}
      <div
        ref={scroll}
        className='max-w-[75%] px-4 py-2 bg-sky-600 text-white text-[16px] rounded-2xl rounded-tr-none shadow-md flex flex-col gap-2'
      >
         {image && (
  <img
    src={`${serverUrl}/uploads/${image}`} // ✅ Correct image path
    alt="attachment"
    className='w-[150px] rounded-lg'
    onLoad={handleImageScroll}
  />
)
        /* {image && (
          <img
            src={image}
            alt="attachment"
            className='w-[150px] rounded-lg'
            onLoad={handleImageScroll}
          />
        )} */}
        {message && <span>{message}</span>}
      </div>

      {/* Sender Avatar */}
      <div className='w-10 h-10 rounded-full overflow-hidden flex justify-center items-center bg-white shadow-md'>
        <img src={userData.image || dp} alt="you" className='h-full w-full object-cover' />
      </div>
    </div>
  )
}

export default SenderMessage
