"use client";

import React, { useState, useRef, useEffect, Suspense, lazy} from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import Input from "./Input";
import { useRouter, useSearchParams } from 'next/navigation'
import fetchConversationHistory from "@/utils/fetchConversationHistory";
import fetchFavoriteProducts from "@/utils/fetchFavoriteProducts";
import Loading from "../loading";
const Message = lazy(() => import("./Message")); 

const ChatContainer = () => {

  const [isLoading, setIsLoading] = useState(false);
  const { setChatHistory, store, currentUser, setFavProducts,loading } = useAuth();
  const { messages, setMessages } = useChat();
  const chatEndRef = useRef(null);
  const searchParams = useSearchParams()
  const router = useRouter()

  const chatId = searchParams.get('id')
 
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser && !loading) {
        await fetchConversationHistory(currentUser._id, setChatHistory);
      }
    };
    return ()=> fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser && !loading) {
        await fetchFavoriteProducts(currentUser._id, setFavProducts);
      }
    };
    return ()=>fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if(!currentUser){
        router.push('/')
      }else{
        try {
          const response = await fetch("/api/get-chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ chatId }),
            next: { revalidate: 300 }
          });
          if (response.ok) {
            const data = await response.json();
            setMessages(data);
          } else {
            console.error("Failed to fetch chat history:", response.status);
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };

    if (chatId) {
      fetchChatHistory();
    }
  }, [chatId,router]);

  const handleSendMessage = async (inputMessage) => {
    if (inputMessage.length > 6) {
      const newMessage = { role: 'user', content: inputMessage };
      const updatedMessages = [...messages, newMessage];
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: updatedMessages,
            chatId: chatId,
            userId: currentUser._id,
          }),
        });

        if (res.status === 200) {
          const { response, chatId } = await res.json();
          router.push(`/?id=${chatId}`)

          if (messages.length <= 1) {
            await fetchConversationHistory(currentUser._id, setChatHistory)
          }
          setMessages((prevMessages) => [...prevMessages, response]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              role: "assistant",
              content:
                "Sorry, we are unable to handle your request. Please try again!",
            },
          ]);
          console.error("Failed to send message:", res.statusText);
        }
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: "Sorry, there was an error. Please try again!",
          },
        ]);
        console.error("Error while sending message:", error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full p-4 sm:p-2 md:p-4 lg:p-6">
      <div className="flex-1 overflow-y-auto space-y-4 hide-scrollbar">
      <Suspense fallback={<Loading />}>
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full hide-scrollbar">
              <div className="text-center text-gray-500">
                <p className="mb-4 text-lg">
                  Welcome to{" "}
                  <span className="text-lg font-semibold text-blue-500">
                    Genius<span className="text-zinc-700">AI</span>
                  </span>
                </p>
                <p>Start messaging to get assistance.</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <Message key={index} message={message} chatId={chatId} />
            ))
          )}
        </Suspense>
        <div ref={chatEndRef} />
        {isLoading && (
          <div className="flex items-center justify-start py-1 h-10 gap-1 pl-2">
            <div className="dot bounce-animation text-3xl text-blue-500 font-bold">
              .
            </div>
            <div
              className="dot bounce-animation text-3xl text-blue-500 font-bold"
              style={{ animationDelay: "0.2s" }}
            >
              .
            </div>
            <div
              className="dot bounce-animation text-3xl text-blue-500 font-bold"
              style={{ animationDelay: "0.4s" }}
            >
              .
            </div>
          </div>
        )}
      </div>
      <Input handleSendMessage={handleSendMessage} />
    </div>
  )
};

export default ChatContainer;