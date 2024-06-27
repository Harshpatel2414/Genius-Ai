"use client"

import { createContext, useContext, useState } from "react"

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatContextProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    return (
        <ChatContext.Provider value={{
            messages,
            setMessages,
        }}>
            {children}
        </ChatContext.Provider >
    )
};