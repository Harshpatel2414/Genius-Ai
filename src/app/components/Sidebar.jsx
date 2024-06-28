"use client";

import React, { useEffect, useRef, useState } from "react";
import Conversations from "./Conversations";
import FavoriteProducts from "./FavoriteProducts";
import Profile from "./Profile";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { FaChevronDown, FaChevronRight, FaChevronUp, FaRegHeart } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";

import { useRouter } from "next/navigation";
import { FaRegComment } from "react-icons/fa6";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const { chatHistory, favProducts } = useAuth();
  const [open, setOpen] = useState(false)
  const sidebarRef = useRef(null);
  const { setMessages } = useChat();
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && window.innerWidth < 768) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab((prevTab) => (prevTab === tab ? null : tab));
  };

  const handleNewQuestion = (e) => {
    e.preventDefault();
    router.push('/')
    setMessages([]);
    if (window.innerWidth <= 768) {
      setOpen(false);
    } else {
      setOpen(true)
    }
  };

  return (
    <aside ref={sidebarRef} className={`bg-white border-r border-gray-200 transition-transform md:transition-none duration-300 ease-in-out ${!open ? "w-0 p-[2px] -translate-x-full" : "w-64 open-sidebar z-20 translate-x-0"} p-4 md:flex flex-col flex z-40 relative`}>
      <button onClick={() => setOpen(!open)} className="md:hidden cursor-pointer">
        <FaChevronRight className="w-8 h-10 rounded-md p-2 absolute top-12 -right-6 drop-shadow-md text-gray-100 bg-blue-500" />
      </button>
      {open && <button
        onClick={handleNewQuestion}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        New Question
      </button>}

      <nav className="flex-1 border-t pt-2">
        <ul className="space-y-2">
          <li>
            {open && <button
              className={`w-full text-left p-2 hover:bg-blue-50 rounded flex justify-between items-center ${activeTab === "conversations"
                ? "text-blue-500 border-b-2 border-blue-100 bg-blue-50"
                : "text-gray-700"
                }`}
              onClick={() => handleTabClick("conversations")}
            >
              <div className="flex items-center gap-2">
                <FaRegComment className="w-6 h-6" />
                <span>Conversations</span>
              </div>
              {activeTab === "conversations" ? (
                <FaChevronUp className="text-blue-500" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>}

            {activeTab === "conversations" && (
              <Conversations chatHistory={chatHistory} setOpen={setOpen} />
            )}
          </li>
          <li>
            {open && <button
              className={`w-full text-left rounded p-2 hover:bg-blue-50 flex justify-between items-center ${activeTab === "products"
                ? "text-blue-500 border-b-2 border-blue-100 bg-blue-50"
                : "text-gray-700"
                }`}
              onClick={() => handleTabClick("products")}
            >
              <div className="flex items-center gap-2">
                <FaRegHeart className="w-6 h-6" />
                <span>My Products</span>
              </div>
              {activeTab === "products" ? (
                <FaChevronUp className="text-blue-500" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>}

            {activeTab === "products" && (
              <FavoriteProducts favProducts={favProducts} />
            )}
          </li>
          <li>
            {open && <button className="w-full text-left p-2 hover:bg-blue-50 rounded">
              <div className="flex items-center gap-2 text-gray-700">
                <FiInfo className="w-6 h-6"/>
                <span>About Us</span>
              </div>
            </button>}

          </li>
        </ul>
      </nav>
      <Profile open={open} setOpen={setOpen} />
    </aside>
  );
};

export default Sidebar;
