/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Card({ image }) {
  const {
    selectedImage,
    setSelectedImage,
    setBackendImage,
    setFrontendImage,
  } = useContext(userDataContext);

  return (
    <div
      className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${
        selectedImage === image
          ? "border-4 border-white shadow-2xl shadow-blue-950"
          : ""
      }`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null); // কাস্টম ইমেজ রিসেট করুন
        setFrontendImage(null); // ফ্রন্টএন্ড প্রিভিউ রিসেট করুন
      }}
    >
      <img src={image} className="h-full object-cover" alt="Assistant" />
    </div>
  );
}

export default Card;
