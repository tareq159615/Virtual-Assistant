/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";

const Customize2 = () => {
  const { userData, selectedImage, backendImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleUpdateAssistant = async () => {
  try {
    let formData = new FormData();
    formData.append("assistantName", assistantName);
    if (backendImage) {
      formData.append("assistantImage", backendImage);
    } else {
      formData.append("imageUrl", selectedImage);
    }
    
    const result = await axios.post(
      `${serverUrl}/api/user/update`, 
      formData, 
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    // updated data localStorage এ save করুন
    setUserData(result.data);
    localStorage.setItem('userData', JSON.stringify(result.data));
    
    navigate("/"); // হোম পেজে navigate করুন
  } catch (error) {
    console.error("Error updating assistant:", error);
  }
};

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px]">
           <MdKeyboardBackspace
        className="absolute top-[30px] cursor-pointer left-[30px] text-white w-[25px] h-[25px]"
        onClick={() => navigate("/customize")}
      />
      <h1 className="text-white mb-[40px] text-[30px] text-center">
        Enter Your <span className="text-blue-200">Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder="eg. shifra"
        className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <button
          className="min-w-[300px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-full text-[19px] disabled:opacity-50"
          disabled={loading}
          onClick={() => {
            handleUpdateAssistant()
          }} // <-- Simplified the onClick handler
        >
          {!loading ? "Finally Create Your Assistant" : "Loading..."}
        </button>
      )}
    </div>
  );
};

export default Customize2;
