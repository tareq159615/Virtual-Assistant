/* eslint-disable react-refresh/only-export-components */
import React, { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(true);
  // Load userData from localStorage on initial render
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data.user);
      localStorage.setItem("userData", JSON.stringify(result.data.user));
    } catch (error) {
      console.log("Error fetching current user:", error);
      localStorage.removeItem("userData");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

const getGeminiResponse = async (command) => {
  try {
    const result = await axios.post(
      `${serverUrl}/api/user/asktoassistant`,
      { command },
      { withCredentials: true }
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return null; // এরর হলে null রিটার্ন করুন
  }
};

  useEffect(() => {
    handleCurrentUser();
  }, []);

  // Update localStorage whenever userData changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }
  
  const value = {
    serverUrl,
    userData,
    backendImage,
    setBackendImage,
    setUserData,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;
