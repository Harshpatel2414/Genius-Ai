'use client';

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [store, setStore] = useState("Products");
  const [chatHistory, setChatHistory] = useState({});
  const [favProducts, setFavProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser && !loading) { 
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser, loading]);

  const handleLogout = () => {
    setLoading(true); 
    setCurrentUser(null);
    setChatHistory({});
    setFavProducts([]);
    localStorage.clear();
    setLoading(false); 
  };

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
        handleLogout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
