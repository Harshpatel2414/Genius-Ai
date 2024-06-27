"use client"
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import TypingEffect from './TypingEffect';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

const MessageContent = ({ message, chatId }) => {
  const [liked, setLiked] = useState(message.liked || false);
  const [disliked, setDisliked] = useState(message.unliked || false);

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
    <div className={`flex flex-col gap-4 w-full ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
      <div>
        <div className={`p-4 drop-shadow-md shadow-zinc-100 rounded-lg ${message.role === 'user' ? 'rounded-tr-none ml-auto bg-zinc-100 user-message' : 'rounded-tl-none mr-auto bg-blue-50 assistant-message'}`}>
          <TypingEffect content={message.content} />
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
      {message.product_list.length > 0 && <p className='pl-2 text-gray-700 text-lg text-shadow-sm'>Here are some products found :</p>}
      <div className="w-full h-full overflow-x-auto custom-scrollbar">
        <div className="flex flex-row gap-4 justify-center md:justify-start w-fit py-2 px-1">
          {message.product_list?.map((product, index) => (
            <div key={index}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageContent;
