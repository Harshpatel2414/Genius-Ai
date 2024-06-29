"use client"
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaSignOutAlt, FaEdit, FaUser } from 'react-icons/fa';
import { FaGear } from "react-icons/fa6";
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useChat } from '@/context/ChatContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const UserInfo = ({ open, setOpen }) => {
  const { currentUser, handleLogout } = useAuth();
  const { setMessages } = useChat();
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter()

  const handleToggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const handleUserLogout = () => {
    handleLogout()
    setMessages([]);
    router.push('/')
    toast.success("Logut successfully")
    setShowOptions(false);
    if (window.innerWidth >= 768) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleUpdateInfo = () => {
    setShowOptions(false);
    router.push('/update-info')
    if (window.innerWidth >= 768) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };
  if (!open) {
    return null
  }
  return (
    <div className="relative border-t border-gray-200 pt-4">
      {!currentUser ? (
        <div className="flex items-center space-x-4">
          <FaUser className='w-12 text-gray-500 h-10 border border-gray-500 rounded-full p-2' />
          <Link onClick={() => {
            if (window.innerWidth >= 768) {
              setOpen(true);
            } else {
              setOpen(false);
            }
          }} href={'/login'} className="px-4 py-2 w-full bg-gray-100  text-center text-gray-500 rounded-md hover:bg-blue-500 hover:text-gray-100 outline-none">
            Log In
          </Link>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="relative w-full">
            <div className="flex items-center space-x-4 w-full justify-between">
              <div className='flex gap-2 items-center'>
                <Image
                  width={40}
                  height={40}
                  quality={100}
                  src={currentUser.image || "/user.jpeg"}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover object-center"
                />
              <div className='flex flex-col'>
                <p className="font-semibold capitalize">{currentUser.username}</p>
                <p className="text-gray-500 text-sm">{currentUser.email}</p>
              </div>
              </div>
              <button
                onClick={handleToggleOptions}
                className={`flex items-center outline-none ${showOptions ? "text-blue-500": "text-gray-400"}`}
              >
                <FaGear className="w-6 h-6" />
              </button>
            </div>
            {showOptions && (
              <div className="absolute -top-32 md:-top-20 -right-20 md:left-64 mt-2 py-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <button
                  onClick={handleUpdateInfo}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  <FaEdit className="inline-block w-4 h-4 mr-2" />
                  Update Info
                </button>
                <button
                  onClick={handleUserLogout}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  <FaSignOutAlt className="inline-block w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
