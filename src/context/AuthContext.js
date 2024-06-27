"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [store, setStore] = useState("Products");
  const [chatHistory, setChatHistory] = useState({});
  const [favProducts, setFavProducts] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        chatHistory,
        setChatHistory,
        favProducts,
        setFavProducts,
        store,
        setStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
