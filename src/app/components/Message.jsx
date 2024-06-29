import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MessageWithProduct from "./MessageWithProduct";
import TypingEffect from './TypingEffect';
import { useChat } from '@/context/ChatContext';

const Message = ({ message, chatId }) => {
  const [liked, setLiked] = useState(message.liked || false);
  const [disliked, setDisliked] = useState(message.unliked || false);
  const { messages } = useChat()
  const updateLikeStatus = async (liked, unliked) => {
    try {
      const response = await fetch("/api/update-like-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, id: message._id, liked, unliked }),
      });
      if (!response.ok) {
        console.error("Failed to update like status:", response.status);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };
  const [lastMsg, setLastMsg] = useState(false)
  useEffect(() => {
    let lastMessage = messages[messages.length - 1]
    if (message._id === lastMessage._id) {
      setLastMsg(true)
    } else {
      setLastMsg(false)
    }
  }, [])


  const handleLike = () => {
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);
    setDisliked(false);
    updateLikeStatus(newLikedStatus, false);
  };

  const handleDislike = () => {
    const newDislikedStatus = !disliked;
    setDisliked(newDislikedStatus);
    setLiked(false);
    updateLikeStatus(false, newDislikedStatus);
  };

  return (
    <div className={`flex flex-col items-${message.role === 'user' ? 'end' : 'start'} px-1`}>
      {message.product_list ? (
        <MessageWithProduct message={message} chatId={chatId} />
      ) : (
        <div>
          <div className={`p-4 drop-shadow-md shadow-zinc-100 rounded-lg ${message.role === 'user' ? 'rounded-tr-none ml-auto text-zinc-100 bg-blue-500 user-message' : 'rounded-tl-none mr-auto bg-blue-50 assistant-message'}`}>
            {message.role === 'user' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            ) :
              (
                lastMsg ? (
                  <TypingEffect content={message.content} />
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                )
              )
            }
          </div>
          {message.role === 'assistant' && (
            <div className="flex item-center mt-3 space-x-3 ml-2">
              <button onClick={handleLike}>
                <FaThumbsUp className={`w-5 h-5 cursor-pointer drop-shadow-md ${liked ? 'text-blue-500' : 'text-gray-400'}`} />
              </button>
              <button onClick={handleDislike}>
                <FaThumbsDown className={`w-5 h-5 cursor-pointer drop-shadow-md ${disliked ? 'text-blue-500' : 'text-gray-400'}`} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
