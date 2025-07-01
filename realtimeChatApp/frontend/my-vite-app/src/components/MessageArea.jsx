import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import axios from 'axios';
import { serverUrl } from '../main';
import { setMessages } from '../redux/messageSlice';

function MessageArea() {
  const { selectedUser, userData, socket } = useSelector(state => state.user);
  const { messages } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const image = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, { withCredentials: true });
      dispatch(setMessages([...messages, result.data]));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(error);
    }
  }

  const onEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji);
    setShowPicker(false);
  }

  useEffect(() => {
    socket?.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]));
    });
    return () => socket?.off("newMessage");
  }, [messages]);

  return (
    <div className={`lg:w-[70%] w-full h-full relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white ${selectedUser ? "flex" : "hidden"} lg:flex flex-col`}>

      {/* HEADER */}
      {selectedUser && (
        <div className='w-full h-[90px] bg-[#1d4ed8] flex items-center px-4 gap-4 shadow-lg z-10'>
          <div className='cursor-pointer' onClick={() => dispatch(setSelectedUser(null))}>
            <IoIosArrowRoundBack className='w-8 h-8 text-white' />
          </div>
          <div className='w-12 h-12 rounded-full overflow-hidden bg-white'>
            <img src={selectedUser?.image || dp} alt="dp" className='w-full h-full object-cover' />
          </div>
          <h2 className='text-lg font-semibold'>{selectedUser?.name || "User"}</h2>
        </div>
      )}

      {/* MESSAGE LIST */}
      <div className='flex-1 px-4 py-6 overflow-y-auto space-y-4'>
        {showPicker && (
          <div className='absolute bottom-[120px] left-4 z-50'>
            <EmojiPicker width={260} height={350} onEmojiClick={onEmojiClick} theme="dark" />
          </div>
        )}
        {messages && messages.map((mess, index) =>
          mess.sender === userData._id ?
            <SenderMessage key={index} image={mess.image} message={mess.message} /> :
            <ReceiverMessage key={index} image={mess.image} message={mess.message} />
        )}
      </div>

      {/* PREVIEW IMAGE */}
      {frontendImage && (
        <div className='absolute bottom-[100px] right-[20%]'>
          <img src={frontendImage} alt="preview" className='w-[80px] rounded-lg shadow-md' />
        </div>
      )}

      {/* INPUT BAR */}
      {selectedUser && (
        <div className='w-full px-4 pb-4'>
          <form onSubmit={handleSendMessage} className='w-full max-w-3xl mx-auto bg-[#1e293b] border border-gray-600 rounded-full flex items-center px-4 py-2 shadow-md gap-4'>
            <RiEmojiStickerLine onClick={() => setShowPicker(prev => !prev)} className='text-white w-6 h-6 cursor-pointer' />
            <input
              type="file"
              ref={image}
              hidden
              accept='image/*'
              onChange={handleImage}
            />
            <input
              type="text"
              placeholder='Type a message...'
              className='flex-1 bg-transparent text-white placeholder-gray-400 outline-none'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <FaImages onClick={() => image.current.click()} className='text-white w-6 h-6 cursor-pointer' />
            {(input || backendImage) && (
              <button type='submit'>
                <RiSendPlane2Fill className='text-white w-6 h-6' />
              </button>
            )}
          </form>
        </div>
      )}

      {/* EMPTY MESSAGE AREA */}
      {!selectedUser && (
        <div className='w-full h-full flex flex-col justify-center items-center text-white text-center'>
          <h1 className='text-4xl font-bold mb-2 text-sky-300'>Welcome to Chattrix</h1>
          <p className='text-lg text-gray-300'>Start a conversation to see messages here</p>
        </div>
      )}
    </div>
  )
}

export default MessageArea;
