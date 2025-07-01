import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dp from "../assets/dp.webp";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { serverUrl } from '../main';
import axios from 'axios';
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function SideBar() {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector(state => state.user);
  const [search, setSearch] = useState(false);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, { withCredentials: true });
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (input) {
      handleSearch();
    }
  }, [input]);

  return (
    <div className={`lg:w-[30%] w-full h-full lg:block bg-gradient-to-b from-slate-900 to-gray-800 text-white relative ${!selectedUser ? "block" : "hidden"}`}>
      {/* Logout Button */}
      <div className='w-12 h-12 rounded-full bg-sky-500 shadow-md flex justify-center items-center fixed bottom-5 left-4 cursor-pointer hover:scale-105 transition' onClick={handleLogOut}>
        <BiLogOutCircle className='w-6 h-6 text-white' />
      </div>

      {/* Search Result Overlay */}
      {input.length > 0 && (
        <div className='absolute top-[250px] w-full h-[500px] bg-gray-900 bg-opacity-90 z-40 overflow-y-auto p-4 rounded-lg'>
          {searchData?.map((user, i) => (
            <div key={i} className='flex items-center gap-4 p-3 hover:bg-sky-700 rounded-lg cursor-pointer' onClick={() => {
              dispatch(setSelectedUser(user));
              setInput("");
              setSearch(false);
            }}>
              <div className='relative'>
                <img src={user.image || dp} alt="" className='w-12 h-12 rounded-full object-cover border border-white' />
                {onlineUsers?.includes(user._id) && (
                  <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900'></span>
                )}
              </div>
              <h1 className='text-white text-lg font-semibold'>{user.name || user.userName}</h1>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className='w-full h-[280px] bg-gradient-to-r from-sky-600 to-blue-500 rounded-b-[30%] p-6 shadow-md'>
        <h1 className='text-white text-3xl font-bold mb-4'>Chattrix</h1>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Hi, {userData?.name || "User"}</h2>
          <div onClick={() => navigate("/profile")} className='w-12 h-12 rounded-full overflow-hidden cursor-pointer border-2 border-white'>
            <img src={userData.image || dp} alt="" className='w-full h-full object-cover' />
          </div>
        </div>

        {/* Search or Avatars */}
        <div className='flex gap-3 items-center'>
          {!search ? (
            <button onClick={() => setSearch(true)} className='w-12 h-12 bg-white rounded-full flex justify-center items-center shadow-md'>
              <IoIosSearch className='text-sky-700 w-6 h-6' />
            </button>
          ) : (
            <form className='flex-1 h-12 bg-white rounded-full flex items-center gap-3 px-4 shadow-inner'>
              <IoIosSearch className='text-gray-500 w-5 h-5' />
              <input type="text" placeholder='Search users...' value={input} onChange={(e) => setInput(e.target.value)} className='flex-1 outline-none bg-transparent text-gray-800' />
              <RxCross2 className='w-5 h-5 text-gray-600 cursor-pointer' onClick={() => setSearch(false)} />
            </form>
          )}

          {!search && otherUsers?.map((user, i) =>
            onlineUsers?.includes(user._id) && (
              <div key={i} onClick={() => dispatch(setSelectedUser(user))} className='relative w-12 h-12 bg-white rounded-full overflow-hidden cursor-pointer shadow-md'>
                <img src={user.image || dp} alt="" className='w-full h-full object-cover' />
                <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white'></span>
              </div>
            )
          )}
        </div>
      </div>

      {/* User List */}
      <div className='flex flex-col gap-3 mt-6 p-4 overflow-y-auto h-[calc(100%-330px)]'>
        {otherUsers?.map((user, i) => (
          <div key={i} onClick={() => dispatch(setSelectedUser(user))} className='flex items-center gap-4 bg-gray-800 p-3 rounded-full hover:bg-sky-700 cursor-pointer transition'>
            <div className='relative w-12 h-12 rounded-full overflow-hidden border border-gray-600'>
              <img src={user.image || dp} alt="" className='w-full h-full object-cover' />
              {onlineUsers?.includes(user._id) && (
                <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900'></span>
              )}
            </div>
            <h1 className='text-white text-lg font-medium'>{user.name || user.userName}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
